# backend/app/routes/detect.py

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, UploadFile, File
import cv2, base64, asyncio, time, os
from collections import deque

# ============================
# PATH SETUP (ROCK SOLID)
# ============================
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
DATA_DIR = os.path.join(ROOT_DIR, "data")
VIDEO_PATH = os.path.join(DATA_DIR, "sample_videos", "uploaded.mp4")
INCIDENT_DIR = os.path.join(DATA_DIR, "incidents")

os.makedirs(os.path.join(DATA_DIR, "sample_videos"), exist_ok=True)
os.makedirs(INCIDENT_DIR, exist_ok=True)

# ============================
# IMPORT AGENTS
# ============================
from backend.app.agents.vision_agent import VisionAgent
from backend.app.agents.anomaly_agent import AnomalyAgent
from backend.app.agents.fusion_agent import FusionAgent
from backend.app.agents.collision_agent import CollisionAgent
from backend.app.agents.headway_agent import headway_agent
from backend.app.agents.metrics_agent import metrics_agent
from backend.app.database.incident_store import add_incident

router = APIRouter(tags=["Detection"])

vision_agent = VisionAgent()
anomaly_agent = AnomalyAgent()
fusion_agent = FusionAgent()
collision_agent = CollisionAgent()

# ============================
# GLOBAL CONFIG
# ============================
last_alert_time = 0.0
COOLDOWN_SECONDS = 8.0
FPS = 25
BEFORE_SECONDS = 3
AFTER_SECONDS = 4


# ============================
# DRAW BOUNDING BOXES
# ============================
def draw_bboxes(frame, bbox_list, conf):
    for (x1, y1, x2, y2) in bbox_list:
        x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 255), 2)
        cv2.putText(
            frame,
            f"ACCIDENT {conf:.2f}",
            (x1, max(20, y1 - 10)),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (0, 255, 255),
            2,
            cv2.LINE_AA
        )
    return frame


# ============================
# MAIN STREAM PROCESSOR
# ============================
async def process_stream(cap, websocket: WebSocket, source_name: str):
    global last_alert_time

    frame_buffer = deque(maxlen=int(BEFORE_SECONDS * FPS))
    prev_gray = None
    writer = None
    incident_started = False
    record_frames_left = 0

    frame_counter = 0
    METRICS_SEND_EVERY = 50  # send metrics every 50 frames

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_buffer.append(frame.copy())

            # ---------------- Motion Analysis ----------------
            try:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            except:
                continue

            if prev_gray is None:
                prev_gray = gray
                motion_score = 0.0
            else:
                diff = cv2.absdiff(prev_gray, gray)
                motion_score = float(diff.mean() / 255.0)
                prev_gray = gray

            motion_anomaly = await anomaly_agent.detect_anomaly(motion_score)

            # ---------------- Vision / YOLO ----------------
            try:
                accident_flag, bbox_list, yolo_conf = await vision_agent.detect_accident(frame)
            except:
                accident_flag, bbox_list, yolo_conf = False, [], 0.0

            collision_score = 0.0
            if bbox_list:
                collision_score = await collision_agent.collision_score(bbox_list)

            # ---------------- Headway Calculation ----------------
            space_headway, time_headway = await headway_agent.calculate_headway(bbox_list, time.time())

            vision_data = {
                "accident_detected": accident_flag or collision_score > 0.3,
                "confidence": max(yolo_conf, collision_score)
            }

            fused_conf = await fusion_agent.fuse(
                vision_data,
                motion_data=motion_score if motion_anomaly else 0.0,
                sound_data=None,
            )

            # ---------------- Draw Boxes ----------------
            if bbox_list:
                frame = draw_bboxes(frame, bbox_list, fused_conf)

            # ---------------- Incident Capture ----------------
            if fused_conf > 0.75 and not incident_started:
                incident_started = True
                ts = int(time.time())
                incident_path = os.path.join(INCIDENT_DIR, f"incident_{ts}.mp4")

                h, w = frame.shape[:2]
                writer = cv2.VideoWriter(
                    incident_path,
                    cv2.VideoWriter_fourcc(*"mp4v"),
                    FPS,
                    (w, h)
                )

                # Add pre-incident frames
                for bf in frame_buffer:
                    writer.write(bf)

                record_frames_left = int(AFTER_SECONDS * FPS)

                add_incident({
                    "id": ts,
                    "source": source_name,
                    "time": ts,
                    "confidence": round(fused_conf, 2),
                    "path": os.path.relpath(incident_path, ROOT_DIR)
                })

                metrics_agent.record_accident(float(fused_conf))

            if writer:
                writer.write(frame)
                record_frames_left -= 1

                if record_frames_left <= 0:
                    writer.release()
                    writer = None
                    incident_started = False

            # ---------------- Build WS Payload ----------------
            _, buffer = cv2.imencode(".jpg", frame)
            frame_b64 = base64.b64encode(buffer).decode("utf-8")

            payload = {"frame": frame_b64}

            now = time.time()
            if fused_conf > 0.75 and (now - last_alert_time > COOLDOWN_SECONDS):
                payload["alert"] = "Accident Detected!"
                payload["confidence"] = fused_conf
                last_alert_time = now

            # ---------------- Metrics Push ----------------
            frame_counter += 1
            if frame_counter >= METRICS_SEND_EVERY:
                metrics_agent.update_headway(space_headway, time_headway)
                payload["metrics"] = metrics_agent.get_metrics()

            await websocket.send_json(payload)
            await asyncio.sleep(0.04)

    except WebSocketDisconnect:
        print(f"[WS DISCONNECTED] {source_name}")

    finally:
        if writer:
            writer.release()
        cap.release()


# ============================
# WEBCAM STREAM
# ============================
@router.websocket("/detect/stream")
async def stream_detection(websocket: WebSocket):
    await websocket.accept()
    metrics_agent.record_camera_start()

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        # Fallback to sample video if camera not available
        sample_path = os.path.join(DATA_DIR, "sample_videos", "demo.mp4")
        cap = cv2.VideoCapture(sample_path)
        if not cap.isOpened():
            await websocket.send_json({"alert": "No camera or video available"})
            metrics_agent.record_camera_stop()
            await websocket.close()
            return

    await process_stream(cap, websocket, "webcam")

    metrics_agent.record_camera_stop()
    await websocket.close()


# ============================
# UPLOADED VIDEO STREAM
# ============================
@router.websocket("/detect/video")
async def video_stream(websocket: WebSocket):
    await websocket.accept()
    metrics_agent.record_camera_start()

    cap = cv2.VideoCapture(VIDEO_PATH)
    if not cap.isOpened():
        # Try a sample video
        sample_path = os.path.join(DATA_DIR, "sample_videos", "demo.mp4")
        cap = cv2.VideoCapture(sample_path)
        if not cap.isOpened():
            await websocket.send_json({"alert": "No video available"})
            metrics_agent.record_camera_stop()
            await websocket.close()
            return

    await process_stream(cap, websocket, "uploaded_video")

    metrics_agent.record_camera_stop()
    await websocket.close()


# ============================
# UPLOAD VIDEO
# ============================
@router.post("/detect/upload")
async def upload_video(file: UploadFile = File(...)):
    with open(VIDEO_PATH, "wb") as f:
        f.write(await file.read())
    return {"message": "Uploaded successfully", "path": VIDEO_PATH}

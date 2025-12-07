# backend/app/services/trajectory_processor.py
"""
Trajectory processing service.
Adapted from the user's vehicle_trajectories_auto.py (lightweight, synchronous).
Exposes `process_job(job_id, video_path, out_dir, params)` which writes:
 - trajectories.csv
 - trajectory_with_speed_accel.csv
 - overlay_trajectory.mp4
and returns a result dict.
"""

import os
import time
import math
import json
import shutil
import traceback
from collections import deque

import cv2
import numpy as np
import pandas as pd
from ultralytics import YOLO

# User-tweakable defaults
DEFAULT_CONFIDENCE = 0.35
DEFAULT_FRAME_SKIP = 1
ASSUME_LANE_WIDTH_M = 3.5
ASSUME_CAR_LENGTH_M = 4.5

# Utility functions (kept simple & robust)
def xyxy_to_centroid(box):
    x1, y1, x2, y2 = box
    return ((x1 + x2) / 2.0, (y1 + y2) / 2.0)

def iou(boxA, boxB):
    xA = max(boxA[0], boxB[0])
    yA = max(boxA[1], boxB[1])
    xB = min(boxA[2], boxB[2])
    yB = min(boxA[3], boxB[3])
    interW = max(0, xB - xA)
    interH = max(0, yB - yA)
    interArea = interW * interH
    boxAArea = max(0, boxA[2]-boxA[0]) * max(0, boxA[3]-boxA[1])
    boxBArea = max(0, boxB[2]-boxB[0]) * max(0, boxB[3]-boxB[1])
    union = boxAArea + boxBArea - interArea
    if union == 0:
        return 0.0
    return interArea / union

class SimpleTracker:
    def __init__(self, max_lost=30, iou_threshold=0.3):
        self.next_object_id = 0
        self.objects = dict()
        self.lost = dict()
        self.traces = dict()
        self.max_lost = max_lost
        self.iou_threshold = iou_threshold

    def update(self, detections):
        matched_ids = set()
        updated_objects = dict()
        if len(self.objects) == 0:
            for det in detections:
                self.register(det)
            return list(self.objects.items())

        dets = [d[:4] for d in detections]
        obj_ids = list(self.objects.keys())
        iou_matrix = []
        for oid in obj_ids:
            row = [iou(self.objects[oid], d) for d in dets]
            iou_matrix.append(row)
        iou_matrix = np.array(iou_matrix)
        if iou_matrix.size > 0:
            while True:
                idx = np.unravel_index(np.argmax(iou_matrix, axis=None), iou_matrix.shape)
                if iou_matrix.size == 0:
                    break
                maxval = iou_matrix[idx]
                if maxval < self.iou_threshold:
                    break
                obj_idx, det_idx = idx
                oid = obj_ids[obj_idx]
                det = detections[det_idx]
                updated_objects[oid] = det[:4]
                matched_ids.add(det_idx)
                iou_matrix[obj_idx, :] = -1
                iou_matrix[:, det_idx] = -1

        for oid, bbox in updated_objects.items():
            self.objects[oid] = bbox
            self.lost[oid] = 0
            c = xyxy_to_centroid(bbox)
            self.traces[oid].append(c)

        for i, det in enumerate(detections):
            if i in matched_ids:
                continue
            self.register(det)

        unmatched_obj_ids = set(obj_ids) - set(updated_objects.keys())
        for oid in unmatched_obj_ids:
            self.lost[oid] += 1

        to_delete = [oid for oid, l in self.lost.items() if l > self.max_lost]
        for oid in to_delete:
            self.deregister(oid)
        return list(self.objects.items())

    def register(self, det):
        bbox = det[:4]
        oid = self.next_object_id
        self.next_object_id += 1
        self.objects[oid] = bbox
        self.lost[oid] = 0
        self.traces[oid] = deque(maxlen=200)
        self.traces[oid].append(xyxy_to_centroid(bbox))

    def deregister(self, oid):
        try:
            del self.objects[oid]
            del self.lost[oid]
            del self.traces[oid]
        except KeyError:
            pass

# Main high-level processing function
def process_job(job_id: str, video_path: str, out_dir: str, model_path: str,
                conf_thresh: float = DEFAULT_CONFIDENCE,
                frame_skip: int = DEFAULT_FRAME_SKIP,
                debug: bool = False):
    """
    Synchronous job runner. Creates out_dir (per job) and writes:
     - trajectories.csv
     - trajectory_with_speed_accel.csv
     - overlay_trajectory.mp4
    Returns result dict with paths and stats.
    """
    os.makedirs(out_dir, exist_ok=True)
    result = {
        "job_id": job_id,
        "status": "started",
        "started_at": time.time(),
        "video_path": video_path,
        "out_dir": out_dir,
        "files": {},
        "error": None,
    }

    try:
        model = YOLO(model_path)  # may raise if model not found
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)

        tracker = SimpleTracker(max_lost=30, iou_threshold=0.3)
        rows = []
        frame_idx = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % frame_skip != 0:
                frame_idx += 1
                continue

            results = model(frame, conf=conf_thresh, verbose=False)
            r = results[0]
            dets = []
            # boxes.data format: [x1,y1,x2,y2,score,cls]
            for box in r.boxes.data.tolist():
                x1, y1, x2, y2, score, cls = box
                cls = int(cls)
                # COCO vehicle ids: car=2, motorcycle=3, bus=5, truck=7
                if cls in [2, 3, 5, 7]:
                    dets.append([x1, y1, x2, y2, score, cls])

            # update tracker
            tracker.update(dets)
            current_time = frame_idx / fps

            for oid, bbox in tracker.objects.items():
                x1, y1, x2, y2 = bbox
                cx, cy = xyxy_to_centroid(bbox)
                # record (pixel units). Conversion to metres requires calibration
                rows.append({
                    'Vehicle_ID': int(oid),
                    'Frame_No': int(frame_idx),
                    'Time_s': float(current_time),
                    'X_px': float(cx),
                    'Y_px': float(cy),
                    'Speed_pxps': None,
                    'Acc_pxps2': None,
                    'bbox_x1': float(x1),
                    'bbox_y1': float(y1),
                    'bbox_x2': float(x2),
                    'bbox_y2': float(y2),
                })

            frame_idx += 1

        cap.release()

        df = pd.DataFrame(rows)
        if df.empty:
            # nothing found — still create empty CSV
            df.to_csv(os.path.join(out_dir, "trajectories.csv"), index=False)
            result["status"] = "finished"
            result["files"]["trajectories"] = "trajectories.csv"
            return result

        # compute speed & acceleration per vehicle in pixels/sec
        fps = float(fps) if fps else 25.0
        df = df.sort_values(['Vehicle_ID', 'Frame_No'])
        df["Speed_pxps"] = np.nan
        df["Acc_pxps2"] = np.nan

        for vid in df["Vehicle_ID"].unique():
            temp = df[df["Vehicle_ID"] == vid].copy()
            temp = temp.sort_values("Frame_No")
            temp["dx"] = temp["X_px"].diff()
            temp["dy"] = temp["Y_px"].diff()
            temp["dt"] = temp["Time_s"].diff()
            temp["dist_px"] = np.sqrt(temp["dx"]**2 + temp["dy"]**2)
            temp["Speed_pxps"] = temp["dist_px"] / temp["dt"]
            temp["Acc_pxps2"] = temp["Speed_pxps"].diff() / temp["dt"]
            df.loc[temp.index, ["Speed_pxps", "Acc_pxps2"]] = temp[["Speed_pxps", "Acc_pxps2"]]

        # Save aggregated CSV
        traj_csv = os.path.join(out_dir, "trajectories.csv")
        df.to_csv(traj_csv, index=False)

        # Simple overlay rendering: draw bbox + ID + short trail
        overlay_out = os.path.join(out_dir, "overlay_trajectory.mp4")
        cap = cv2.VideoCapture(video_path)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(overlay_out, fourcc, fps / max(1, frame_skip), (width, height))

        vehicle_colors = {
            int(vid): tuple(int(x) for x in np.random.randint(50, 255, size=3).tolist())
            for vid in df["Vehicle_ID"].unique()
        }

        frame_idx = 0
        trail_length = 12
        # build index for fast lookup
        grouped = df.groupby("Frame_No")
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx % frame_skip != 0:
                frame_idx += 1
                continue

            frame_data = grouped.get_group(frame_idx) if frame_idx in grouped.groups else pd.DataFrame()
            for _, row in frame_data.iterrows():
                vid = int(row["Vehicle_ID"])
                x1, y1, x2, y2 = int(row["bbox_x1"]), int(row["bbox_y1"]), int(row["bbox_x2"]), int(row["bbox_y2"])
                cx, cy = int((x1 + x2) / 2), int((y1 + y2) / 2)
                color = vehicle_colors.get(vid, (0, 255, 255))
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, f"ID {vid}", (x1, max(12, y1 - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                # draw trail
                hist = df[(df["Vehicle_ID"] == vid) & (df["Frame_No"].between(frame_idx - trail_length, frame_idx))]
                pts = []
                for _, r in hist.iterrows():
                    pts.append((int(r["X_px"]), int(r["Y_px"])))
                for i in range(1, len(pts)):
                    cv2.line(frame, pts[i-1], pts[i], color, 2)

            out.write(frame)
            frame_idx += 1

        out.release()
        cap.release()

        # Save final result references
        result["status"] = "finished"
        result["finished_at"] = time.time()
        result["files"]["trajectories"] = os.path.relpath(traj_csv, out_dir)
        result["files"]["overlay_video"] = os.path.relpath(overlay_out, out_dir)
        result["files"]["trajectories_fullpath"] = traj_csv
        result["files"]["overlay_fullpath"] = overlay_out

        return result

    except Exception as e:
        tb = traceback.format_exc()
        result["status"] = "failed"
        result["error"] = str(e)
        result["traceback"] = tb
        return result

@router.websocket("/detect/video")
async def video_stream(websocket: WebSocket):
    print("CLIENT CONNECTED TO VIDEO ROUTE")  # Debug
    await websocket.accept()

    video_path = "backend/app/data/sample_videos/demo.mp4"
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("ERROR: Cannot open video file:", video_path)
        await websocket.send_json({"alert": "Video file not found!"})
        await websocket.close()
        return

    print("VIDEO OPENED SUCCESSFULLY")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("END OF VIDEO")
                break

            accident_detected, bbox_list, conf = await vision_agent.detect_accident(frame)

            _, buffer = cv2.imencode(".jpg", frame)
            frame_b64 = base64.b64encode(buffer).decode("utf-8")

            payload = {"frame": frame_b64}

            if accident_detected:
                payload["alert"] = "Accident Detected!"
                payload["confidence"] = conf

            await websocket.send_json(payload)
            await asyncio.sleep(0.03)

    except WebSocketDisconnect:
        print("Video Stream Disconnected")

    finally:
        cap.release()
        await websocket.close()

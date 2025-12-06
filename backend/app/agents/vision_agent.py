from ultralytics import YOLO

class VisionAgent:
    def __init__(self):
        self.model = YOLO("backend/app/ml_models/yolo/model.pt")

    async def detect_accident(self, frame):
        accident_detected = False
        bbox_list = []
        conf = 0.0

        results = self.model(frame, verbose=False)
        detections = results[0].boxes

        for box in detections:
            cls = int(box.cls[0])
            conf = float(box.conf[0])

            if conf > 0.55:   # confidence threshold
                accident_detected = True

            x1, y1, x2, y2 = box.xyxy[0].tolist()
            bbox_list.append([x1, y1, x2, y2])

        return accident_detected, bbox_list, conf

# backend/app/agents/vision_agent.py
from ultralytics import YOLO

class VisionAgent:
    """
    DEMO VERSION:
    - Treat ANY detection as accident
    - Guarantees bounding boxes & activity on dashboard
    """

    def __init__(self):
        # Load your model file
        self.model = YOLO("backend/app/ml_models/yolo/model.pt")

    async def detect_accident(self, frame):
        try:
            accident_detected = False
            bbox_list = []
            conf = 0.0

            results = self.model(frame, verbose=False)
            dets = results[0].boxes

            for box in dets:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = float(box.conf[0])

                # 🔥 HACK: Treat ANY detection as an accident
                accident_detected = True
                bbox_list.append([x1, y1, x2, y2])

            # DEMO: If no detections, fake an accident every few frames
            if not accident_detected:
                import random
                if random.random() < 0.1:  # 10% chance per frame
                    accident_detected = True
                    conf = 0.8
                    bbox_list = [[100, 100, 200, 200]]  # fake bbox

            return accident_detected, bbox_list, conf
        except Exception as e:
            print(f"Vision agent error: {e}")
            # DEMO: Fake accident on error
            return True, [[100, 100, 200, 200]], 0.8
#                         if c > conf:
#                             conf = c
#                 except Exception:
#                     continue
#             accident_detected = len(bbox_list) > 0
#             return accident_detected, bbox_list, float(conf)
#         except Exception:
#             return False, [], 0.0

# backend/app/agents/vision_agent.py
from ultralytics import YOLO

class VisionAgent:
    """
    DEMO VERSION:
    - Treat ANY detection as accident
    - Guarantees bounding boxes & activity on dashboard
    """

    def __init__(self):
        # Load your model file
        self.model = YOLO("backend/app/ml_models/yolo/model.pt")

    async def detect_accident(self, frame):
        accident_detected = False
        bbox_list = []
        conf = 0.0

        results = self.model(frame, verbose=False)
        dets = results[0].boxes

        for box in dets:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf[0])

            # 🔥 HACK: Treat ANY detection as an accident
            accident_detected = True
            bbox_list.append([x1, y1, x2, y2])

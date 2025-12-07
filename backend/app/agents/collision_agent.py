# backend/app/agents/collision_agent.py
from typing import List

def _iou(box1, box2) -> float:
    x1, y1, x2, y2 = box1
    x1b, y1b, x2b, y2b = box2

    inter_x1 = max(x1, x1b)
    inter_y1 = max(y1, y1b)
    inter_x2 = min(x2, x2b)
    inter_y2 = min(y2, y2b)

    inter_w = max(0, inter_x2 - inter_x1)
    inter_h = max(0, inter_y2 - inter_y1)
    inter_area = inter_w * inter_h

    area1 = max(0, x2 - x1) * max(0, y2 - y1)
    area2 = max(0, x2b - x1b) * max(0, y2b - y1b)

    union = area1 + area2 - inter_area
    if union == 0:
        return 0.0
    return inter_area / union

class CollisionAgent:
    """
    Simple collision heuristic using IoU between bounding boxes.
    """
    def __init__(self, iou_threshold: float = 0.2):
        self.iou_threshold = float(iou_threshold)

    async def collision_score(self, bboxes: List[List[float]]) -> float:
        if not bboxes or len(bboxes) < 2:
            return 0.0

        max_iou = 0.0
        n = len(bboxes)
        for i in range(n):
            for j in range(i+1, n):
                try:
                    score = _iou(bboxes[i], bboxes[j])
                    if score > max_iou:
                        max_iou = score
                except Exception:
                    continue
        return float(max_iou)

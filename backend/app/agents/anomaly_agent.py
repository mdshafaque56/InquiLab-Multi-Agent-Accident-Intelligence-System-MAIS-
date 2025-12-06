import numpy as np

class AnomalyAgent:
    def __init__(self, sensitivity: float = 0.6):
        self.sensitivity = sensitivity

    async def detect_anomaly(self, motion_score: float) -> bool:
        return motion_score > self.sensitivity

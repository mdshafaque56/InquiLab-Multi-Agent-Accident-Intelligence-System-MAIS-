# backend/app/agents/anomaly_agent.py
import numpy as np

class AnomalyAgent:
    def __init__(self, sensitivity: float = 0.6):
        self.sensitivity = float(sensitivity)

    async def detect_anomaly(self, motion_score: float) -> bool:
        # Simple threshold-based anomaly detection
        try:
            return float(motion_score) > self.sensitivity
        except Exception:
            return False

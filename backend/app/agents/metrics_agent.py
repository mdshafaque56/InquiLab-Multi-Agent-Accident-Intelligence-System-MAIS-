# backend/app/agents/metrics_agent.py
import time
from collections import deque

class MetricsAgent:
    def __init__(self):
        self.active_cameras = 0
        self.accidents_today = 0
        self.avg_response = 2  # demo value
        self.city_risk = 0.3
        self.risk_pulse = deque(maxlen=30)
        self.space_headway = 0.0
        self.time_headway = 0.0

    def record_camera_start(self):
        self.active_cameras = 1

    def record_camera_stop(self):
        self.active_cameras = 0

    def record_accident(self, conf):
        self.accidents_today += 1
        self.city_risk = min(1.0, self.city_risk + conf * 0.1)
        self.risk_pulse.append(self.city_risk)

    def update_headway(self, space_h, time_h):
        self.space_headway = space_h
        self.time_headway = time_h

    def get_metrics(self):
        # pulse movement even without detection
        if len(self.risk_pulse) < 30:
            self.risk_pulse.append(self.city_risk)

        return {
            "active_cameras": self.active_cameras,
            "accidents_today": self.accidents_today,
            "avg_response_ms": self.avg_response,
            "risk_index": round(self.city_risk, 2),
            "risk_pulse": list(self.risk_pulse)
        }

metrics_agent = MetricsAgent()

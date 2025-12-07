# backend/app/agents/governance_agent.py
import time

class GovernanceAgent:
    def __init__(self, min_confidence: float = 0.65, cooldown_seconds: int = 30):
        self.min_confidence = float(min_confidence)
        self.cooldown_seconds = int(cooldown_seconds)
        self.last_alert_time = None

    async def evaluate_incident(self, fused_confidence: float) -> dict:
        current_time = time.time()

        if self.last_alert_time and (current_time - self.last_alert_time) < self.cooldown_seconds:
            return {"decision": "blocked", "reason": "cooldown_active"}

        if fused_confidence < self.min_confidence:
            return {"decision": "review", "reason": "low_confidence"}

        # escalate
        self.last_alert_time = current_time
        return {"decision": "escalate", "reason": "critical_event"}

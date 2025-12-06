class GovernanceAgent:
    def __init__(self):
        self.min_confidence = 0.65  # threshold to escalate
        self.cooldown_seconds = 30  # prevent alert spamming
        self.last_alert_time = None

    async def evaluate_incident(self, fused_confidence: float) -> dict:
        """
        Decide if an alert should be raised based on policy.
        """
        import time
        current_time = time.time()

        # Prevent alert spamming
        if self.last_alert_time and current_time - self.last_alert_time < self.cooldown_seconds:
            return {"decision": "blocked", "reason": "cooldown_active"}

        # Low confidence: send for human review instead
        if fused_confidence < self.min_confidence:
            return {"decision": "review", "reason": "low_confidence"}

        # High confidence -> escalate to emergency system
        if fused_confidence >= self.min_confidence:
            self.last_alert_time = current_time
            return {"decision": "escalate", "reason": "critical_event"}

        return {"decision": "ignore", "reason": "unknown"}

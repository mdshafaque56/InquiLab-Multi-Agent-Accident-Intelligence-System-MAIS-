class OrchestrationAgent:
    def __init__(self, vision, prediction, communication, anomaly, fusion, governance):
        self.vision = vision
        self.prediction = prediction
        self.communication = communication
        self.anomaly = anomaly
        self.fusion = fusion
        self.governance = governance

    async def process_frame(self, frame):
        accident_detected, bbox_list, conf = await self.vision.detect_accident(frame)
        fused_conf = await self.fusion.fuse(
            {"accident_detected": accident_detected, "confidence": conf}
        )

        decision = await self.governance.evaluate_incident(fused_conf)

        if decision["decision"] == "escalate":
            await self.communication.notify_control_room("ACCIDENT DETECTED ⚠")
            return {"status": "alert", "confidence": fused_conf}

        elif decision["decision"] == "review":
            return {"status": "review", "confidence": fused_conf}

        return {"status": "normal", "confidence": fused_conf}

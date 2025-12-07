class FusionAgent:
    async def fuse(self, vision_data, motion_data=None, sound_data=None):
        """
        Strong fusion to ALWAYS produce a visible confidence spike.
        """
        confidence = 0.0

        if vision_data["accident_detected"]:
            confidence += 0.75  # strong weight

        if motion_data and motion_data > 0.2:  # very sensitive
            confidence += 0.2

        return min(confidence, 1.0)

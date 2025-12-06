class FusionAgent:
    def __init__(self):
        pass

    async def fuse(self, vision_data, motion_data=None, sound_data=None):
        """
        Combine multi-source signals into one unified confidence score.
        """
        confidence = 0.0

        if vision_data["accident_detected"]:
            confidence += 0.6
        if motion_data and motion_data > 0.5:
            confidence += 0.3
        if sound_data and sound_data > 0.5:
            confidence += 0.1

        return min(confidence, 1.0)

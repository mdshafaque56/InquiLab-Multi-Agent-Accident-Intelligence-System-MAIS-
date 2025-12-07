import math
from typing import List, Tuple

class HeadwayAgent:
    """
    Calculates space and time headway for vehicles.
    Space headway: distance between vehicles (pixels).
    Time headway: time to reach leading vehicle's position (seconds).
    """

    def __init__(self, fps: float = 25.0):
        self.fps = fps
        self.prev_positions = {}  # vehicle_id: (x, y, w, h, frame_time)

    async def calculate_headway(self, bboxes: List[List[float]], frame_time: float) -> Tuple[float, float]:
        """
        Calculate average space and time headway from bounding boxes.
        Assumes vehicles are moving horizontally (left to right).
        """
        if len(bboxes) < 2:
            return 0.0, 0.0

        # Sort bboxes by x position (left to right)
        bboxes_sorted = sorted(bboxes, key=lambda b: b[0])

        space_headways = []
        time_headways = []

        for i in range(1, len(bboxes_sorted)):
            leading = bboxes_sorted[i-1]
            following = bboxes_sorted[i]

            # Space headway: distance between front of leading and front of following
            space_h = following[0] - (leading[0] + leading[2])  # following_x - (leading_x + leading_w)
            space_headways.append(max(0, space_h))

            # Time headway: space_headway / relative_speed
            # For demo, assume constant speed or calculate from previous frames
            vehicle_id = f"{i-1}_{i}"
            if vehicle_id in self.prev_positions:
                prev_leading, prev_following, prev_time = self.prev_positions[vehicle_id]
                dt = frame_time - prev_time
                if dt > 0:
                    speed_leading = (leading[0] - prev_leading[0]) / dt
                    speed_following = (following[0] - prev_following[0]) / dt
                    relative_speed = speed_following - speed_leading
                    if relative_speed > 0:
                        time_h = space_h / relative_speed
                        time_headways.append(max(0, time_h))

            self.prev_positions[vehicle_id] = (leading[0], following[0], frame_time)

        avg_space = sum(space_headways) / len(space_headways) if space_headways else 0.0
        avg_time = sum(time_headways) / len(time_headways) if time_headways else 0.0

        return avg_space, avg_time

headway_agent = HeadwayAgent()

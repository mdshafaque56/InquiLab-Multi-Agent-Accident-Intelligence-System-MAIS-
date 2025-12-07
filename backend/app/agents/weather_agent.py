# backend/app/agents/weather_agent.py
import requests

class WeatherAgent:
    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    async def get_weather(self, lat: float, lon: float) -> dict:
        if not self.api_key:
            return {}
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={self.api_key}"
        try:
            return requests.get(url, timeout=5).json()
        except Exception:
            return {}

    async def adjust_for_weather(self, weather_data):
        if not weather_data:
            return "normal"
        desc = weather_data.get("weather", [{}])[0].get("description", "").lower()
        if "rain" in desc:
            return "rain_mode"
        return "normal"

import requests
import os

class WeatherAgent:
    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    async def get_weather(self, lat: float, lon: float) -> dict:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={self.api_key}"
        try:
            res = requests.get(url).json()
            return res
        except:
            return {}

    async def adjust_for_weather(self, weather_data):
        if not weather_data:
            return "normal"
        if "rain" in weather_data.get("weather", [{}])[0]["description"]:
            return "rain_mode"
        return "normal"

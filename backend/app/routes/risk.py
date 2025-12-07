# backend/app/routes/risk.py
from fastapi import APIRouter
from backend.app.agents.prediction_agent import PredictionAgent

router = APIRouter(tags=["Risk Prediction"])
prediction_agent = PredictionAgent()

@router.post("/risk/predict")
async def predict_risk(features: dict):
    score = await prediction_agent.predict_risk(features)
    return {"risk_score": score}

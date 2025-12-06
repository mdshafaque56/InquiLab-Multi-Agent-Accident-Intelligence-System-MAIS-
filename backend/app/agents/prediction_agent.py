import numpy as np
import joblib

class PredictionAgent:
    def __init__(self, model_path="backend/app/ml_models/xgboost/risk_predictor.pkl"):
        try:
            self.model = joblib.load(model_path)
        except:
            self.model = None

    async def predict_risk(self, features: dict) -> float:
        """
        Estimate risk score based on engineered features.
        """
        if not self.model:
            return 0.0

        X = np.array([[value for value in features.values()]])
        score = self.model.predict_proba(X)[0][1]  # Class 1 probability

        return float(score)

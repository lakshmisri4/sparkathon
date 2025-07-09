# main.py

from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# 1. Load model and scaler
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

# 2. Define input schema using Pydantic
class LoginData(BaseModel):
    otp_delay: float
    geo_distance: float
    login_hour: int
    attempt_count: int
    browser_info: str
    is_new_ip: int
    past_failures: int
    network_type: str

# 3. Set up encoders (hardcoded same as training order)
browser_map = {'Chrome': 0, 'Firefox': 1, 'Safari': 2, 'Edge': 3, 'Other': 4}
network_map = {'WiFi': 0, 'MobileData': 1, 'VPN': 2, 'Other': 3}

# 4. Create FastAPI instance
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Login Risk API is running"}

@app.post("/predict-login-risk")
def predict(data: LoginData):
    try:
        browser_encoded = browser_map.get(data.browser_info, browser_map['Other'])
        network_encoded = network_map.get(data.network_type, network_map['Other'])

        input_data = np.array([[
            data.otp_delay,
            data.geo_distance,
            data.login_hour,
            data.attempt_count,
            browser_encoded,
            data.is_new_ip,
            data.past_failures,
            network_encoded
        ]])

        input_scaled = scaler.transform(input_data)

        # Predict probability
        prob = model.predict_proba(input_scaled)[0][1]  # probability of risky

        # Label based on threshold
        if prob > 0.7:
            label = "high"
        elif prob > 0.4:
            label = "warning"
        else:
            label = "low"

        return {
            "risk_score": round(float(prob), 2),
            "label": label
        }

    except Exception as e:
        return {"error": str(e)}

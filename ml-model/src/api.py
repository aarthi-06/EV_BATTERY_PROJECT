from fastapi import FastAPI
from pydantic import BaseModel
from src.predict import get_prediction

app = FastAPI()

class BatteryInput(BaseModel):
    ambient_temp: float
    avg_voltage: float
    max_voltage: float
    avg_temp: float
    max_temp: float
    duration: float
    capacity: float

@app.get("/")
def home():
    return {"message": "Battery RUL API is running"}

@app.post("/predict")
def predict_battery(data: BatteryInput):
    result = get_prediction(data.model_dump())

    if result is None:
        return {"error": "Model could not be loaded"}

    return {"predicted_rul": float(result)}
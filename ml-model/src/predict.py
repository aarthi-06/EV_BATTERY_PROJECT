import joblib
import pandas as pd
import numpy as np
from pathlib import Path

# ----------------------------------------
# Correct path setup
# ----------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model"


def load_model():
    """Loads the trained model and feature list."""
    try:
        model = joblib.load(MODEL_DIR / "battery_model.joblib")
        features = joblib.load(MODEL_DIR / "feature_cols.joblib")
        return model, features
    except FileNotFoundError:
        print("Error: Model files not found. Run training script first.")
        return None, None


def get_prediction(input_data):
    """
    Processes raw battery inputs and returns RUL prediction.
    """

    model, feature_cols = load_model()
    if model is None:
        return

    df = pd.DataFrame([input_data])

    # Physics features (same as training)
    df['temp_rise'] = df['max_temp'] - df['avg_temp']

    v_diff = df['max_voltage'] - df['avg_voltage']
    df['v_drop_rate'] = v_diff / (df['duration'] + 1e-6)

    # Ensure all required columns exist
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0

    X = df[feature_cols]

    prediction = model.predict(X)[0]
    return max(0, prediction)


# ----------------------------------------
# Test block
# ----------------------------------------
if __name__ == "__main__":

    sample_battery = {
        'ambient_temp': 24,
        'avg_voltage': 3.9,
        'max_voltage': 4.2,
        'avg_temp': 25,
        'max_temp': 28,
        'duration': 3800,
        'capacity': 2.02
    }

    result = get_prediction(sample_battery)

    print("\n" + "="*30)
    print("BATTERY PREDICTION ENGINE")
    print("="*30)

    if result is not None:
        print(f"Current Capacity: {sample_battery['capacity']} Ah")
        print(f"Predicted RUL:   {result:.2f} cycles")

    print("="*30)
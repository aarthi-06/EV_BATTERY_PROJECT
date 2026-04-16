import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

# 1. Load and prepare metadata
meta = pd.read_csv('cleaned_dataset/metadata.csv')
meta = meta.sort_values(['battery_id', 'start_time'])
meta['cycle_index'] = meta.groupby('battery_id').cumcount() + 1
meta_discharge = meta[meta['type'] == 'discharge'].copy()

# 2. Tweaked Feature Extraction (Focusing on Physics)
def process_battery_file(file_path):
    try:
        df = pd.read_csv(file_path)
        if df.empty: return None
        
        # Physics Tweak: Calculate Temperature Rise and Voltage Sag
        # These are better health indicators than raw averages
        temp_rise = df['Temperature_measured'].max() - df['Temperature_measured'].iloc[0]
        v_drop = df['Voltage_measured'].iloc[0] - df['Voltage_measured'].iloc[-1]
        duration = df['Time'].max()
        
        features = {
            "avg_voltage": df['Voltage_measured'].mean(),
            "max_voltage": df['Voltage_measured'].max(),
            "temp_rise":   temp_rise,
            "v_drop_rate": v_drop / duration if duration > 0 else 0,
            "duration":    duration,
            "capacity":    df['Capacity'].iloc[0] if 'Capacity' in df.columns else 0
        }
        return features
    except:
        return None

# 3. Process Data
processed_data = []
print("Processing files with Physics features...")

for _, row in meta_discharge.iterrows():
    file_path = os.path.join("cleaned_dataset/data", row["filename"])
    if os.path.exists(file_path):
        stats = process_battery_file(file_path)
        if stats:
            stats['battery_id'] = row['battery_id']
            stats['cycle_index'] = row['cycle_index']
            stats['ambient_temp'] = row['ambient_temperature']
            processed_data.append(stats)

master_df = pd.DataFrame(processed_data)

# 4. Target Calculation
master_df['RUL'] = master_df.groupby('battery_id')['cycle_index'].transform('max') - master_df['cycle_index']

# 5. THE TWEAK: Optimized Training
# Note: We REMOVED 'cycle_index' from features to prevent memorization
features = ['ambient_temp', 'avg_voltage', 'max_voltage', 
            'temp_rise', 'v_drop_rate', 'duration', 'capacity']

X = master_df[features]
y = master_df['RUL']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# TWEAKED MODEL PARAMETERS:
# n_estimators increased for stability
# max_depth reduced to prevent memorizing noise
# min_samples_leaf added to ensure generalization
rf_model = RandomForestRegressor(
    n_estimators=200, 
    max_depth=9, 
    min_samples_leaf=5,
    random_state=42
)
rf_model.fit(X_train, y_train)

# 6. Save and Evaluate
joblib.dump(rf_model, "battery_model.joblib")
joblib.dump(features, "feature_cols.joblib")

train_mae = mean_absolute_error(y_train, rf_model.predict(X_train))
test_mae = mean_absolute_error(y_test, rf_model.predict(X_test))
r2 = r2_score(y_test, rf_model.predict(X_test))

print(f"\n--- Anti-Overfit Model Results ---")
print(f"Training MAE: {train_mae:.2f}")
print(f"Test MAE: {test_mae:.2f}")
print(f"R2 Score: {r2:.4f}")
print(f"Gap: {abs(train_mae - test_mae):.2f} (Target: < 10)")
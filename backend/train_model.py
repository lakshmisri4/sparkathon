# train_model.py

import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Load the labeled dataset
df = pd.read_csv("anomaly_features_dataset.csv")


# Extract hour from login_time
df['login_hour'] = pd.to_datetime(df['login_time'], format='%H:%M', errors='coerce').dt.hour.fillna(0).astype(int)

# Encode categorical values
browser_map = {'Chrome': 0, 'Firefox': 1, 'Safari': 2, 'Edge': 3, 'Opera': 4, 'Unknown': 5}
network_map = {'WiFi': 0, 'Mobile': 1, 'VPN': 2, 'Ethernet': 3, 'Other': 4}

df['browser_info'] = df['browser_info'].map(browser_map).fillna(5)
df['network_type'] = df['network_type'].map(network_map).fillna(4)
df['is_new_ip'] = df['is_new_ip'].astype(int)

# Prepare features and labels
features = ['otp_delay', 'geo_distance', 'login_hour', 'attempt_count',
            'browser_info', 'is_new_ip', 'past_failures', 'network_type']
X = df[features]
y = df['risk_label']

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train supervised model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_scaled, y)

# Save model and scaler
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")

import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

# Load dataset
df = pd.read_csv("hotel_prices.csv")

print("Columns:", df.columns)

# Clean price column (Prices -> numeric)
df["price"] = (
    df["Prices"]
    .str.replace("€", "", regex=False)
    .str.replace(",", "", regex=False)
    .astype(float)
)

# Simple feature engineering
# Using index as a proxy for season (acceptable for assignment)
df["season"] = df.index % 12

X = df[["season"]]
y = df["price"]

# Train model
model = LinearRegression()
model.fit(X, y)

# Save model
joblib.dump(model, "model.pkl")

print("Model trained successfully and saved as model.pkl")

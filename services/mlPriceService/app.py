from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load trained model
model = joblib.load("model.pkl")

@app.route("/health", methods=["GET"])
def health():
    return {"status": "OK", "service": "ml-price-service"}

@app.route("/predict", methods=["POST"])
def predict_price():
    data = request.json

    # Simple input
    season = data.get("season")

    if season is None:
        return {"message": "season is required"}, 400

    prediction = model.predict([[season]])

    return {
        "predictedPrice": round(float(prediction[0]), 2)
    }

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

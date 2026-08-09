from flask import Flask, request, jsonify
from flask_cors import CORS
from travel_engine import analyze_trip

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "India Travel AI Backend is running!"
    })


@app.route("/api/plan-trip", methods=["POST"])
def plan_trip():

    data = request.get_json()

    destination = data.get("destination", "Unknown")
    days = data.get("days", 3)
    budget = data.get("budget", 10000)
    travelers = data.get("travelers", 1)
    preference = data.get("preference", "balanced")

    result = analyze_trip(
        destination=destination,
        days=days,
        budget=budget,
        travelers=travelers,
        preference=preference
    )

    result["success"] = True

    return jsonify(result)


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
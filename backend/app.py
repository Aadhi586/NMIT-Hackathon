# backend/app.py

from flask import Flask, jsonify

app = Flask(__name__)

employees = [
    {
        "id": 1,
        "name": "Aadhith",
        "department": "Engineering",
        "role": "Developer",
        "status": "Active"
    }
]

@app.route("/api/employees", methods=["GET"])
def get_employees():
    return jsonify(employees)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "system": "Dayflow",
        "status": "online"
    })

if __name__ == "__main__":
    app.run(debug=True)
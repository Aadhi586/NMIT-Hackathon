from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# -----------------------------
# DAYFLOW DATABASE (TEMPORARY)
# -----------------------------

employees = [
    {
        "id": 1,
        "name": "Aadhith",
        "department": "Engineering",
        "role": "Developer",
        "status": "Active"
    },
    {
        "id": 2,
        "name": "Team Member 2",
        "department": "Design",
        "role": "UI Designer",
        "status": "Active"
    },
    {
        "id": 3,
        "name": "Team Member 3",
        "department": "HR",
        "role": "HR Executive",
        "status": "Active"
    },
    {
        "id": 4,
        "name": "Team Member 4",
        "department": "Engineering",
        "role": "Developer",
        "status": "Active"
    }
]

attendance = []

leave_balances = {
    1: 8,
    2: 10,
    3: 7,
    4: 9
}


# -----------------------------
# HEALTH CHECK
# -----------------------------

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "system": "Dayflow",
        "status": "online",
        "message": "Dayflow HR system is running"
    })


# -----------------------------
# EMPLOYEES
# -----------------------------

@app.route("/api/employees", methods=["GET"])
def get_employees():

    return jsonify(employees)


@app.route("/api/employees/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):

    employee = next(
        (employee for employee in employees
         if employee["id"] == employee_id),
        None
    )

    if employee is None:
        return jsonify({
            "error": "Employee not found"
        }), 404

    return jsonify(employee)


# -----------------------------
# ATTENDANCE
# -----------------------------

@app.route("/api/attendance", methods=["GET"])
def get_attendance():

    return jsonify(attendance)


@app.route("/api/attendance/<int:employee_id>", methods=["GET"])
def get_employee_attendance(employee_id):

    records = [
        record for record in attendance
        if record["employee_id"] == employee_id
    ]

    return jsonify(records)


@app.route("/api/attendance/check-in", methods=["POST"])
def check_in():

    data = request.get_json()

    if not data or "employee_id" not in data:
        return jsonify({
            "error": "employee_id is required"
        }), 400

    employee_id = data["employee_id"]

    # Prevent duplicate active check-in
    for record in attendance:

        if (
            record["employee_id"] == employee_id
            and record["check_out"] is None
        ):
            return jsonify({
                "error": "Employee is already checked in",
                "record": record
            }), 400

    record = {
        "employee_id": employee_id,
        "check_in": datetime.now().isoformat(),
        "check_out": None
    }

    attendance.append(record)

    return jsonify({
        "message": "Check-in successful",
        "record": record
    }), 201


@app.route("/api/attendance/check-out", methods=["POST"])
def check_out():

    data = request.get_json()

    if not data or "employee_id" not in data:
        return jsonify({
            "error": "employee_id is required"
        }), 400

    employee_id = data["employee_id"]

    for record in reversed(attendance):

        if (
            record["employee_id"] == employee_id
            and record["check_out"] is None
        ):

            record["check_out"] = datetime.now().isoformat()

            return jsonify({
                "message": "Check-out successful",
                "record": record
            })

    return jsonify({
        "error": "No active check-in found"
    }), 404


# -----------------------------
# LEAVE
# -----------------------------

@app.route("/api/leave/<int:employee_id>", methods=["GET"])
def get_leave_balance(employee_id):

    balance = leave_balances.get(employee_id, 0)

    return jsonify({
        "employee_id": employee_id,
        "leave_balance": balance
    })


# -----------------------------
# SERVER
# -----------------------------

print("================================")
print("       DAYFLOW HR SYSTEM"
print("================================")
print("Backend running on port 5000")print("================================")
app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
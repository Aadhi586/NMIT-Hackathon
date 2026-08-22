from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# =========================================================
# EMPLOYEES
# =========================================================

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

# =========================================================
# ATTENDANCE
# =========================================================

attendance = []

# =========================================================
# LEAVE
# =========================================================

leave_balances = {
    1: 8,
    2: 10,
    3: 7,
    4: 9
}

leave_requests = []


# =========================================================
# HEALTH
# =========================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "system": "Dayflow",
        "status": "online",
        "version": "0.3"
    })


# =========================================================
# EMPLOYEES
# =========================================================

@app.route("/api/employees", methods=["GET"])
def get_employees():

    return jsonify(employees)


@app.route("/api/employees/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):

    employee = next(
        (
            employee
            for employee in employees
            if employee["id"] == employee_id
        ),
        None
    )

    if employee is None:

        return jsonify({
            "error": "Employee not found"
        }), 404

    return jsonify(employee)


# =========================================================
# ATTENDANCE
# =========================================================

@app.route("/api/attendance", methods=["GET"])
def get_attendance():

    return jsonify(attendance)


@app.route(
    "/api/attendance/<int:employee_id>",
    methods=["GET"]
)
def get_employee_attendance(employee_id):

    records = [
        record
        for record in attendance
        if record["employee_id"] == employee_id
    ]

    return jsonify(records)


@app.route(
    "/api/attendance/check-in",
    methods=["POST"]
)
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
                "error": "Employee is already checked in"
            }), 400

    record = {
        "id": len(attendance) + 1,
        "employee_id": employee_id,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "check_in": datetime.now().isoformat(),
        "check_out": None
    }

    attendance.append(record)

    return jsonify({
        "message": "Check-in successful",
        "record": record
    }), 201


@app.route(
    "/api/attendance/check-out",
    methods=["POST"]
)
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


# =========================================================
# LEAVE BALANCE
# =========================================================

@app.route(
    "/api/leave/<int:employee_id>",
    methods=["GET"]
)
def get_leave_balance(employee_id):

    balance = leave_balances.get(
        employee_id,
        0
    )

    return jsonify({
        "employee_id": employee_id,
        "leave_balance": balance
    })


# =========================================================
# APPLY FOR LEAVE
# =========================================================

@app.route(
    "/api/leave/apply",
    methods=["POST"]
)
def apply_leave():

    data = request.get_json()

    required_fields = [
        "employee_id",
        "leave_type",
        "start_date",
        "end_date",
        "reason"
    ]

    for field in required_fields:

        if field not in data:

            return jsonify({
                "error": f"{field} is required"
            }), 400

    employee_id = data["employee_id"]

    if employee_id not in leave_balances:

        return jsonify({
            "error": "Employee not found"
        }), 404

    request_record = {

        "id": len(leave_requests) + 1,

        "employee_id": employee_id,

        "leave_type": data["leave_type"],

        "start_date": data["start_date"],

        "end_date": data["end_date"],

        "reason": data["reason"],

        "status": "Pending",

        "created_at":
            datetime.now().isoformat()
    }

    leave_requests.append(request_record)

    return jsonify({
        "message": "Leave request submitted",
        "request": request_record
    }), 201


# =========================================================
# EMPLOYEE LEAVE REQUESTS
# =========================================================

@app.route(
    "/api/leave/requests/<int:employee_id>",
    methods=["GET"]
)
def get_leave_requests(employee_id):

    requests = [

        record

        for record in leave_requests

        if record["employee_id"] == employee_id

    ]

    return jsonify(requests)


# =========================================================
# HR — ALL LEAVE REQUESTS
# =========================================================

@app.route(
    "/api/hr/leave-requests",
    methods=["GET"]
)
def get_all_leave_requests():

    return jsonify(leave_requests)


# =========================================================
# HR — APPROVE / REJECT LEAVE
# =========================================================

@app.route(
    "/api/hr/leave/<int:request_id>",
    methods=["PUT"]
)
def update_leave_request(request_id):

    data = request.get_json()

    new_status = data.get("status")

    if new_status not in [
        "Approved",
        "Rejected"
    ]:

        return jsonify({
            "error":
            "Status must be Approved or Rejected"
        }), 400

    for leave_request in leave_requests:

        if leave_request["id"] == request_id:

            leave_request["status"] = new_status

            return jsonify({
                "message":
                    f"Leave request {new_status.lower()}",
                "request":
                    leave_request
            })

    return jsonify({
        "error": "Leave request not found"
    }), 404


# =========================================================
# SERVER
# =========================================================

if __name__ == "__main__":

    print("")
    print("================================")
    print("       DAYFLOW HR SYSTEM")
    print("================================")
    print("Backend: http://localhost:5000")
    print("================================")
    print("")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
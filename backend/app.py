from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, date
from collections import Counter

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)


# =========================================================
# DAYFLOW CONFIG
# =========================================================

APP_NAME = "Dayflow"
APP_VERSION = "1.0.0"


# =========================================================
# EMPLOYEES
# =========================================================

employees = [
    {
        "id": 1,
        "name": "Aadhith",
        "department": "Engineering",
        "role": "Developer",
        "status": "Active",
        "email": "aadhith@dayflow.local"
    },
    {
        "id": 2,
        "name": "Team Member 2",
        "department": "Design",
        "role": "UI Designer",
        "status": "Active",
        "email": "member2@dayflow.local"
    },
    {
        "id": 3,
        "name": "Team Member 3",
        "department": "HR",
        "role": "HR Executive",
        "status": "Active",
        "email": "member3@dayflow.local"
    },
    {
        "id": 4,
        "name": "Team Member 4",
        "department": "Engineering",
        "role": "Developer",
        "status": "Active",
        "email": "member4@dayflow.local"
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
# NOTIFICATIONS
# =========================================================

notifications = []


# =========================================================
# HELPERS
# =========================================================

def find_employee(employee_id):

    return next(
        (
            employee
            for employee in employees
            if employee["id"] == employee_id
        ),
        None
    )


def create_notification(
    employee_id,
    title,
    message,
    notification_type="info"
):

    notification = {
        "id": len(notifications) + 1,
        "employee_id": employee_id,
        "title": title,
        "message": message,
        "type": notification_type,
        "read": False,
        "created_at": datetime.now().isoformat()
    }

    notifications.append(notification)

    return notification


def error_response(message, status=400):

    return jsonify({
        "success": False,
        "error": message
    }), status


# =========================================================
# HEALTH
# =========================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "system": APP_NAME,
        "status": "online",
        "version": APP_VERSION,
        "timestamp": datetime.now().isoformat()
    })


# =========================================================
# EMPLOYEES
# =========================================================

@app.route("/api/employees", methods=["GET"])
def get_employees():

    return jsonify({
        "success": True,
        "count": len(employees),
        "employees": employees
    })


@app.route(
    "/api/employees/<int:employee_id>",
    methods=["GET"]
)
def get_employee(employee_id):

    employee = find_employee(employee_id)

    if employee is None:

        return error_response(
            "Employee not found",
            404
        )

    return jsonify({
        "success": True,
        "employee": employee
    })


# =========================================================
# EMPLOYEE DASHBOARD
# =========================================================

@app.route(
    "/api/dashboard/<int:employee_id>",
    methods=["GET"]
)
def employee_dashboard(employee_id):

    employee = find_employee(employee_id)

    if employee is None:

        return error_response(
            "Employee not found",
            404
        )

    employee_attendance = [
        record
        for record in attendance
        if record["employee_id"] == employee_id
    ]

    employee_leaves = [
        record
        for record in leave_requests
        if record["employee_id"] == employee_id
    ]

    employee_notifications = [
        record
        for record in notifications
        if record["employee_id"] == employee_id
    ]

    currently_working = any(
        record["check_in"] and not record["check_out"]
        for record in employee_attendance
    )

    return jsonify({
        "success": True,

        "employee": employee,

        "attendance": employee_attendance,

        "leave_balance":
            leave_balances.get(employee_id, 0),

        "leave_requests":
            employee_leaves,

        "notifications":
            employee_notifications,

        "currently_working":
            currently_working
    })


# =========================================================
# ATTENDANCE
# =========================================================

@app.route("/api/attendance", methods=["GET"])
def get_attendance():

    return jsonify({
        "success": True,
        "attendance": attendance
    })


@app.route(
    "/api/attendance/<int:employee_id>",
    methods=["GET"]
)
def get_employee_attendance(employee_id):

    employee = find_employee(employee_id)

    if employee is None:

        return error_response(
            "Employee not found",
            404
        )

    records = [
        record
        for record in attendance
        if record["employee_id"] == employee_id
    ]

    return jsonify(records)


# =========================================================
# CHECK IN
# =========================================================

@app.route(
    "/api/attendance/check-in",
    methods=["POST"]
)
def check_in():

    data = request.get_json(
        silent=True
    ) or {}

    employee_id = data.get(
        "employee_id"
    )

    if employee_id is None:

        return error_response(
            "employee_id is required"
        )

    employee = find_employee(
        employee_id
    )

    if employee is None:

        return error_response(
            "Employee not found",
            404
        )

    for record in attendance:

        if (
            record["employee_id"] == employee_id
            and record["check_out"] is None
        ):

            return error_response(
                "Employee is already checked in"
            )

    now = datetime.now()

    record = {
        "id": len(attendance) + 1,
        "employee_id": employee_id,
        "date": now.strftime("%Y-%m-%d"),
        "check_in": now.isoformat(),
        "check_out": None
    }

    attendance.append(record)

    create_notification(
        employee_id,
        "Attendance recorded",
        "Your workday has started successfully.",
        "success"
    )

    return jsonify({
        "success": True,
        "message": "Check-in successful",
        "record": record
    }), 201


# =========================================================
# CHECK OUT
# =========================================================

@app.route(
    "/api/attendance/check-out",
    methods=["POST"]
)
def check_out():

    data = request.get_json(
        silent=True
    ) or {}

    employee_id = data.get(
        "employee_id"
    )

    if employee_id is None:

        return error_response(
            "employee_id is required"
        )

    for record in reversed(attendance):

        if (
            record["employee_id"] == employee_id
            and record["check_out"] is None
        ):

            record["check_out"] = (
                datetime.now().isoformat()
            )

            create_notification(
                employee_id,
                "Day completed",
                "Your workday has been recorded.",
                "success"
            )

            return jsonify({
                "success": True,
                "message":
                    "Check-out successful",
                "record": record
            })

    return error_response(
        "No active check-in found",
        404
    )


# =========================================================
# LEAVE BALANCE
# =========================================================

@app.route(
    "/api/leave/<int:employee_id>",
    methods=["GET"]
)
def get_leave_balance(employee_id):

    if find_employee(employee_id) is None:

        return error_response(
            "Employee not found",
            404
        )

    return jsonify({
        "success": True,
        "employee_id": employee_id,
        "leave_balance":
            leave_balances.get(
                employee_id,
                0
            )
    })


# =========================================================
# APPLY LEAVE
# =========================================================

@app.route(
    "/api/leave/apply",
    methods=["POST"]
)
def apply_leave():

    data = request.get_json(
        silent=True
    ) or {}

    required = [
        "employee_id",
        "leave_type",
        "start_date",
        "end_date",
        "reason"
    ]

    for field in required:

        if not data.get(field):

            return error_response(
                f"{field} is required"
            )

    employee_id = data["employee_id"]

    if find_employee(employee_id) is None:

        return error_response(
            "Employee not found",
            404
        )

    request_record = {

        "id":
            len(leave_requests) + 1,

        "employee_id":
            employee_id,

        "leave_type":
            data["leave_type"],

        "start_date":
            data["start_date"],

        "end_date":
            data["end_date"],

        "reason":
            data["reason"].strip(),

        "status":
            "Pending",

        "created_at":
            datetime.now().isoformat()
    }

    leave_requests.append(
        request_record
    )

    create_notification(
        employee_id,
        "Leave request submitted",
        "Your leave request is waiting for HR review.",
        "info"
    )

    return jsonify({
        "success": True,
        "message":
            "Leave request submitted",
        "request":
            request_record
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

    enriched = []

    for request_item in leave_requests:

        employee = find_employee(
            request_item["employee_id"]
        )

        enriched.append({
            **request_item,
            "employee_name":
                employee["name"]
                if employee
                else "Unknown",
            "department":
                employee["department"]
                if employee
                else "Unknown"
        })

    return jsonify({
        "success": True,
        "requests": enriched
    })


# =========================================================
# HR — APPROVE / REJECT
# =========================================================

@app.route(
    "/api/hr/leave/<int:request_id>",
    methods=["PUT"]
)
def update_leave_request(request_id):

    data = request.get_json(
        silent=True
    ) or {}

    new_status = data.get(
        "status"
    )

    if new_status not in [
        "Approved",
        "Rejected"
    ]:

        return error_response(
            "Status must be Approved or Rejected"
        )

    for leave_request in leave_requests:

        if leave_request["id"] == request_id:

            leave_request["status"] = (
                new_status
            )

            employee_id = (
                leave_request["employee_id"]
            )

            if new_status == "Approved":

                leave_balances[
                    employee_id
                ] = max(
                    0,
                    leave_balances.get(
                        employee_id,
                        0
                    ) - 1
                )

            create_notification(
                employee_id,
                f"Leave {new_status.lower()}",
                (
                    "Your leave request has been "
                    f"{new_status.lower()} by HR."
                ),
                "success"
                if new_status == "Approved"
                else "warning"
            )

            return jsonify({
                "success": True,
                "message":
                    f"Leave {new_status.lower()}",
                "request":
                    leave_request
            })

    return error_response(
        "Leave request not found",
        404
    )


# =========================================================
# HR ANALYTICS
# =========================================================

@app.route(
    "/api/hr/analytics",
    methods=["GET"]
)
def hr_analytics():

    working = [
        record
        for record in attendance
        if record["check_in"]
        and not record["check_out"]
    ]

    completed = [
        record
        for record in attendance
        if record["check_in"]
        and record["check_out"]
    ]

    pending = [
        record
        for record in leave_requests
        if record["status"] == "Pending"
    ]

    department_data = {}

    for employee in employees:

        department = employee[
            "department"
        ]

        if department not in department_data:

            department_data[department] = {
                "total": 0,
                "active": 0
            }

        department_data[
            department
        ]["total"] += 1

        active = any(
            record["employee_id"] ==
                employee["id"]
            and record["check_in"]
            and not record["check_out"]
            for record in attendance
        )

        if active:

            department_data[
                department
            ]["active"] += 1

    return jsonify({

        "success": True,

        "total_employees":
            len(employees),

        "currently_working":
            len(working),

        "completed_sessions":
            len(completed),

        "pending_leave":
            len(pending),

        "activity_rate":
            round(
                (
                    len(working) /
                    len(employees) *
                    100
                )
                if employees
                else 0
            ),

        "departments":
            department_data
    })


# =========================================================
# NOTIFICATIONS
# =========================================================

@app.route(
    "/api/notifications/<int:employee_id>",
    methods=["GET"]
)
def get_notifications(employee_id):

    result = [
        item
        for item in notifications
        if item["employee_id"] == employee_id
    ]

    return jsonify({
        "success": True,
        "notifications": result
    })


@app.route(
    "/api/notifications/<int:notification_id>/read",
    methods=["PUT"]
)
def mark_notification_read(
    notification_id
):

    for notification in notifications:

        if notification["id"] == notification_id:

            notification["read"] = True

            return jsonify({
                "success": True,
                "notification":
                    notification
            })

    return error_response(
        "Notification not found",
        404
    )


# =========================================================
# SERVER
# =========================================================

if __name__ == "__main__":

    print()
    print("╔══════════════════════════════════╗")
    print("║          DAYFLOW API             ║")
    print("║      Human Resource System       ║")
    print("╚══════════════════════════════════╝")
    print()
    print("Server: http://localhost:5000")
    print("Version:", APP_VERSION)
    print()

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {

  const employeeId = 1;

  const [employee, setEmployee] =
    useState(null);

  const [leaveBalance, setLeaveBalance] =
    useState(0);

  const [attendance, setAttendance] =
    useState([]);

  const [leaveRequests, setLeaveRequests] =
    useState([]);

  const [checkedIn, setCheckedIn] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("overview");

  const [leaveType, setLeaveType] =
    useState("Casual");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [message, setMessage] =
    useState("");


  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {

    try {

      const employeeResponse =
        await fetch(
          `${API_URL}/api/employees/${employeeId}`
        );

      const employeeData =
        await employeeResponse.json();

      setEmployee(employeeData);


      const leaveResponse =
        await fetch(
          `${API_URL}/api/leave/${employeeId}`
        );

      const leaveData =
        await leaveResponse.json();

      setLeaveBalance(
        leaveData.leave_balance
      );


      const attendanceResponse =
        await fetch(
          `${API_URL}/api/attendance/${employeeId}`
        );

      const attendanceData =
        await attendanceResponse.json();

      setAttendance(attendanceData);


      const requestResponse =
        await fetch(
          `${API_URL}/api/leave/requests/${employeeId}`
        );

      const requestData =
        await requestResponse.json();

      setLeaveRequests(requestData);


      const active =
        attendanceData.some(
          record =>
            record.check_in &&
            !record.check_out
        );

      setCheckedIn(active);

    } catch (error) {

      setMessage(
        "Unable to connect to Dayflow."
      );

    }

  };


  useEffect(() => {

    loadData();

  }, []);


  // =====================================================
  // CHECK IN
  // =====================================================

  const handleCheckIn = async () => {

    try {

      const response =
        await fetch(
          `${API_URL}/api/attendance/check-in`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              employee_id:
                employeeId
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setMessage(data.error);

        return;
      }

      setMessage(
        "You're checked in! 🚀"
      );

      await loadData();

    } catch {

      setMessage(
        "Backend connection failed."
      );

    }

  };


  // =====================================================
  // CHECK OUT
  // =====================================================

  const handleCheckOut = async () => {

    try {

      const response =
        await fetch(
          `${API_URL}/api/attendance/check-out`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              employee_id:
                employeeId
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setMessage(data.error);

        return;
      }

      setMessage(
        "Day completed successfully! 🌆"
      );

      await loadData();

    } catch {

      setMessage(
        "Backend connection failed."
      );

    }

  };


  // =====================================================
  // APPLY LEAVE
  // =====================================================

  const applyLeave = async () => {

    if (
      !startDate ||
      !endDate ||
      !reason
    ) {

      setMessage(
        "Please complete all leave fields."
      );

      return;
    }


    try {

      const response =
        await fetch(
          `${API_URL}/api/leave/apply`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({

              employee_id:
                employeeId,

              leave_type:
                leaveType,

              start_date:
                startDate,

              end_date:
                endDate,

              reason:
                reason

            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        setMessage(data.error);

        return;
      }


      setMessage(
        "Leave request submitted! 🌴"
      );

      setStartDate("");
      setEndDate("");
      setReason("");

      await loadData();

    } catch {

      setMessage(
        "Unable to submit leave request."
      );

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (!employee) {

    return (
      <div className="loading">

        <div className="loader"></div>

        <h2>
          Loading Dayflow...
        </h2>

      </div>
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="logo">

          <div className="logo-icon">
            D
          </div>

          <div>

            <h1>
              Dayflow
            </h1>

            <span>
              Human Resource Management
            </span>

          </div>

        </div>


        <div className="profile">

          <div className="avatar">
            {employee.name.charAt(0)}
          </div>

          <div>

            <strong>
              {employee.name}
            </strong>

            <small>
              {employee.role}
            </small>

          </div>

        </div>

      </header>


      <main className="dashboard">

        {/* WELCOME */}

        <section className="welcome">

          <div>

            <span className="eyebrow">
              EMPLOYEE DASHBOARD
            </span>

            <h2>
              Good morning,{" "}
              {employee.name.split(" ")[0]} 👋
            </h2>

            <p>
              Your workday, your flow.
            </p>

          </div>


          <div className="status-badge">

            <span
              className={
                checkedIn
                  ? "status-dot active"
                  : "status-dot"
              }
            ></span>

            {checkedIn
              ? "Currently Working"
              : "Not Checked In"}

          </div>

        </section>


        {/* MESSAGE */}

        {message && (

          <div className="message">

            {message}

          </div>

        )}


        {/* TABS */}

        <nav className="tabs">

          <button
            className={
              activeTab === "overview"
                ? "tab active"
                : "tab"
            }
            onClick={() =>
              setActiveTab("overview")
            }
          >
            Overview
          </button>

          <button
            className={
              activeTab === "attendance"
                ? "tab active"
                : "tab"
            }
            onClick={() =>
              setActiveTab("attendance")
            }
          >
            Attendance
          </button>

          <button
            className={
              activeTab === "leave"
                ? "tab active"
                : "tab"
            }
            onClick={() =>
              setActiveTab("leave")
            }
          >
            Leave
          </button>

        </nav>


        {/* =================================================
            OVERVIEW
        ================================================= */}

        {activeTab === "overview" && (

          <>

            <section className="cards">

              <div className="card">

                <div className="card-icon">
                  ⏱️
                </div>

                <span>
                  Today's Attendance
                </span>

                <h3>
                  {checkedIn
                    ? "Working"
                    : "Not Started"}
                </h3>

                <button
                  className={
                    checkedIn
                      ? "checkout-button"
                      : "checkin-button"
                  }
                  onClick={
                    checkedIn
                      ? handleCheckOut
                      : handleCheckIn
                  }
                >

                  {checkedIn
                    ? "Check Out"
                    : "Check In"}

                </button>

              </div>


              <div className="card">

                <div className="card-icon">
                  🌴
                </div>

                <span>
                  Leave Balance
                </span>

                <h3>
                  {leaveBalance}
                  <small>
                    {" "}days
                  </small>
                </h3>

                <p>
                  Available this year
                </p>

              </div>


              <div className="card">

                <div className="card-icon">
                  📅
                </div>

                <span>
                  Leave Requests
                </span>

                <h3>
                  {leaveRequests.length}
                </h3>

                <p>
                  Total requests
                </p>

              </div>

            </section>


            {/* DAYFLOW */}

            <section className="flow-section">

              <div className="section-heading">

                <div>

                  <span className="eyebrow">
                    YOUR DAY
                  </span>

                  <h2>
                    Your Dayflow 🌊
                  </h2>

                </div>

                <span>
                  Live
                </span>

              </div>


              <div className="timeline">

                <div className="timeline-item active">

                  <div className="timeline-icon">
                    🌅
                  </div>

                  <strong>
                    Start
                  </strong>

                  <p>
                    Begin your day
                  </p>

                </div>


                <div
                  className={
                    checkedIn
                      ? "timeline-item active"
                      : "timeline-item"
                  }
                >

                  <div className="timeline-icon">
                    🟢
                  </div>

                  <strong>
                    Check In
                  </strong>

                  <p>
                    {checkedIn
                      ? "You're here!"
                      : "Waiting"}
                  </p>

                </div>


                <div
                  className={
                    checkedIn
                      ? "timeline-item active"
                      : "timeline-item"
                  }
                >

                  <div className="timeline-icon">
                    💻
                  </div>

                  <strong>
                    Work
                  </strong>

                  <p>
                    {checkedIn
                      ? "Dayflow running"
                      : "Not started"}
                  </p>

                </div>


                <div className="timeline-item">

                  <div className="timeline-icon">
                    🌆
                  </div>

                  <strong>
                    Check Out
                  </strong>

                  <p>
                    Complete your day
                  </p>

                </div>

              </div>

            </section>

          </>

        )}


        {/* =================================================
            ATTENDANCE
        ================================================= */}

        {activeTab === "attendance" && (

          <section className="panel">

            <div className="panel-header">

              <div>

                <span className="eyebrow">
                  WORK HISTORY
                </span>

                <h2>
                  Attendance History
                </h2>

              </div>

            </div>


            {attendance.length === 0 ? (

              <div className="empty-state">

                <div>
                  📅
                </div>

                <h3>
                  No attendance records yet
                </h3>

                <p>
                  Your attendance history
                  will appear here.
                </p>

              </div>

            ) : (

              <div className="attendance-list">

                {attendance
                  .slice()
                  .reverse()
                  .map(record => (

                    <div
                      className="attendance-row"
                      key={record.id}
                    >

                      <div>

                        <strong>
                          {record.date}
                        </strong>

                        <span>
                          Check-in
                        </span>

                      </div>


                      <div>

                        <strong>
                          {new Date(
                            record.check_in
                          ).toLocaleTimeString()}
                        </strong>

                        <span>
                          {record.check_out
                            ? "Completed"
                            : "Active"}
                        </span>

                      </div>


                      <div className="attendance-status">

                        {record.check_out
                          ? "Completed ✓"
                          : "Working 🟢"}

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </section>

        )}


        {/* =================================================
            LEAVE
        ================================================= */}

        {activeTab === "leave" && (

          <div className="leave-grid">


            {/* APPLY */}

            <section className="panel">

              <span className="eyebrow">
                REQUEST TIME OFF
              </span>

              <h2>
                Apply for Leave 🌴
              </h2>

              <div className="form">

                <label>
                  Leave Type
                </label>

                <select
                  value={leaveType}
                  onChange={e =>
                    setLeaveType(e.target.value)
                  }
                >

                  <option>
                    Casual
                  </option>

                  <option>
                    Sick
                  </option>

                  <option>
                    Annual
                  </option>

                </select>


                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={e =>
                    setStartDate(e.target.value)
                  }
                />


                <label>
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={e =>
                    setEndDate(e.target.value)
                  }
                />


                <label>
                  Reason
                </label>

                <textarea
                  value={reason}
                  onChange={e =>
                    setReason(e.target.value)
                  }
                  placeholder="Tell HR why you're taking leave..."
                />


                <button
                  className="submit-button"
                  onClick={applyLeave}
                >
                  Submit Leave Request
                </button>

              </div>

            </section>


            {/* REQUESTS */}

            <section className="panel">

              <span className="eyebrow">
                REQUEST HISTORY
              </span>

              <h2>
                Your Requests
              </h2>


              {leaveRequests.length === 0 ? (

                <div className="empty-state">

                  <div>
                    🌱
                  </div>

                  <h3>
                    No requests yet
                  </h3>

                  <p>
                    Your leave requests
                    will appear here.
                  </p>

                </div>

              ) : (

                <div className="request-list">

                  {leaveRequests
                    .slice()
                    .reverse()
                    .map(request => (

                      <div
                        className="request"
                        key={request.id}
                      >

                        <div>

                          <strong>
                            {request.leave_type}
                          </strong>

                          <p>
                            {request.start_date}
                            {" → "}
                            {request.end_date}
                          </p>

                        </div>

                        <span
                          className={
                            `request-status ${
                              request.status.toLowerCase()
                            }`
                          }
                        >
                          {request.status}
                        </span>

                      </div>

                    ))}

                </div>

              )}

            </section>

          </div>

        )}

      </main>

    </div>

  );
}

export default App;

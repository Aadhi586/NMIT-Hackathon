import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";
const EMPLOYEE_ID = 1;

function App() {
  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  const [checkedIn, setCheckedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [leaveType, setLeaveType] = useState("Casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());


  /* =====================================================
     CLOCK
  ===================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  /* =====================================================
     DATA
  ===================================================== */

  const loadData = async () => {
    try {
      const [
        employeeResponse,
        leaveResponse,
        attendanceResponse,
        requestsResponse
      ] = await Promise.all([
        fetch(`${API_URL}/api/employees/${EMPLOYEE_ID}`),
        fetch(`${API_URL}/api/leave/${EMPLOYEE_ID}`),
        fetch(`${API_URL}/api/attendance/${EMPLOYEE_ID}`),
        fetch(`${API_URL}/api/leave/requests/${EMPLOYEE_ID}`)
      ]);

      const employeeData = await employeeResponse.json();
      const leaveData = await leaveResponse.json();
      const attendanceData = await attendanceResponse.json();
      const requestData = await requestsResponse.json();

      setEmployee(employeeData);
      setLeaveBalance(leaveData.leave_balance);
      setAttendance(attendanceData);
      setLeaveRequests(requestData);

      const active = attendanceData.some(
        record => record.check_in && !record.check_out
      );

      setCheckedIn(active);

    } catch (error) {
      setMessage(
        "Unable to connect to Dayflow backend."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []);


  /* =====================================================
     AUTO CLEAR MESSAGE
  ===================================================== */

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);


  /* =====================================================
     ATTENDANCE
  ===================================================== */

  const handleAttendance = async () => {
    setActionLoading(true);

    try {
      const endpoint = checkedIn
        ? "/api/attendance/check-out"
        : "/api/attendance/check-in";

      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            employee_id: EMPLOYEE_ID
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setMessage(
        checkedIn
          ? "Your day has been completed. See you tomorrow! 🌆"
          : "You're checked in. Let's make it a great day! 🚀"
      );

      await loadData();

    } catch {
      setMessage(
        "Could not reach the Dayflow server."
      );
    } finally {
      setActionLoading(false);
    }
  };


  /* =====================================================
     LEAVE
  ===================================================== */

  const applyLeave = async event => {
    event.preventDefault();

    if (!startDate || !endDate || !reason.trim()) {
      setMessage(
        "Please complete all leave details."
      );
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/leave/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            employee_id: EMPLOYEE_ID,
            leave_type: leaveType,
            start_date: startDate,
            end_date: endDate,
            reason
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error);
        return;
      }

      setMessage(
        "Leave request sent to HR. 🌴"
      );

      setStartDate("");
      setEndDate("");
      setReason("");

      await loadData();

    } catch {
      setMessage(
        "Unable to submit leave request."
      );
    } finally {
      setActionLoading(false);
    }
  };


  /* =====================================================
     COMPUTED DATA
  ===================================================== */

  const completedDays = useMemo(() => {
    return attendance.filter(
      record => record.check_in && record.check_out
    ).length;
  }, [attendance]);


  const pendingLeaves = useMemo(() => {
    return leaveRequests.filter(
      request => request.status === "Pending"
    ).length;
  }, [leaveRequests]);


  const latestAttendance = attendance.length
    ? attendance[attendance.length - 1]
    : null;


  const formattedTime = currentTime.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );


  const formattedDate = currentTime.toLocaleDateString(
    [],
    {
      weekday: "long",
      month: "long",
      day: "numeric"
    }
  );


  /* =====================================================
     GREETING
  ===================================================== */

  const hour = currentTime.getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading || !employee) {
    return (
      <div className="boot-screen">

        <div className="boot-orbit">
          <div></div>
        </div>

        <div className="boot-title">
          DAYFLOW
        </div>

        <div className="boot-subtitle">
          Initializing your workspace...
        </div>

      </div>
    );
  }


  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="dayflow-app">

      {/* BACKGROUND MOTION */}

      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>
      <div className="ambient ambient-three"></div>


      {/* =================================================
         SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            <span>D</span>
          </div>

          <div>
            <strong>Dayflow</strong>
            <small>People OS</small>
          </div>

        </div>


        <nav className="navigation">

          <button
            className={
              activeTab === "overview"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActiveTab("overview")}
          >
            <span>⌂</span>
            <label>Overview</label>
          </button>


          <button
            className={
              activeTab === "attendance"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActiveTab("attendance")}
          >
            <span>◷</span>
            <label>Attendance</label>
          </button>


          <button
            className={
              activeTab === "leave"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setActiveTab("leave")}
          >
            <span>◇</span>
            <label>Leave</label>
          </button>

        </nav>


        <div className="sidebar-bottom">

          <div className="sidebar-status">
            <span></span>
            <div>
              <strong>Dayflow Online</strong>
              <small>All systems operational</small>
            </div>
          </div>

        </div>

      </aside>


      {/* =================================================
         MAIN
      ================================================= */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div>

            <span className="date-label">
              {formattedDate}
            </span>

            <span className="live-clock">
              {formattedTime}
            </span>

          </div>


          <div className="top-actions">

            <button
              className="icon-button"
              type="button"
              title="Notifications"
            >
              ◌
              {pendingLeaves > 0 && (
                <i></i>
              )}
            </button>


            <div className="user-chip">

              <div className="user-avatar">
                {employee.name.charAt(0)}
              </div>

              <div className="user-info">

                <strong>
                  {employee.name}
                </strong>

                <span>
                  {employee.role}
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* =================================================
           TOAST
        ================================================= */}

        {message && (

          <div
            className="toast"
            role="status"
            aria-live="polite"
          >

            <div className="toast-icon">
              ✓
            </div>

            <span>
              {message}
            </span>

          </div>

        )}


        {/* =================================================
           HERO
        ================================================= */}

        <section className="hero">

          <div className="hero-copy">

            <span className="section-kicker">
              YOUR PERSONAL FLOW
            </span>

            <h1>
              {greeting},{" "}
              <span>
                {employee.name.split(" ")[0]}
              </span>.
            </h1>

            <p>
              Everything you need for your workday,
              flowing in one place.
            </p>

          </div>


          <div className="hero-status">

            <div
              className={
                checkedIn
                  ? "pulse-ring working"
                  : "pulse-ring"
              }
            >
              <div>
                {checkedIn ? "ON" : "OFF"}
              </div>
            </div>

            <div>

              <strong>
                {checkedIn
                  ? "You're in flow"
                  : "Ready when you are"}
              </strong>

              <span>
                {checkedIn
                  ? "Your workday is active"
                  : "Start your Dayflow"}
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
           OVERVIEW
        ================================================= */}

        {activeTab === "overview" && (

          <div className="page-enter">


            {/* METRICS */}

            <section className="metric-grid">


              <div className="metric-card featured">

                <div className="metric-top">

                  <span>
                    TODAY
                  </span>

                  <div className="metric-symbol">
                    ◷
                  </div>

                </div>

                <strong>
                  {checkedIn
                    ? "In Flow"
                    : "Not Started"}
                </strong>

                <p>
                  {checkedIn
                    ? "Your workday is currently active."
                    : "Check in to begin tracking your day."}
                </p>


                <button
                  className={
                    checkedIn
                      ? "flow-button stop"
                      : "flow-button"
                  }
                  onClick={handleAttendance}
                  disabled={actionLoading}
                >

                  <span>
                    {actionLoading
                      ? "Processing..."
                      : checkedIn
                        ? "Finish Day"
                        : "Start My Day"}
                  </span>

                  <b>
                    →
                  </b>

                </button>

              </div>


              <div className="metric-card">

                <div className="metric-top">

                  <span>
                    LEAVE BALANCE
                  </span>

                  <div className="metric-symbol">
                    ◇
                  </div>

                </div>

                <strong>
                  {leaveBalance}
                  <small> days</small>
                </strong>

                <p>
                  Available this year
                </p>

                <div className="mini-progress">

                  <span
                    style={{
                      width:
                        `${Math.min(
                          leaveBalance * 10,
                          100
                        )}%`
                    }}
                  ></span>

                </div>

              </div>


              <div className="metric-card">

                <div className="metric-top">

                  <span>
                    WORK SESSIONS
                  </span>

                  <div className="metric-symbol">
                    ✦
                  </div>

                </div>

                <strong>
                  {completedDays}
                </strong>

                <p>
                  Completed sessions
                </p>

                <div className="sparkline">

                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>


              <div className="metric-card">

                <div className="metric-top">

                  <span>
                    REQUESTS
                  </span>

                  <div className="metric-symbol">
                    ◎
                  </div>

                </div>

                <strong>
                  {leaveRequests.length}
                </strong>

                <p>
                  {pendingLeaves > 0
                    ? `${pendingLeaves} awaiting HR review`
                    : "No requests waiting"}
                </p>

              </div>

            </section>


            {/* FLOW */}

            <section className="flow-card">

              <div className="flow-heading">

                <div>

                  <span className="section-kicker">
                    LIVE WORKDAY
                  </span>

                  <h2>
                    Your Dayflow
                  </h2>

                </div>

                <div className="flow-live">
                  <span></span>
                  Live
                </div>

              </div>


              <div className="flow-track">

                <div
                  className={
                    "flow-progress " +
                    (checkedIn
                      ? "flow-progress-active"
                      : "")
                  }
                ></div>


                <FlowStep
                  icon="☀"
                  title="Start"
                  description="Your day begins"
                  active
                />

                <FlowStep
                  icon="↗"
                  title="Check in"
                  description={
                    checkedIn
                      ? "You're here"
                      : "Waiting"
                  }
                  active={checkedIn}
                />

                <FlowStep
                  icon="✦"
                  title="In flow"
                  description={
                    checkedIn
                      ? "Workday active"
                      : "Not started"
                  }
                  active={checkedIn}
                />

                <FlowStep
                  icon="○"
                  title="Complete"
                  description="Finish your day"
                />

              </div>

            </section>


            {/* INSIGHT + PROFILE */}

            <section className="bottom-grid">


              <div className="insight-card">

                <div className="insight-orb">
                  ✦
                </div>

                <div>

                  <span className="section-kicker">
                    DAYFLOW INTELLIGENCE
                  </span>

                  <h3>
                    {checkedIn
                      ? "You're in the flow."
                      : "Your next step is simple."}
                  </h3>

                  <p>
                    {checkedIn
                      ? "Your attendance is active. Keep your momentum going."
                      : "Start your day with one click and let Dayflow handle the rest."}
                  </p>

                </div>

              </div>


              <div className="profile-card">

                <div className="profile-card-head">

                  <span className="section-kicker">
                    YOUR PROFILE
                  </span>

                  <div className="profile-avatar-large">
                    {employee.name.charAt(0)}
                  </div>

                </div>

                <h3>
                  {employee.name}
                </h3>

                <p>
                  {employee.role}
                </p>

                <div className="profile-meta">

                  <span>
                    {employee.department}
                  </span>

                  <span>
                    Active
                  </span>

                </div>

              </div>

            </section>

          </div>

        )}


        {/* =================================================
           ATTENDANCE
        ================================================= */}

        {activeTab === "attendance" && (

          <section className="page-enter">

            <div className="page-heading">

              <div>

                <span className="section-kicker">
                  WORK HISTORY
                </span>

                <h2>
                  Attendance
                </h2>

                <p>
                  Your workday, captured in motion.
                </p>

              </div>

              <div className="heading-stat">

                <strong>
                  {completedDays}
                </strong>

                <span>
                  completed sessions
                </span>

              </div>

            </div>


            <div className="history-card">

              {attendance.length === 0 ? (

                <div className="empty-state">

                  <div>
                    ◷
                  </div>

                  <h3>
                    Your journey starts here
                  </h3>

                  <p>
                    Check in to create your first
                    attendance record.
                  </p>

                </div>

              ) : (

                <div className="history-list">

                  {attendance
                    .slice()
                    .reverse()
                    .map((record, index) => (

                      <div
                        className="history-row"
                        key={record.id}
                        style={{
                          animationDelay:
                            `${index * 70}ms`
                        }}
                      >

                        <div className="history-date">

                          <strong>
                            {record.date}
                          </strong>

                          <span>
                            Work session
                          </span>

                        </div>


                        <div className="history-time">

                          <span>
                            IN
                          </span>

                          <strong>
                            {new Date(
                              record.check_in
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit"
                              }
                            )}
                          </strong>

                        </div>


                        <div className="history-time">

                          <span>
                            OUT
                          </span>

                          <strong>
                            {record.check_out
                              ? new Date(
                                  record.check_out
                                ).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  }
                                )
                              : "—"}
                          </strong>

                        </div>


                        <div>

                          <span
                            className={
                              record.check_out
                                ? "status-pill complete"
                                : "status-pill active"
                            }
                          >

                            {record.check_out
                              ? "Completed"
                              : "In progress"}

                          </span>

                        </div>

                      </div>

                    ))}

                </div>

              )}

            </div>

          </section>

        )}


        {/* =================================================
           LEAVE
        ================================================= */}

        {activeTab === "leave" && (

          <section className="page-enter">

            <div className="page-heading">

              <div>

                <span className="section-kicker">
                  TIME OFF
                </span>

                <h2>
                  Leave Center
                </h2>

                <p>
                  Plan your time without the paperwork.
                </p>

              </div>

            </div>


            <div className="leave-layout">


              {/* FORM */}

              <form
                className="leave-form"
                onSubmit={applyLeave}
              >

                <div className="form-header">

                  <div className="form-orb">
                    ◇
                  </div>

                  <div>

                    <h3>
                      Request time off
                    </h3>

                    <p>
                      You have{" "}
                      <strong>
                        {leaveBalance} days
                      </strong>{" "}
                      available.
                    </p>

                  </div>

                </div>


                <label>
                  Leave type

                  <select
                    value={leaveType}
                    onChange={e =>
                      setLeaveType(
                        e.target.value
                      )
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

                </label>


                <div className="date-grid">

                  <label>
                    Start date

                    <input
                      type="date"
                      value={startDate}
                      onChange={e =>
                        setStartDate(
                          e.target.value
                        )
                      }
                    />

                  </label>


                  <label>
                    End date

                    <input
                      type="date"
                      value={endDate}
                      onChange={e =>
                        setEndDate(
                          e.target.value
                        )
                      }
                    />

                  </label>

                </div>


                <label>
                  Reason

                  <textarea
                    value={reason}
                    onChange={e =>
                      setReason(
                        e.target.value
                      )
                    }
                    placeholder=
                      "What's the occasion?"
                  />

                </label>


                <button
                  className="submit-leave"
                  type="submit"
                  disabled={actionLoading}
                >

                  {actionLoading
                    ? "Sending..."
                    : "Send request"}

                  <span>
                    →
                  </span>

                </button>

              </form>


              {/* REQUESTS */}

              <div className="requests-card">

                <div className="requests-header">

                  <div>

                    <span className="section-kicker">
                      HISTORY
                    </span>

                    <h3>
                      Your requests
                    </h3>

                  </div>

                  <span>
                    {leaveRequests.length}
                  </span>

                </div>


                {leaveRequests.length === 0 ? (

                  <div className="empty-small">

                    <div>
                      ◌
                    </div>

                    <p>
                      No leave requests yet.
                    </p>

                  </div>

                ) : (

                  <div className="request-list">

                    {leaveRequests
                      .slice()
                      .reverse()
                      .map((request, index) => (

                        <div
                          className="request-item"
                          key={request.id}
                          style={{
                            animationDelay:
                              `${index * 80}ms`
                          }}
                        >

                          <div className="request-icon">
                            ◇
                          </div>

                          <div className="request-info">

                            <strong>
                              {request.leave_type}
                            </strong>

                            <span>
                              {request.start_date}
                              {" → "}
                              {request.end_date}
                            </span>

                          </div>

                          <span
                            className={
                              "status-pill " +
                              request.status.toLowerCase()
                            }
                          >
                            {request.status}
                          </span>

                        </div>

                      ))}

                  </div>

                )}

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}


/* =======================================================
   FLOW STEP
======================================================= */

function FlowStep({
  icon,
  title,
  description,
  active = false
}) {
  return (
    <div
      className={
        active
          ? "flow-step active"
          : "flow-step"
      }
    >

      <div className="flow-node">
        {icon}
      </div>

      <strong>
        {title}
      </strong>

      <span>
        {description}
      </span>

    </div>
  );
}


export default App;

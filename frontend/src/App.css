import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {

  const employeeId = 1;

  const [employee, setEmployee] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // -----------------------------
  // LOAD EMPLOYEE
  // -----------------------------

  useEffect(() => {

    fetch(`${API_URL}/api/employees/${employeeId}`)
      .then(response => response.json())
      .then(data => {
        setEmployee(data);
      })
      .catch(() => {
        setMessage("Unable to connect to Dayflow backend.");
      });

    fetch(`${API_URL}/api/leave/${employeeId}`)
      .then(response => response.json())
      .then(data => {
        setLeaveBalance(data.leave_balance);
      })
      .catch(() => {
        setLeaveBalance(0);
      });

    setLoading(false);

  }, []);


  // -----------------------------
  // CHECK IN
  // -----------------------------

  const handleCheckIn = async () => {

    setMessage("");

    try {

      const response = await fetch(
        `${API_URL}/api/attendance/check-in`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            employee_id: employeeId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error);
        return;
      }

      setCheckedIn(true);
      setMessage("You're checked in. Have a productive day! 🚀");

    } catch (error) {

      setMessage(
        "Backend connection failed. Make sure Dayflow server is running."
      );

    }
  };


  // -----------------------------
  // CHECK OUT
  // -----------------------------

  const handleCheckOut = async () => {

    setMessage("");

    try {

      const response = await fetch(
        `${API_URL}/api/attendance/check-out`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            employee_id: employeeId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error);
        return;
      }

      setCheckedIn(false);
      setMessage("Checked out successfully. See you tomorrow! 👋");

    } catch (error) {

      setMessage("Unable to connect to Dayflow backend.");

    }
  };


  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading || !employee) {

    return (
      <div className="loading">
        <div className="loader"></div>
        <h2>Loading Dayflow...</h2>
      </div>
    );
  }


  // -----------------------------
  // DASHBOARD
  // -----------------------------

  return (

    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="logo">

          <div className="logo-icon">
            D
          </div>

          <div>
            <h1>Dayflow</h1>
            <span>Human Resource Management</span>
          </div>

        </div>

        <div className="profile">

          <div className="avatar">
            {employee.name.charAt(0)}
          </div>

          <div>
            <strong>{employee.name}</strong>
            <small>{employee.role}</small>
          </div>

        </div>

      </header>


      {/* MAIN */}

      <main className="dashboard">

        {/* WELCOME */}

        <section className="welcome">

          <div>

            <span className="eyebrow">
              EMPLOYEE DASHBOARD
            </span>

            <h2>
              Good morning, {employee.name.split(" ")[0]} 👋
            </h2>

            <p>
              Let's see how your day is flowing.
            </p>

          </div>

          <div className="status-badge">

            <span className={
              checkedIn ? "status-dot active" : "status-dot"
            }></span>

            {checkedIn ? "Currently Working" : "Not Checked In"}

          </div>

        </section>


        {/* MESSAGE */}

        {message && (

          <div className="message">

            {message}

          </div>

        )}


        {/* CARDS */}

        <section className="cards">

          {/* ATTENDANCE */}

          <div className="card attendance-card">

            <div className="card-icon">
              ⏱️
            </div>

            <span>Today's Attendance</span>

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


          {/* LEAVE */}

          <div className="card">

            <div className="card-icon">
              🌴
            </div>

            <span>Leave Balance</span>

            <h3>
              {leaveBalance}
              <small> days</small>
            </h3>

            <p>
              Available this year
            </p>

          </div>


          {/* WORK */}

          <div className="card">

            <div className="card-icon">
              💻
            </div>

            <span>Working Hours</span>

            <h3>
              {checkedIn
                ? "Running"
                : "0h 00m"}
            </h3>

            <p>
              Today's total
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

            <div className="timeline-line"></div>


            {/* START */}

            <div className="timeline-item active">

              <div className="timeline-icon">
                🌅
              </div>

              <div>
                <strong>Start</strong>
                <p>Begin your day</p>
              </div>

            </div>


            {/* CHECK IN */}

            <div className={
              checkedIn
                ? "timeline-item active"
                : "timeline-item"
            }>

              <div className="timeline-icon">
                🟢
              </div>

              <div>
                <strong>Check In</strong>
                <p>
                  {checkedIn
                    ? "You're here!"
                    : "Waiting for check-in"}
                </p>
              </div>

            </div>


            {/* WORK */}

            <div className={
              checkedIn
                ? "timeline-item active"
                : "timeline-item"
            }>

              <div className="timeline-icon">
                💻
              </div>

              <div>
                <strong>Work</strong>
                <p>
                  {checkedIn
                    ? "Dayflow is running"
                    : "Not started"}
                </p>
              </div>

            </div>


            {/* CHECK OUT */}

            <div className="timeline-item">

              <div className="timeline-icon">
                🌆
              </div>

              <div>
                <strong>Check Out</strong>
                <p>Complete your day</p>
              </div>

            </div>

          </div>

        </section>


        {/* DAYFLOW INSIGHT */}

        <section className="insight">

          <div className="insight-icon">
            ✨
          </div>

          <div>

            <span>
              DAYFLOW INSIGHT
            </span>

            <h3>
              {checkedIn
                ? "Your day is flowing!"
                : "Ready to start your day?"}
            </h3>

            <p>
              {checkedIn
                ? "Your attendance is active. Keep the momentum going."
                : "Check in when you're ready and Dayflow will track your workday."
              }
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;

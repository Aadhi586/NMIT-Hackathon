import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function TeamPulse() {

  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD DATA

  const loadData = async () => {

    try {

      const attendanceResponse =
        await fetch(${API_URL}/api/attendance);

      const employeesResponse =
        await fetch(${API_URL}/api/employees);

      const attendanceData =
        await attendanceResponse.json();

      const employeesData =
        await employeesResponse.json();

      setAttendance(attendanceData);
      setEmployees(employeesData);

    } catch (error) {

      console.error(
        "Unable to load Team Pulse data",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadData();

    const interval = setInterval(
      loadData,
      5000
    );

    return () => clearInterval(interval);

  }, []);

  // CALCULATE STATS

  const currentlyWorking =
    attendance.filter(
      record =>
        record.check_in &&
        !record.check_out
    ).length;


  const completedToday =
    attendance.filter(
      record =>
        record.check_in &&
        record.check_out
    ).length;


  const totalEmployees =
    employees.length;


  const attendanceRate =
    totalEmployees === 0
      ? 0
      : Math.round(
          (currentlyWorking /
            totalEmployees) *
            100
        );

  // UI

  if (loading) {

    return (
      <section className="team-pulse">

        <h1>Team Pulse 📊</h1>

        <p>
          Loading organizational data...
        </p>

      </section>
    );

  }


  return (

    <section className="team-pulse">

      {/* HEADER */}

      <div className="pulse-header">

        <div>

          <span className="eyebrow">
            DAYFLOW ANALYTICS
          </span>

          <h1>
            Team Pulse
          </h1>

          <p>
            A live view of how your organization
            is flowing.
          </p>

        </div>

        <div className="live-indicator">
          <span></span>
          Live
        </div>

      </div>


      {/* STATS */}

      <div className="stats">

        <div className="stat-card">

          <div className="stat-icon">
            🟢
          </div>

          <h2>
            {currentlyWorking}
          </h2>

          <p>
            Currently Working
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            🔵
          </div>

          <h2>
            {completedToday}
          </h2>

          <p>
            Completed Today
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            👥
          </div>

          <h2>
            {totalEmployees}
          </h2>

          <p>
            Total Employees
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            📈
          </div>

          <h2>
            {attendanceRate}%
          </h2>

          <p>
            Current Attendance
          </p>

        </div>

      </div>


      {/* PULSE */}

      <div className="pulse-card">

        <span className="eyebrow">
          ORGANIZATION PULSE
        </span>

        <h2>
          Today's Flow
        </h2>


        <div className="pulse-bar">

          <div
            className="pulse-progress"
            style={{
              width: ${attendanceRate}%
            }}
          ></div>

        </div>


        <div className="pulse-footer">

          <span>
            {attendanceRate}% currently active
          </span>

          <span>
            {totalEmployees} employees
          </span>

        </div>

      </div>


      {/* INSIGHT */}

      <div className="insight">

        <div className="insight-icon">
          ✨
        </div>

        <div>

          <span>
            DAYFLOW INSIGHT
          </span>

          <h3>

            {currentlyWorking > 0
              ? "Your organization is flowing."
              : "Waiting for today's flow to begin."
            }

          </h3>

          <p>

            {currentlyWorking > 0
              ? ${currentlyWorking} employee(s) are currently active.
              : "Attendance activity will appear here automatically."
            }

          </p>

        </div>

      </div>

    </section>

  );
}

export default TeamPulse;

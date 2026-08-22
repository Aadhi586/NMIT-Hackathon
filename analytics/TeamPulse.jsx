import { useEffect, useState } from "react";
import "./TeamPulse.css";

const API_URL = "http://localhost:5000";

function TeamPulse() {

  const [employees, setEmployees] =
    useState([]);

  const [attendance, setAttendance] =
    useState([]);

  const [leaveRequests, setLeaveRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {

    try {

      const employeeResponse =
        await fetch(
          `${API_URL}/api/employees`
        );

      const attendanceResponse =
        await fetch(
          `${API_URL}/api/attendance`
        );

      const leaveResponse =
        await fetch(
          `${API_URL}/api/hr/leave-requests`
        );


      setEmployees(
        await employeeResponse.json()
      );

      setAttendance(
        await attendanceResponse.json()
      );

      setLeaveRequests(
        await leaveResponse.json()
      );

    } catch (error) {

      console.error(
        "Analytics error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadData();

    const interval =
      setInterval(
        loadData,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);


  // =====================================================
  // STATISTICS
  // =====================================================

  const currentlyWorking =
    attendance.filter(
      record =>
        record.check_in &&
        !record.check_out
    ).length;


  const completed =
    attendance.filter(
      record =>
        record.check_in &&
        record.check_out
    ).length;


  const pendingLeaves =
    leaveRequests.filter(
      request =>
        request.status === "Pending"
    ).length;


  const attendanceRate =
    employees.length === 0
      ? 0
      : Math.round(
          (
            currentlyWorking /
            employees.length
          ) * 100
        );


  // =====================================================
  // DEPARTMENT ANALYTICS
  // =====================================================

  const departmentData =
    employees.reduce(
      (result, employee) => {

        const department =
          employee.department;

        if (!result[department]) {

          result[department] = {
            total: 0,
            active: 0
          };

        }

        result[department].total++;

        const active =
          attendance.some(
            record =>
              record.employee_id ===
                employee.id &&
              record.check_in &&
              !record.check_out
          );

        if (active) {
          result[department].active++;
        }

        return result;

      },
      {}
    );


  // =====================================================
  // PATTERN DETECTION
  // =====================================================

  const detectPattern = () => {

    if (pendingLeaves >= 3) {

      return {
        level: "attention",
        title:
          "Leave activity is elevated",
        description:
          `${pendingLeaves} leave requests are currently waiting for HR review.`
      };

    }


    if (
      employees.length > 0 &&
      attendanceRate < 50
    ) {

      return {
        level: "attention",
        title:
          "Attendance is lower than usual",
        description:
          "Less than half of the organization is currently active."
      };

    }


    if (currentlyWorking > 0) {

      return {
        level: "healthy",
        title:
          "Organization is flowing",
        description:
          `${currentlyWorking} employees are currently active.`
      };

    }


    return {
      level: "neutral",
      title:
        "Waiting for workplace activity",
      description:
        "Dayflow will surface patterns as data arrives."
    };

  };


  const pattern =
    detectPattern();


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <section className="team-pulse">

        <h1>
          Loading Team Pulse...
        </h1>

      </section>
    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <section className="team-pulse">

      {/* HEADER */}

      <div className="pulse-header">

        <div>

          <span className="eyebrow">
            DAYFLOW INTELLIGENCE
          </span>

          <h1>
            Team Pulse
          </h1>

          <p>
            Understand your organization,
            not just the numbers.
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
            📅
          </div>

          <h2>
            {completed}
          </h2>

          <p>
            Completed Today
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            🌴
          </div>

          <h2>
            {pendingLeaves}
          </h2>

          <p>
            Pending Leave
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
            Current Activity
          </p>

        </div>

      </div>


      {/* ORGANIZATION FLOW */}

      <div className="pulse-card">

        <span className="eyebrow">
          ORGANIZATION FLOW
        </span>

        <h2>
          Today's Activity
        </h2>

        <div className="pulse-bar">

          <div
            className="pulse-progress"
            style={{
              width:
                `${attendanceRate}%`
            }}
          ></div>

        </div>

        <div className="pulse-footer">

          <span>
            {attendanceRate}%
            currently active
          </span>

          <span>
            {employees.length}
            employees
          </span>

        </div>

      </div>


      {/* DEPARTMENTS */}

      <div className="department-card">

        <span className="eyebrow">
          TEAM BREAKDOWN
        </span>

        <h2>
          Department Flow
        </h2>


        <div className="department-list">

          {Object.entries(
            departmentData
          ).map(
            ([department, data]) => {

              const percentage =
                data.total === 0
                  ? 0
                  : Math.round(
                      (
                        data.active /
                        data.total
                      ) * 100
                    );

              return (

                <div
                  className="department"
                  key={department}
                >

                  <div className="department-top">

                    <strong>
                      {department}
                    </strong>

                    <span>
                      {data.active}
                      /
                      {data.total}
                    </span>

                  </div>

                  <div className="department-bar">

                    <div
                      style={{
                        width:
                          `${percentage}%`
                      }}
                    ></div>

                  </div>

                </div>

              );

            }
          )}

        </div>

      </div>


      {/* INTELLIGENCE */}

      <div
        className={
          `pattern-card ${pattern.level}`
        }
      >

        <div className="pattern-icon">
          {pattern.level ===
          "healthy"
            ? "🟢"
            : pattern.level ===
              "attention"
            ? "⚠️"
            : "💡"}
        </div>

        <div>

          <span className="eyebrow">
            DAYFLOW PATTERN
          </span>

          <h2>
            {pattern.title}
          </h2>

          <p>
            {pattern.description}
          </p>

        </div>

      </div>

    </section>

  );

}

export default TeamPulse;

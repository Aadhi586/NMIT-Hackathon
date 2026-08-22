import { useEffect, useMemo, useState } from "react";
import "./TeamPulse.css";

const API_URL = "http://localhost:5000";

function TeamPulse() {

  const [analytics, setAnalytics] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const loadData = async () => {

    try {

      const [
        analyticsResponse,
        employeesResponse,
        requestsResponse
      ] = await Promise.all([

        fetch(
          `${API_URL}/api/hr/analytics`
        ),

        fetch(
          `${API_URL}/api/employees`
        ),

        fetch(
          `${API_URL}/api/hr/leave-requests`
        )

      ]);

      const analyticsData =
        await analyticsResponse.json();

      const employeesData =
        await employeesResponse.json();

      const requestsData =
        await requestsResponse.json();

      setAnalytics(analyticsData);

      setEmployees(
        employeesData.employees ||
        employeesData
      );

      setRequests(
        requestsData.requests ||
        requestsData
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadData();

    const interval =
      setInterval(loadData, 5000);

    return () =>
      clearInterval(interval);

  }, []);


  const filteredEmployees =
    useMemo(() => {

      return employees.filter(
        employee => {

          const value =
            `${employee.name} ${employee.department} ${employee.role}`
              .toLowerCase();

          return value.includes(
            search.toLowerCase()
          );

        }
      );

    }, [employees, search]);


  const updateRequest = async (
    requestId,
    status
  ) => {

    setProcessing(true);

    try {

      await fetch(
        `${API_URL}/api/hr/leave/${requestId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            status
          })
        }
      );

      setSelectedRequest(null);

      await loadData();

    } catch (error) {

      console.error(error);

    } finally {

      setProcessing(false);

    }

  };


  if (loading || !analytics) {

    return (
      <div className="pulse-loading">

        <div className="pulse-loader"></div>

        <h2>
          Building workforce pulse...
        </h2>

      </div>
    );

  }


  return (

    <div className="pulse-app">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="pulse-topbar">

        <div>

          <span className="pulse-kicker">
            DAYFLOW / HR COMMAND
          </span>

          <h1>
            Workforce Pulse
          </h1>

          <p>
            Your organization, in motion.
          </p>

        </div>


        <div className="pulse-live">

          <span></span>

          Live system

        </div>

      </header>


      {/* =================================================
          METRICS
      ================================================= */}

      <section className="pulse-metrics">

        <Metric
          icon="◎"
          label="EMPLOYEES"
          value={analytics.total_employees}
          detail="People in Dayflow"
        />

        <Metric
          icon="◉"
          label="WORKING NOW"
          value={analytics.currently_working}
          detail="Currently active"
          live
        />

        <Metric
          icon="◇"
          label="PENDING LEAVE"
          value={analytics.pending_leave}
          detail="Awaiting review"
          attention={
            analytics.pending_leave > 0
          }
        />

        <Metric
          icon="✦"
          label="ACTIVITY"
          value={`${analytics.activity_rate}%`}
          detail="Current workforce flow"
        />

      </section>


      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="pulse-grid">


        {/* =================================================
            WORKFORCE FLOW
        ================================================= */}

        <section className="pulse-panel workforce-panel">

          <div className="panel-heading">

            <div>

              <span className="pulse-kicker">
                WORKFORCE FLOW
              </span>

              <h2>
                Organization activity
              </h2>

            </div>

            <div className="flow-number">
              {analytics.activity_rate}%
            </div>

          </div>


          <div className="big-flow">

            <div
              className="big-flow-fill"
              style={{
                width:
                  `${analytics.activity_rate}%`
              }}
            ></div>

            <div className="flow-glow"></div>

          </div>


          <div className="flow-labels">

            <span>
              Low activity
            </span>

            <strong>
              {analytics.currently_working}
              {" "}active
            </strong>

            <span>
              Full activity
            </span>

          </div>


          {/* RADAR */}

          <div className="pulse-radar">

            <div className="radar-ring ring-one"></div>

            <div className="radar-ring ring-two"></div>

            <div className="radar-ring ring-three"></div>

            <div className="radar-core">
              ✦
            </div>

            <span className="radar-dot dot-one"></span>
            <span className="radar-dot dot-two"></span>
            <span className="radar-dot dot-three"></span>
            <span className="radar-dot dot-four"></span>

          </div>

        </section>


        {/* =================================================
            DEPARTMENTS
        ================================================= */}

        <section className="pulse-panel">

          <div className="panel-heading">

            <div>

              <span className="pulse-kicker">
                TEAM PULSE
              </span>

              <h2>
                Departments
              </h2>

            </div>

          </div>


          <div className="department-list">

            {Object.entries(
              analytics.departments || {}
            ).map(
              ([department, data]) => {

                const percentage =
                  data.total
                    ? Math.round(
                        data.active /
                        data.total *
                        100
                      )
                    : 0;

                return (

                  <div
                    className="department-row"
                    key={department}
                  >

                    <div className="department-meta">

                      <strong>
                        {department}
                      </strong>

                      <span>
                        {data.active}
                        /
                        {data.total}
                      </span>

                    </div>

                    <div className="department-track">

                      <span
                        style={{
                          width:
                            `${percentage}%`
                        }}
                      ></span>

                    </div>

                    <small>
                      {percentage}% active
                    </small>

                  </div>

                );

              }
            )}

          </div>

        </section>


        {/* =================================================
            LEAVE REQUESTS
        ================================================= */}

        <section className="pulse-panel leave-panel">

          <div className="panel-heading">

            <div>

              <span className="pulse-kicker">
                HR ACTION CENTER
              </span>

              <h2>
                Leave requests
              </h2>

            </div>

            <span className="request-count">
              {requests.length}
            </span>

          </div>


          {requests.length === 0 ? (

            <div className="pulse-empty">

              <div>
                ✓
              </div>

              <h3>
                All clear
              </h3>

              <p>
                No leave requests require attention.
              </p>

            </div>

          ) : (

            <div className="leave-request-list">

              {requests
                .slice()
                .reverse()
                .map(
                  (request, index) => (

                    <button
                      className="leave-request"
                      key={request.id}
                      onClick={() =>
                        setSelectedRequest(
                          request
                        )
                      }
                      style={{
                        animationDelay:
                          `${index * 60}ms`
                      }}
                    >

                      <div className="employee-orb">

                        {request.employee_name
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>


                      <div className="request-main">

                        <strong>
                          {request.employee_name}
                        </strong>

                        <span>
                          {request.leave_type}
                          {" · "}
                          {request.start_date}
                        </span>

                      </div>


                      <span
                        className={
                          `hr-status ${
                            request.status.toLowerCase()
                          }`
                        }
                      >
                        {request.status}
                      </span>


                      <b>
                        →
                      </b>

                    </button>

                  )
                )}

            </div>

          )}

        </section>


        {/* =================================================
            PEOPLE DIRECTORY
        ================================================= */}

        <section className="pulse-panel people-panel">

          <div className="panel-heading">

            <div>

              <span className="pulse-kicker">
                PEOPLE
              </span>

              <h2>
                Employee directory
              </h2>

            </div>

            <span className="people-total">
              {employees.length}
            </span>

          </div>


          <div className="search-box">

            <span>
              ⌕
            </span>

            <input
              value={search}
              onChange={e =>
                setSearch(e.target.value)
              }
              placeholder="Search people..."
            />

          </div>


          <div className="people-list">

            {filteredEmployees.map(
              employee => (

                <div
                  className="person-row"
                  key={employee.id}
                >

                  <div className="person-avatar">

                    {employee.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div className="person-info">

                    <strong>
                      {employee.name}
                    </strong>

                    <span>
                      {employee.role}
                      {" · "}
                      {employee.department}
                    </span>

                  </div>

                  <span className="person-status">

                    <i></i>

                    {employee.status}

                  </span>

                </div>

              )
            )}

          </div>

        </section>

      </div>


      {/* =================================================
          REQUEST MODAL
      ================================================= */}

      {selectedRequest && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setSelectedRequest(null)
          }
        >

          <div
            className="request-modal"
            onClick={event =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedRequest(null)
              }
            >
              ×
            </button>


            <span className="pulse-kicker">
              LEAVE REQUEST
            </span>

            <div className="modal-avatar">

              {selectedRequest.employee_name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

            <h2>
              {selectedRequest.employee_name}
            </h2>

            <p className="modal-department">
              {selectedRequest.department}
            </p>


            <div className="request-detail-grid">

              <div>
                <span>TYPE</span>
                <strong>
                  {selectedRequest.leave_type}
                </strong>
              </div>

              <div>
                <span>STATUS</span>
                <strong>
                  {selectedRequest.status}
                </strong>
              </div>

              <div>
                <span>START</span>
                <strong>
                  {selectedRequest.start_date}
                </strong>
              </div>

              <div>
                <span>END</span>
                <strong>
                  {selectedRequest.end_date}
                </strong>
              </div>

            </div>


            <div className="reason-box">

              <span>
                REASON
              </span>

              <p>
                {selectedRequest.reason}
              </p>

            </div>


            {selectedRequest.status ===
              "Pending" && (

              <div className="modal-actions">

                <button
                  className="reject-button"
                  disabled={processing}
                  onClick={() =>
                    updateRequest(
                      selectedRequest.id,
                      "Rejected"
                    )
                  }
                >
                  Reject
                </button>

                <button
                  className="approve-button"
                  disabled={processing}
                  onClick={() =>
                    updateRequest(
                      selectedRequest.id,
                      "Approved"
                    )
                  }
                >
                  {processing
                    ? "Processing..."
                    : "Approve"}
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>

  );
}


/* =======================================================
   METRIC
======================================================= */

function Metric({
  icon,
  label,
  value,
  detail,
  live,
  attention
}) {

  return (

    <div className="pulse-metric">

      <div className="metric-symbol">

        {icon}

        {live && (
          <span className="metric-live"></span>
        )}

      </div>

      <span className="metric-label">
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <p className={
        attention
          ? "attention-text"
          : ""
      }>
        {detail}
      </p>

    </div>

  );
}


export default TeamPulse;

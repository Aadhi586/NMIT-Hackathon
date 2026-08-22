import { useEffect, useState } from "react";
import Login from "./Login";

import TeamPulse from "../../analytics/TeamPulse";
import AskDayFlow from "../../ai/AskDayFlow";

import "./App.css";

const API_URL = "http://localhost:5000";

const EMPLOYEE_ID = 1;


/* =========================================================
   APP
========================================================= */

function App() {

  const [session, setSession] = useState(() => {

    try {

      const saved =
        localStorage.getItem(
          "dayflow_session"
        );

      return saved
        ? JSON.parse(saved)
        : null;

    } catch {

      return null;

    }

  });


  const [page, setPage] =
    useState("dashboard");


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = (user) => {

    setSession(user);

    setPage(
      user.role === "employee"
        ? "dashboard"
        : user.role === "hr"
          ? "pulse"
          : "admin"
    );

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "dayflow_session"
    );

    setSession(null);

    setPage("dashboard");

  };


  /* =======================================================
     AUTH GUARD
  ======================================================= */

  if (!session) {

    return (
      <Login
        onLogin={handleLogin}
      />
    );

  }


  /* =======================================================
     EMPLOYEE
  ======================================================= */

  if (session.role === "employee") {

    return (
      <EmployeeApp
        session={session}
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
      />
    );

  }


  /* =======================================================
     HR
  ======================================================= */

  if (session.role === "hr") {

    return (
      <HRApp
        session={session}
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
      />
    );

  }


  /* =======================================================
     ADMIN
  ======================================================= */

  return (
    <AdminApp
      session={session}
      page={page}
      setPage={setPage}
      onLogout={handleLogout}
    />
  );

}


/* =========================================================
   EMPLOYEE APP
========================================================= */

function EmployeeApp({
  session,
  page,
  setPage,
  onLogout
}) {

  return (

    <div className="dayflow-app">

      <Sidebar
        role="employee"
        page={page}
        setPage={setPage}
        session={session}
        onLogout={onLogout}
      />

      <main className="dayflow-main">

        {page === "dashboard" && (
          <EmployeeDashboard
            session={session}
            setPage={setPage}
          />
        )}

        {page === "attendance" && (
          <AttendancePage
            employeeId={EMPLOYEE_ID}
          />
        )}

        {page === "leave" && (
          <LeavePage
            employeeId={EMPLOYEE_ID}
          />
        )}

        {page === "ask" && (
          <AskDayFlow />
        )}

        {page === "profile" && (
          <ProfilePage
            session={session}
          />
        )}

      </main>

    </div>

  );

}


/* =========================================================
   HR APP
========================================================= */

function HRApp({
  session,
  page,
  setPage,
  onLogout
}) {

  return (

    <div className="dayflow-app">

      <Sidebar
        role="hr"
        page={page}
        setPage={setPage}
        session={session}
        onLogout={onLogout}
      />

      <main className="dayflow-main">

        {page === "pulse" && (
          <TeamPulse />
        )}

        {page === "employees" && (
          <EmployeeManagement />
        )}

        {page === "requests" && (
          <TeamPulse />
        )}

        {page === "ask" && (
          <AskDayFlow />
        )}

      </main>

    </div>

  );

}


/* =========================================================
   ADMIN APP
========================================================= */

function AdminApp({
  session,
  page,
  setPage,
  onLogout
}) {

  return (

    <div className="dayflow-app">

      <Sidebar
        role="admin"
        page={page}
        setPage={setPage}
        session={session}
        onLogout={onLogout}
      />

      <main className="dayflow-main">

        {page === "admin" && (
          <AdminDashboard />
        )}

        {page === "employees" && (
          <EmployeeManagement />
        )}

        {page === "analytics" && (
          <TeamPulse />
        )}

        {page === "ask" && (
          <AskDayFlow />
        )}

        {page === "system" && (
          <SystemStatus />
        )}

      </main>

    </div>

  );

}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  role,
  page,
  setPage,
  session,
  onLogout
}) {

  const employeeItems = [
    {
      id: "dashboard",
      icon: "⌂",
      label: "My Day"
    },
    {
      id: "attendance",
      icon: "◷",
      label: "Attendance"
    },
    {
      id: "leave",
      icon: "◇",
      label: "Leave"
    },
    {
      id: "ask",
      icon: "✦",
      label: "Ask Dayflow"
    },
    {
      id: "profile",
      icon: "○",
      label: "Profile"
    }
  ];


  const hrItems = [
    {
      id: "pulse",
      icon: "◉",
      label: "Workforce Pulse"
    },
    {
      id: "employees",
      icon: "○",
      label: "Employees"
    },
    {
      id: "requests",
      icon: "◇",
      label: "Leave Requests"
    },
    {
      id: "ask",
      icon: "✦",
      label: "Ask Dayflow"
    }
  ];


  const adminItems = [
    {
      id: "admin",
      icon: "⌂",
      label: "Command Center"
    },
    {
      id: "employees",
      icon: "○",
      label: "Employees"
    },
    {
      id: "analytics",
      icon: "◉",
      label: "Analytics"
    },
    {
      id: "system",
      icon: "⚙",
      label: "System"
    },
    {
      id: "ask",
      icon: "✦",
      label: "Ask Dayflow"
    }
  ];


  const items =
    role === "employee"
      ? employeeItems
      : role === "hr"
        ? hrItems
        : adminItems;


  return (

    <aside className="dayflow-sidebar">

      <div className="sidebar-brand">

        <div className="sidebar-logo">
          ✦
        </div>

        <div>

          <strong>
            DAYFLOW
          </strong>

          <span>
            {role === "employee"
              ? "EMPLOYEE"
              : role === "hr"
                ? "HR COMMAND"
                : "ADMIN CORE"}
          </span>

        </div>

      </div>


      <div className="sidebar-section">

        <span className="sidebar-section-label">
          WORKSPACE
        </span>

        <nav>

          {items.map(item => (

            <button
              key={item.id}
              className={
                page === item.id
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                setPage(item.id)
              }
            >

              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>

              {page === item.id && (
                <i />
              )}

            </button>

          ))}

        </nav>

      </div>


      <div className="sidebar-bottom">

        <div className="sidebar-user">

          <div className="sidebar-avatar">

            {session.name
              ?.charAt(0)
              ?.toUpperCase()}

          </div>

          <div>

            <strong>
              {session.name}
            </strong>

            <span>
              {session.email}
            </span>

          </div>

        </div>


        <button
          className="logout-button"
          onClick={onLogout}
        >

          <span>
            ↪
          </span>

          Sign out

        </button>

      </div>

    </aside>

  );

}


/* =========================================================
   EMPLOYEE DASHBOARD
========================================================= */

function EmployeeDashboard({
  session,
  setPage
}) {

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [working, setWorking] =
    useState(false);


  const loadDashboard = async () => {

    try {

      const response =
        await fetch(
          `${API_URL}/api/dashboard/${EMPLOYEE_ID}`
        );

      const result =
        await response.json();

      setData(result);

      setWorking(
        result.currently_working
      );

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadDashboard();

    const timer =
      setInterval(
        loadDashboard,
        5000
      );

    return () =>
      clearInterval(timer);

  }, []);


  const handleAttendance = async () => {

    const endpoint =
      working
        ? "check-out"
        : "check-in";


    try {

      await fetch(
        `${API_URL}/api/attendance/${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            employee_id:
              EMPLOYEE_ID
          })
        }
      );

      await loadDashboard();

    } catch (error) {

      console.error(error);

    }

  };


  if (loading) {

    return (
      <div className="dashboard-loading">

        <div className="dashboard-loader" />

        <p>
          Preparing your workspace...
        </p>

      </div>
    );

  }


  return (

    <div className="employee-dashboard">

      <header className="dashboard-header">

        <div>

          <span className="dashboard-kicker">
            {getGreeting()}
          </span>

          <h1>
            {session.name}.
          </h1>

          <p>
            Your workday, beautifully organized.
          </p>

        </div>

        <div className="dashboard-date">

          <span>
            TODAY
          </span>

          <strong>
            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric"
              }
            )}
          </strong>

        </div>

      </header>


      <section className="employee-hero">

        <div>

          <span className="dashboard-kicker">
            YOUR DAY
          </span>

          <h2>
            {working
              ? "You're in flow."
              : "Ready when you are."}
          </h2>

          <p>

            {working
              ? "Your workday is currently active."
              : "Start your day and let Dayflow take care of the rest."}

          </p>

        </div>


        <button
          className={
            working
              ? "day-action working"
              : "day-action"
          }
          onClick={handleAttendance}
        >

          <span>
            {working ? "●" : "▶"}
          </span>

          {working
            ? "Finish Day"
            : "Start My Day"}

        </button>

      </section>


      <section className="employee-stats">

        <DashboardStat
          icon="◷"
          label="ATTENDANCE"
          value={
            data?.attendance?.length || 0
          }
          detail="Work sessions"
        />

        <DashboardStat
          icon="◇"
          label="LEAVE BALANCE"
          value={
            data?.leave_balance || 0
          }
          detail="Days available"
        />

        <DashboardStat
          icon="✦"
          label="NOTIFICATIONS"
          value={
            data?.notifications?.filter(
              notification =>
                !notification.read
            ).length || 0
          }
          detail="Unread updates"
        />

      </section>


      <section className="dashboard-grid">

        <div className="dashboard-card">

          <div className="card-title">

            <div>

              <span>
                QUICK ACTIONS
              </span>

              <h3>
                Keep things moving
              </h3>

            </div>

          </div>


          <div className="quick-grid">

            <button
              onClick={() =>
                setPage("leave")
              }
            >

              <span>
                ◇
              </span>

              <strong>
                Request leave
              </strong>

              <small>
                Plan your time off
              </small>

            </button>


            <button
              onClick={() =>
                setPage("attendance")
              }
            >

              <span>
                ◷
              </span>

              <strong>
                View attendance
              </strong>

              <small>
                See your work sessions
              </small>

            </button>


            <button
              onClick={() =>
                setPage("ask")
              }
            >

              <span>
                ✦
              </span>

              <strong>
                Ask Dayflow
              </strong>

              <small>
                Get instant answers
              </small>

            </button>


            <button
              onClick={() =>
                setPage("profile")
              }
            >

              <span>
                ○
              </span>

              <strong>
                My profile
              </strong>

              <small>
                View your information
              </small>

            </button>

          </div>

        </div>


        <div className="dashboard-card">

          <div className="card-title">

            <div>

              <span>
                LATEST
              </span>

              <h3>
                Activity
              </h3>

            </div>

          </div>


          <div className="activity-list">

            {data?.notifications
              ?.slice()
              .reverse()
              .slice(0, 4)
              .map(notification => (

                <div
                  className="activity-item"
                  key={notification.id}
                >

                  <div>
                    ✓
                  </div>

                  <span>
                    <strong>
                      {notification.title}
                    </strong>

                    {notification.message}

                  </span>

                </div>

              ))}


            {(!data?.notifications ||
              data.notifications.length === 0) && (

              <div className="empty-activity">

                <span>
                  ✦
                </span>

                <p>
                  Your Dayflow activity
                  will appear here.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

    </div>

  );

}


/* =========================================================
   ATTENDANCE
========================================================= */

function AttendancePage({
  employeeId
}) {

  const [records, setRecords] =
    useState([]);

  const load = async () => {

    try {

      const response =
        await fetch(
          `${API_URL}/api/attendance/${employeeId}`
        );

      const data =
        await response.json();

      setRecords(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

    }

  };


  useEffect(() => {

    load();

  }, []);


  return (

    <div className="simple-page">

      <PageHeader
        kicker="YOUR WORKDAY"
        title="Attendance"
        subtitle="A clear view of your work sessions."
      />


      <div className="record-card">

        {records.length === 0 ? (

          <EmptyState
            icon="◷"
            title="No attendance yet"
            text="Your work sessions will appear here."
          />

        ) : (

          records
            .slice()
            .reverse()
            .map(record => (

              <div
                className="attendance-row"
                key={record.id}
              >

                <div className="record-icon">
                  ◷
                </div>

                <div>

                  <strong>
                    {record.date}
                  </strong>

                  <span>
                    Started{" "}
                    {formatTime(
                      record.check_in
                    )}
                  </span>

                </div>

                <div className="record-end">

                  {record.check_out
                    ? `Finished ${formatTime(
                        record.check_out
                      )}`
                    : "Currently active"}

                </div>

              </div>

            ))

        )}

      </div>

    </div>

  );

}


/* =========================================================
   LEAVE
========================================================= */

function LeavePage({
  employeeId
}) {

  const [requests, setRequests] =
    useState([]);

  const [balance, setBalance] =
    useState(0);

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] =
    useState({
      leave_type: "Casual Leave",
      start_date: "",
      end_date: "",
      reason: ""
    });

  const [submitting, setSubmitting] =
    useState(false);


  const load = async () => {

    try {

      const [
        balanceResponse,
        requestResponse
      ] = await Promise.all([

        fetch(
          `${API_URL}/api/leave/${employeeId}`
        ),

        fetch(
          `${API_URL}/api/leave/requests/${employeeId}`
        )

      ]);


      const balanceData =
        await balanceResponse.json();

      const requestData =
        await requestResponse.json();


      setBalance(
        balanceData.leave_balance || 0
      );

      setRequests(
        Array.isArray(requestData)
          ? requestData
          : []
      );

    } catch (error) {

      console.error(error);

    }

  };


  useEffect(() => {

    load();

  }, []);


  const submit = async event => {

    event.preventDefault();

    setSubmitting(true);


    try {

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
            ...form
          })
        }
      );


      setForm({
        leave_type: "Casual Leave",
        start_date: "",
        end_date: "",
        reason: ""
      });

      setShowForm(false);

      await load();

    } catch (error) {

      console.error(error);

    } finally {

      setSubmitting(false);

    }

  };


  return (

    <div className="simple-page">

      <PageHeader
        kicker="TIME OFF"
        title="Leave Center"
        subtitle="Plan your time away without the paperwork."
      />


      <div className="leave-balance-card">

        <div>

          <span>
            AVAILABLE LEAVE
          </span>

          <strong>
            {balance}
          </strong>

          <p>
            days remaining
          </p>

        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          + Request leave
        </button>

      </div>


      {showForm && (

        <form
          className="leave-form"
          onSubmit={submit}
        >

          <h3>
            New leave request
          </h3>


          <label>
            Leave type
          </label>

          <select
            value={form.leave_type}
            onChange={event =>
              setForm({
                ...form,
                leave_type:
                  event.target.value
              })
            }
          >

            <option>
              Casual Leave
            </option>

            <option>
              Sick Leave
            </option>

            <option>
              Earned Leave
            </option>

          </select>


          <div className="date-grid">

            <div>

              <label>
                Start date
              </label>

              <input
                type="date"
                value={form.start_date}
                onChange={event =>
                  setForm({
                    ...form,
                    start_date:
                      event.target.value
                  })
                }
                required
              />

            </div>


            <div>

              <label>
                End date
              </label>

              <input
                type="date"
                value={form.end_date}
                onChange={event =>
                  setForm({
                    ...form,
                    end_date:
                      event.target.value
                  })
                }
                required
              />

            </div>

          </div>


          <label>
            Reason
          </label>

          <textarea
            value={form.reason}
            onChange={event =>
              setForm({
                ...form,
                reason:
                  event.target.value
              })
            }
            placeholder="Tell HR why you need leave..."
            required
          />


          <button
            className="primary-action"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit request →"}
          </button>

        </form>

      )}


      <div className="record-card">

        <div className="section-heading">

          <span>
            REQUEST HISTORY
          </span>

          <strong>
            {requests.length}
          </strong>

        </div>


        {requests.length === 0 ? (

          <EmptyState
            icon="◇"
            title="No requests"
            text="Your leave history will appear here."
          />

        ) : (

          requests
            .slice()
            .reverse()
            .map(request => (

              <div
                className="leave-history-row"
                key={request.id}
              >

                <div>

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
                    `request-badge ${
                      request.status.toLowerCase()
                    }`
                  }
                >
                  {request.status}
                </span>

              </div>

            ))

        )}

      </div>

    </div>

  );

}


/* =========================================================
   PROFILE
========================================================= */

function ProfilePage({
  session
}) {

  return (

    <div className="simple-page">

      <PageHeader
        kicker="IDENTITY"
        title="My Profile"
        subtitle="Your Dayflow employee information."
      />


      <div className="profile-card">

        <div className="large-avatar">

          {session.name
            ?.charAt(0)
            ?.toUpperCase()}

        </div>

        <h2>
          {session.name}
        </h2>

        <p>
          {session.email}
        </p>


        <div className="profile-details">

          <div>
            <span>
              ROLE
            </span>

            <strong>
              Employee
            </strong>
          </div>

          <div>
            <span>
              STATUS
            </span>

            <strong>
              Active
            </strong>
          </div>

        </div>

      </div>

    </div>

  );

}


/* =========================================================
   HR EMPLOYEE MANAGEMENT
========================================================= */

function EmployeeManagement() {

  const [employees, setEmployees] =
    useState([]);

  useEffect(() => {

    fetch(
      `${API_URL}/api/employees`
    )
      .then(response =>
        response.json()
      )
      .then(data =>
        setEmployees(
          data.employees || []
        )
      )
      .catch(console.error);

  }, []);


  return (

    <div className="simple-page">

      <PageHeader
        kicker="PEOPLE"
        title="Employee Directory"
        subtitle="Your organization's people at a glance."
      />


      <div className="admin-employee-grid">

        {employees.map(employee => (

          <div
            className="admin-employee-card"
            key={employee.id}
          >

            <div className="large-avatar small">

              {employee.name
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

            <div>

              <strong>
                {employee.name}
              </strong>

              <span>
                {employee.role}
              </span>

              <small>
                {employee.department}
              </small>

            </div>

            <i>
              ●
            </i>

          </div>

        ))}

      </div>

    </div>

  );

}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard() {

  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {

    fetch(
      `${API_URL}/api/hr/analytics`
    )
      .then(response =>
        response.json()
      )
      .then(data =>
        setAnalytics(data)
      )
      .catch(console.error);

  }, []);


  return (

    <div className="admin-dashboard">

      <PageHeader
        kicker="DAYFLOW ADMIN CORE"
        title="Command Center"
        subtitle="System-wide visibility for your organization."
      />


      <div className="admin-metrics">

        <AdminMetric
          icon="○"
          label="EMPLOYEES"
          value={
            analytics?.total_employees ??
            "—"
          }
        />

        <AdminMetric
          icon="◉"
          label="ACTIVE NOW"
          value={
            analytics?.currently_working ??
            "—"
          }
        />

        <AdminMetric
          icon="◇"
          label="PENDING"
          value={
            analytics?.pending_leave ??
            "—"
          }
        />

        <AdminMetric
          icon="✦"
          label="ACTIVITY"
          value={
            analytics
              ? `${analytics.activity_rate}%`
              : "—"
          }
        />

      </div>


      <div className="admin-command-grid">

        <div className="admin-system-card">

          <span className="dashboard-kicker">
            SYSTEM HEALTH
          </span>

          <h2>
            Everything is flowing.
          </h2>

          <SystemRow
            name="Dayflow API"
            status="ONLINE"
          />

          <SystemRow
            name="Authentication"
            status="ONLINE"
          />

          <SystemRow
            name="Notifications"
            status="ONLINE"
          />

          <SystemRow
            name="Analytics Engine"
            status="ONLINE"
          />

        </div>


        <div className="admin-system-card">

          <span className="dashboard-kicker">
            ADMIN INSIGHT
          </span>

          <div className="admin-insight-icon">
            ✦
          </div>

          <h2>
            Your organization is connected.
          </h2>

          <p>
            Dayflow is bringing attendance,
            leave, people and HR workflows
            into one unified workspace.
          </p>

        </div>

      </div>

    </div>

  );

}


/* =========================================================
   SYSTEM STATUS
========================================================= */

function SystemStatus() {

  return (

    <div className="simple-page">

      <PageHeader
        kicker="ADMIN / SYSTEM"
        title="System Status"
        subtitle="Monitor the core Dayflow services."
      />


      <div className="system-status-card">

        <SystemRow
          name="API"
          status="ONLINE"
        />

        <SystemRow
          name="Authentication"
          status="ONLINE"
        />

        <SystemRow
          name="Attendance Service"
          status="ONLINE"
        />

        <SystemRow
          name="Leave Service"
          status="ONLINE"
        />

        <SystemRow
          name="Notification Service"
          status="ONLINE"
        />

        <SystemRow
          name="Analytics"
          status="ONLINE"
        />

      </div>

    </div>

  );

}


/* =========================================================
   SMALL COMPONENTS
========================================================= */

function DashboardStat({
  icon,
  label,
  value,
  detail
}) {

  return (

    <div className="employee-stat">

      <div className="stat-icon">
        {icon}
      </div>

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        {detail}
      </small>

    </div>

  );

}


function AdminMetric({
  icon,
  label,
  value
}) {

  return (

    <div className="admin-metric">

      <span>
        {icon}
      </span>

      <small>
        {label}
      </small>

      <strong>
        {value}
      </strong>

    </div>

  );

}


function SystemRow({
  name,
  status
}) {

  return (

    <div className="system-row">

      <span>
        {name}
      </span>

      <strong>
        <i />
        {status}
      </strong>

    </div>

  );

}


function PageHeader({
  kicker,
  title,
  subtitle
}) {

  return (

    <header className="simple-header">

      <span className="dashboard-kicker">
        {kicker}
      </span>

      <h1>
        {title}
      </h1>

      <p>
        {subtitle}
      </p>

    </header>

  );

}


function EmptyState({
  icon,
  title,
  text
}) {

  return (

    <div className="empty-state">

      <div>
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>

  );

}


function formatTime(value) {

  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


function getGreeting() {

  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "GOOD MORNING";
  }

  if (hour < 17) {
    return "GOOD AFTERNOON";
  }

  return "GOOD EVENING";

}


export default App;

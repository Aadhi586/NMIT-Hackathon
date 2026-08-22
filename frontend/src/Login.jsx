import { useState } from "react";
import "./Login.css";

const DEMO_USERS = {
  "employee@dayflow.local": {
    password: "employee123",
    role: "employee",
    name: "Aadhith",
  },

  "hr@dayflow.local": {
    password: "hr123",
    role: "hr",
    name: "HR Manager",
  },

  "admin@dayflow.local": {
    password: "admin123",
    role: "admin",
    name: "System Admin",
  },
};

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 650)
    );

    const user =
      DEMO_USERS[normalizedEmail];

    if (!user || user.password !== password) {
      setLoading(false);
      setError("Invalid Dayflow credentials.");
      return;
    }

    const session = {
      email: normalizedEmail,
      name: user.name,
      role: user.role,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem(
      "dayflow_session",
      JSON.stringify(session)
    );

    setLoading(false);

    onLogin(session);
  };

  const fillDemo = (role) => {
    const account =
      Object.entries(DEMO_USERS).find(
        ([, user]) => user.role === role
      );

    if (!account) return;

    setEmail(account[0]);
    setPassword(account[1].password);
    setError("");
  };

  return (
    <div className="login-page">

      <div className="login-background-orb orb-one" />
      <div className="login-background-orb orb-two" />
      <div className="login-background-orb orb-three" />

      <div className="login-shell">

        <div className="login-brand">

          <div className="login-logo">
            <span>✦</span>
          </div>

          <div>
            <span className="login-eyebrow">
              HUMAN RESOURCE OS
            </span>

            <h1>DAYFLOW</h1>
          </div>

        </div>

        <div className="login-card">

          <div className="login-card-header">

            <div className="login-status">
              <span />
              SYSTEM ONLINE
            </div>

            <h2>
              Welcome back.
            </h2>

            <p>
              Sign in to continue your Dayflow journey.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <label>
              WORK EMAIL
            </label>

            <div className="login-input-wrapper">

              <span className="input-icon">
                @
              </span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@company.com"
                autoComplete="username"
              />

            </div>

            <label>
              PASSWORD
            </label>

            <div className="login-input-wrapper">

              <span className="input-icon">
                •
              </span>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

            {error && (
              <div className="login-error">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              className="login-submit"
              type="submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign in
                  <span>→</span>
                </>
              )}

            </button>

          </form>

          <div className="demo-divider">
            <span>DEMO ACCESS</span>
          </div>

          <div className="demo-buttons">

            <button
              onClick={() =>
                fillDemo("employee")
              }
            >
              <span>👤</span>
              Employee
            </button>

            <button
              onClick={() =>
                fillDemo("hr")
              }
            >
              <span>🧑‍💼</span>
              HR
            </button>

            <button
              onClick={() =>
                fillDemo("admin")
              }
            >
              <span>⚙</span>
              Admin
            </button>

          </div>

        </div>

        <div className="login-footer">

          <span>
            ✦
          </span>

          Secure workspace access

          <span className="footer-dot">
            •
          </span>

          Dayflow v1.0

        </div>

      </div>
    </div>
  );
}

export default Login;

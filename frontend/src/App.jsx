// frontend/src/App.jsx

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Dayflow</h1>
        <span>Good morning 👋</span>
      </header>

      <main className="dashboard">

        <section className="welcome">
          <h2>Welcome back!</h2>
          <p>Let's see how your day is flowing.</p>
        </section>

        <section className="cards">

          <div className="card">
            <h3>Today's Attendance</h3>
            <p>Not checked in</p>
          </div>

          <div className="card">
            <h3>Leave Balance</h3>
            <p>8 Days</p>
          </div>

          <div className="card">
            <h3>Working Hours</h3>
            <p>0h 00m</p>
          </div>

        </section>

        <section className="dayflow">
          <h2>Your Dayflow</h2>

          <div className="timeline">
            <div>🌅 Start</div>
            <div>🟢 Check In</div>
            <div>💻 Work</div>
            <div>🌆 Check Out</div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;

const teamStats = [
  {
    title: "Present Today",
    value: 18,
    icon: "🟢"
  },
  {
    title: "On Leave",
    value: 3,
    icon: "🟡"
  },
  {
    title: "Absent",
    value: 1,
    icon: "🔴"
  }
];

function TeamPulse() {
  return (
    <section className="team-pulse">

      <h1>Team Pulse</h1>
      <p>Live overview of your organization.</p>

      <div className="stats">
        {teamStats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <span>{stat.icon}</span>
            <h2>{stat.value}</h2>
            <p>{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="insight">
        <h2>⚡ Dayflow Insight</h2>
        <p>
          Attendance patterns will appear here
          as the system collects data.
        </p>
      </div>

    </section>
  );
}

export default TeamPulse;

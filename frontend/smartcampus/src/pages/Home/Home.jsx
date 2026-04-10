import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  const highlights = [
    {
      title: "Conflict-free booking",
      desc: "Automatic time-slot validation keeps resource schedules clean.",
    },
    {
      title: "Clear request workflow",
      desc: "Track bookings through pending, approved, rejected, and cancelled stages.",
    },
    {
      title: "Fast admin controls",
      desc: "Review, approve, and manage requests from one panel.",
    },
  ];

  const quickActions = [
    { to: "/create", title: "Create a booking", desc: "Request a new resource slot." },
    { to: "/bookings", title: "View bookings", desc: "Check status and planned sessions." },
    { to: "/admin/bookings", title: "Manage requests", desc: "Admin review and status updates." },
  ];

  return (
    <div className="home-shell">
      <section className="hero-block sc-container">
        <div className="hero-content">
          <p className="hero-kicker">Smart Campus Platform</p>
          <h1 className="hero-title">Simple booking operations for a modern campus.</h1>
          <p className="hero-subtitle">
            Manage resource reservations with a clean experience designed for students,
            staff, and admins.
          </p>

          <div className="hero-buttons">
            <Link to="/create" className="btn btn-primary">
              Start a booking
            </Link>
            <Link to="/bookings" className="btn btn-outline-primary">
              See all bookings
            </Link>
          </div>

          <div className="hero-metrics">
            <article>
              <h3>100%</h3>
              <p>Centralized booking visibility</p>
            </article>
            <article>
              <h3>24/7</h3>
              <p>Self-service request creation</p>
            </article>
            <article>
              <h3>3-step</h3>
              <p>Approval and status workflow</p>
            </article>
          </div>
        </div>
      </section>

      <section className="quick-actions sc-container">
        <header className="section-head">
          <h2>Quick Actions</h2>
          <p>Move through common tasks with one click.</p>
        </header>

        <div className="action-grid">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to} className="action-card">
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
              <span>Open</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="feature-strip sc-container">
        {highlights.map((item) => (
          <article key={item.title} className="feature-item">
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default Home;

import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  const modules = [
    {
      id: 1,
      title: "Resource Management",
      description: "Browse facilities and manage resource catalogue",
      icon: "📚",
      links: [
        { to: "/resources", title: "View Facilities", action: "Browse" }
      ],
      features: [
        "Facility catalogue",
        "Resource availability",
        "Capacity management"
      ],
      member: "Member 1",
      color: "accent-blue"
    },
    {
      id: 2,
      title: "Booking & Scheduling",
      description: "Create and manage resource bookings with conflict detection",
      icon: "📅",
      links: [
        { to: "/create", title: "Create Booking", action: "New" },
        { to: "/bookings", title: "View Bookings", action: "View" }
      ],
      features: [
        "Conflict-free validation",
        "Time-slot management",
        "Status tracking"
      ],
      member: "Member 2",
      color: "accent-green"
    },
    {
      id: 3,
      title: "Incident Management",
      description: "Report and track campus incidents with technician support",
      icon: "🔧",
      links: [
        { to: "/tickets", title: "View Tickets", action: "Browse" },
        { to: "/tickets/create", title: "Report Issue", action: "New" }
      ],
      features: [
        "Ticket creation",
        "Technician assignment",
        "Comment & attachments"
      ],
      member: "Member 3",
      color: "accent-orange"
    },
    {
      id: 4,
      title: "Admin & Notifications",
      description: "Approve requests, manage roles, and send notifications",
      icon: "👥",
      links: [
        { to: "/admin/bookings", title: "Manage Requests", action: "Admin" },
        { to: "/admin", title: "Dashboard", action: "View" }
      ],
      features: [
        "Request approval",
        "Role management",
        "Notifications"
      ],
      member: "Member 4",
      color: "accent-purple"
    }
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
          <h1 className="hero-title">Unified campus resource management system</h1>
          <p className="hero-subtitle">
            Collaborate seamlessly across facilities management, booking workflows, incident tracking, and administrative controls designed for modern campus operations.
          </p>

          <div className="hero-buttons">
            <Link to="/create" className="btn btn-primary">
              Create a booking
            </Link>
            <Link to="/bookings" className="btn btn-outline-primary">
              Explore features
            </Link>
          </div>

          <div className="hero-metrics">
            <article>
              <h3>4</h3>
              <p>Core modules</p>
            </article>
            <article>
              <h3>4</h3>
              <p>Team members</p>
            </article>
            <article>
              <h3>∞</h3>
              <p>Possibilities</p>
            </article>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="modules-section sc-container">
        <header className="section-head">
          <h2>System Modules</h2>
          <p>Four specialized modules working together to deliver comprehensive campus management.</p>
        </header>

        <div className="modules-grid">
          {modules.map((module) => (
            <div key={module.id} className={`module-card ${module.color}`}>
              <div className="module-header">
                <div className="module-icon">{module.icon}</div>
                <span className="module-member">{module.member}</span>
              </div>
              
              <h3>{module.title}</h3>
              <p className="module-desc">{module.description}</p>
              
              <div className="module-features">
                {module.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>

              <div className="module-links">
                {module.links.map((link, idx) => (
                  <Link key={idx} to={link.to} className="module-link">
                    {link.title}
                    <span className="link-arrow">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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

      <section className="features-section sc-container">
        <header className="section-head">
          <h2>Key Features</h2>
          <p>Built for efficiency and collaboration</p>
        </header>

        <div className="feature-strip">
          <article className="feature-item">
            <h3>Conflict-free booking</h3>
            <p>Automatic time-slot validation keeps resource schedules clean and prevents double bookings.</p>
          </article>
          <article className="feature-item">
            <h3>Clear workflows</h3>
            <p>Track requests through pending, approved, rejected, and cancelled stages with full visibility.</p>
          </article>
          <article className="feature-item">
            <h3>Fast admin controls</h3>
            <p>Review, approve, and manage all requests from one intuitive dashboard.</p>
          </article>
        </div>
      </section>

      <section className="team-section sc-container">
        <header className="section-head">
          <h2>Development Team</h2>
          <p>Each member owns a distinct module of the system</p>
        </header>

        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">👤</div>
            <h4>Member 1</h4>
            <p className="team-role">Resource Management</p>
            <p className="team-desc">Facilities catalogue & resource endpoints</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">👤</div>
            <h4>Member 2</h4>
            <p className="team-role">Booking System</p>
            <p className="team-desc">Booking workflow & conflict checking</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">👤</div>
            <h4>Member 3</h4>
            <p className="team-role">Incident Management</p>
            <p className="team-desc">Tickets, attachments & technician updates</p>
          </div>
          <div className="team-card">
            <div className="team-avatar">👤</div>
            <h4>Member 4</h4>
            <p className="team-role">Admin & Integration</p>
            <p className="team-desc">Notifications, roles & OAuth improvements</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

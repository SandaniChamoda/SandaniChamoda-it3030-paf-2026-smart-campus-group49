import { Link, NavLink } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const stats = [
    { label: "Total Bookings", value: "125", helper: "All booking requests" },
    { label: "Pending", value: "8", helper: "Waiting for review" },
    { label: "Approved Today", value: "14", helper: "Completed approvals" },
    { label: "Active Resources", value: "24", helper: "Bookable campus resources" },
  ];

  const links = [
    {
      to: "/admin/bookings",
      title: "Manage Bookings",
      desc: "Review pending requests and update statuses.",
    },
    {
      to: "/bookings",
      title: "View Booking Table",
      desc: "Inspect all booking entries and details.",
    },
    {
      to: "/create",
      title: "Create Manual Booking",
      desc: "Add a booking request directly from admin.",
    },
  ];

  const sideLinks = [
    { label: "Users" },
    { to: "/admin/resources", label: "Resources" },
    { to: "/admin", label: "Bookings", end: true },
    { to: "/tickets/admin", label: "Tickets" },
  ];

  return (
    <section className="admin-layout">
      <aside className="admin-sidebar">
        <div>
          <p className="admin-side-kicker">Admin Panel</p>
          <h2 className="admin-side-title">Operations</h2>

          <nav className="admin-side-nav" aria-label="Admin sections">
            {sideLinks.map((item) => (
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-side-link${isActive ? " active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <button key={item.label} type="button" className="admin-side-link admin-side-link-button">
                  {item.label}
                </button>
              )
            ))}
          </nav>
        </div>

        <div className="admin-side-bottom">
          <Link to="/tickets/create" className="admin-side-link support-link">
            Support
          </Link>
          <Link to="/" className="admin-side-link logout-link">
            Logout
          </Link>
        </div>
      </aside>

      <div className="admin-shell">
        <header className="admin-head">
          <div>
            <p className="admin-kicker">Administration</p>
            <h1>Campus Operations Dashboard</h1>
            <p className="admin-subtitle">
              Monitor booking demand and keep campus resources running smoothly.
            </p>
          </div>
          <Link to="/admin/bookings" className="btn btn-primary">
            Open Booking Queue
          </Link>
        </header>

        <div className="admin-stats">
          {stats.map((stat) => (
            <article className="admin-stat-card" key={stat.label}>
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
              <span>{stat.helper}</span>
            </article>
          ))}
        </div>

        <div className="admin-links">
          {links.map((item) => (
            <Link key={item.to} to={item.to} className="admin-link-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span>Go to section</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;

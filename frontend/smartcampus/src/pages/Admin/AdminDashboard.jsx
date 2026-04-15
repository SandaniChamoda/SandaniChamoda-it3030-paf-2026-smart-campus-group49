import { Link } from "react-router-dom";
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

  return (
    <section className="admin-shell sc-container">
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
    </section>
  );
}

export default AdminDashboard;

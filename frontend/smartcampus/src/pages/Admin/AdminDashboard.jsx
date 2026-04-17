import { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "booking", label: "Booking", icon: "📅" },
    { id: "tickets", label: "Tickets", icon: "🎫" },
    { id: "users", label: "Users", icon: "👥" },
  ];

  const stats = [
    { label: "Total Bookings", value: "125", color: "blue" },
    { label: "Pending Requests", value: "8", color: "orange" },
    { label: "Active Resources", value: "24", color: "blue" },
    { label: "Open Tickets", value: "12", color: "orange" },
  ];

  const recentBookings = [
    { id: 1, resource: "Lab 201", date: "2026-04-17", user: "John Doe", status: "approved" },
    { id: 2, resource: "Conference Room", date: "2026-04-17", user: "Jane Smith", status: "pending" },
    { id: 3, resource: "Auditorium", date: "2026-04-16", user: "Mike Wilson", status: "approved" },
  ];

  return (
    <div className="admin-dashboard">
      {/* LEFT SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-profile">
          <div className="profile-avatar">
            <span>👤</span>
          </div>
          <h3>Admin Panel</h3>
          <p>Smart Campus</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeNav === item.id ? "active" : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-stats">
          <h4>Quick Stats</h4>
          <div className="quick-stat">
            <span>Resources</span>
            <strong>24</strong>
          </div>
          <div className="quick-stat">
            <span>Users</span>
            <strong>45</strong>
          </div>
          <div className="quick-stat">
            <span>Tickets</span>
            <strong>12</strong>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h1>Campus Operations Dashboard</h1>
            <p>Monitor and manage all campus resources, bookings, and tickets</p>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="admin-stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className={`stat-card stat-${stat.color}`}>
              <p className="stat-label">{stat.label}</p>
              <h2 className="stat-value">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* CONTENT SECTIONS */}
        <div className="admin-content">
          {/* RECENT BOOKINGS */}
          <section className="content-section">
            <div className="section-header">
              <h3>Recent Bookings</h3>
              <Link to="/admin/bookings" className="view-all">View All</Link>
            </div>
            <div className="bookings-table">
              <div className="table-header">
                <div className="col-resource">Resource</div>
                <div className="col-date">Date</div>
                <div className="col-user">User</div>
                <div className="col-status">Status</div>
              </div>
              {recentBookings.map((booking) => (
                <div key={booking.id} className="table-row">
                  <div className="col-resource">
                    <strong>{booking.resource}</strong>
                  </div>
                  <div className="col-date">{booking.date}</div>
                  <div className="col-user">{booking.user}</div>
                  <div className="col-status">
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="content-section">
            <div className="section-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <Link to="/admin/bookings" className="action-btn action-blue">
                <span>📅</span>
                Manage Bookings
              </Link>
              <Link to="/resources" className="action-btn action-orange">
                <span>📚</span>
                Manage Resources
              </Link>
              <Link to="/tickets" className="action-btn action-blue">
                <span>🎫</span>
                View Tickets
              </Link>
              <Link to="/admin/users" className="action-btn action-orange">
                <span>👥</span>
                Manage Users
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function StudentSidebar() {
  const { user, logout } = useAuth();

  const studentName = user?.name || "Student User";
  const studentRole = user?.role === "USER" ? "Student" : user?.role || "Student";
  const profileImage = user?.profilePicture || user?.imageUrl || user?.avatarUrl || "";
  const studentInitials = studentName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  const sideLinks = [
    { to: "/dashboard/student", label: "Dashboard", end: true },
    { to: "/bookings", label: "Bookings" },
    { to: "/resources", label: "Resources" },
    { to: "/tickets/my", label: "Tickets", end: true },
    { to: "/notifications", label: "Notifications" },
    { to: "/account/settings", label: "Account" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-side-brand">
          <span className="admin-side-brand-dot" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle cx="8" cy="8" r="3.3" />
              <circle cx="18" cy="8" r="3.3" />
              <circle cx="8" cy="18" r="3.3" />
              <circle cx="18" cy="18" r="3.3" />
            </svg>
          </span>
          <strong>VertexOne</strong>
        </div>

        <div className="admin-side-profile">
          <div className="admin-side-avatar" aria-hidden="true">
            {profileImage ? (
              <img src={profileImage} alt="" />
            ) : (
              <span>{studentInitials || "ST"}</span>
            )}
          </div>
          <h3>{studentName}</h3>
          <p>{studentRole}</p>
        </div>

        <p className="admin-side-kicker">Student Panel</p>
        <h2 className="admin-side-title">Campus Hub</h2>

        <nav className="admin-side-nav" aria-label="Student sections">
          {sideLinks.map((item) => (
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
          ))}
        </nav>
      </div>

      <div className="admin-side-bottom">
        <Link to="/tickets/create" className="admin-side-link support-link">
          Support
        </Link>
        <button
          type="button"
          className="admin-side-link admin-side-link-button logout-link"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default StudentSidebar;
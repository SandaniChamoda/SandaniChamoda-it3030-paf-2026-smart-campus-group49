import "./Header.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, getRoleDashboardPath } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const roleLabel = user?.role === "USER" ? "Student" : user?.role;

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  const navLinkClass = ({ isActive }) =>
    `header-link${isActive ? " active" : ""}`;

  return (
    <header className="header-shell">
      <div className="sc-container header-row">
        <NavLink to="/" className="header-brand" onClick={closeMenu}>
          SmartCampus
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          Menu
        </button>

        <nav className={`header-nav${menuOpen ? " open" : ""}`}>
          <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to={getRoleDashboardPath(user?.role)}
                className={navLinkClass}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/resources"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Resources
              </NavLink>
              <NavLink
                to="/bookings"
                className={navLinkClass}
                onClick={closeMenu}
              >
                My Bookings
              </NavLink>
              <NavLink
                to="/create"
                className={navLinkClass}
                onClick={closeMenu}
              >
                New Booking
              </NavLink>
              <NavLink
                to="/bookings/calendar"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Booking Calendar
              </NavLink>
              {user?.role === "ADMIN" && (
                <>
                  <NavLink
                    to="/admin"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    Admin Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/resources"
                    className={navLinkClass}
                    onClick={closeMenu}
                  >
                    Manage Resources
                  </NavLink>
                </>
              )}
              <NavLink
                to="/notifications"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Notifications
              </NavLink>
              <NavLink
                to="/account/settings"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Account
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass} onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink to="/signup" className={navLinkClass} onClick={closeMenu}>
                Signup
              </NavLink>
            </>
          )}
        </nav>

        {isAuthenticated && (
          <div className="header-auth-rail">
            <NotificationBell />
            <div className="header-user-meta">
              <span className="header-user-name">{user?.name || "User"}</span>
              <span className="header-user-role">{roleLabel}</span>
            </div>
            <button className="header-logout-btn" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

import "./Header.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

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
          <NavLink
            to="/"
            end
            className={navLinkClass}
            onClick={closeMenu}
          >
            Home
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
          <NavLink
            to="/admin"
            className={navLinkClass}
            onClick={closeMenu}
          >
            Admin Dashboard
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;

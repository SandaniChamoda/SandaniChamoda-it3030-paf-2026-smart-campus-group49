import { Routes, Route, Link, Navigate } from "react-router-dom";

import Home from "./pages/Home/Home";
import BookingList from "./pages/Booking/BookingList";
import CreateBooking from "./pages/Booking/CreateBooking";
import BookingAdmin from "./pages/Booking/BookingAdmin";

import LoginPage from "./components/auth/LoginPage";
import OAuth2RedirectHandler from "./components/auth/OAuth2RedirectHandler";
import NotificationBell from "./components/notifications/NotificationBell";
import NotificationList from "./components/notifications/NotificationList";
import UserManagement from "./components/users/UserManagement";

import { AuthProvider, useAuth } from "./context/AuthContext";

function NavBar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link to="/home" className="navbar-brand">
        Smart Campus
      </Link>

      <div className="d-flex align-items-center gap-2">
        <Link to="/home" className="btn btn-light btn-sm">Home</Link>
        <Link to="/bookings" className="btn btn-light btn-sm">Bookings</Link>
        <Link to="/create" className="btn btn-light btn-sm">Create Booking</Link>
        <Link to="/admin" className="btn btn-light btn-sm">Admin</Link>
        {isAdmin && (
          <Link to="/users" className="btn btn-warning btn-sm">Users</Link>
        )}
        <Link to="/notifications" className="btn btn-link p-0">
          <NotificationBell />
        </Link>
        <span className="text-white-50 small">{user?.name}</span>
        <button onClick={logout} className="btn btn-outline-light btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <>
      <NavBar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

        {/* Protected routes */}
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/bookings" element={isAuthenticated ? <BookingList /> : <Navigate to="/login" />} />
        <Route path="/create" element={isAuthenticated ? <CreateBooking /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated ? <BookingAdmin /> : <Navigate to="/login" />} />
        <Route path="/notifications" element={isAuthenticated ? <NotificationList /> : <Navigate to="/login" />} />
        <Route path="/users" element={isAuthenticated ? <UserManagement /> : <Navigate to="/login" />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

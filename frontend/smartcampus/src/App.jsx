import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header/Header";
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import OAuth2RedirectHandler from "./components/auth/OAuth2RedirectHandler";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotificationList from "./components/notifications/NotificationList";
import UserManagement from "./components/users/UserManagement";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home/Home";
import BookingList from "./pages/Booking/BookingList";
import CreateBooking from "./pages/Booking/CreateBooking";
import UpdateBooking from "./pages/Booking/UpdateBooking";
import BookingAdmin from "./pages/Booking/BookingAdmin";
import BookingCalendar from "./pages/Booking/BookingCalendar";
import ResourcePage from "./pages/Resource/ResourcePage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import MockScannerPage from "./pages/Booking/MockScannerPage";
import MockVerifyPage from "./pages/Booking/MockVerifyPage";

import CreateTicket from "./pages/Ticket/CreateTicket";
import MyTickets from "./pages/Ticket/MyTickets";
import TicketDetails from "./pages/Ticket/TicketDetails";
import AdminTickets from "./pages/Ticket/AdminTickets";
import TechnicianTickets from "./pages/Ticket/TechnicianTickets";
import AssignTechnician from "./pages/Ticket/AssignTechnician";
import UpdateTicketStatus from "./pages/Ticket/UpdateTicketStatus";
import TicketComments from "./pages/Ticket/TicketComments";
import AdminTicketDetails from "./pages/Ticket/AdminTicketDetails";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import TechnicianDashboard from "./pages/Dashboard/TechnicianDashboard";
import AdminRoleDashboard from "./pages/Dashboard/AdminRoleDashboard";
import AccountSettingsPage from "./pages/Dashboard/AccountSettingsPage";

function GuestRoute({ children }) {
  const { isAuthenticated, loading, user, getRoleDashboardPath } = useAuth();

  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to={getRoleDashboardPath(user?.role)} replace />;
  }

  return children;
}

function RoleHomeRedirect() {
  const { loading, isAuthenticated, user, getRoleDashboardPath } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboardPath(user?.role)} replace />;
}

function App() {
  return (
    <div className="app-shell">
      {/* Header Component */}
      <Header />

      {/* Pages */}
      <main className="sc-page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route
            path="/login"
            element={(
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            )}
          />
          <Route
            path="/signup"
            element={(
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            )}
          />
          <Route
            path="/forgot-password"
            element={(
              <GuestRoute>
                <ForgotPasswordPage />
              </GuestRoute>
            )}
          />
          <Route
            path="/reset-password"
            element={(
              <GuestRoute>
                <ResetPasswordPage />
              </GuestRoute>
            )}
          />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

          <Route path="/dashboard" element={<RoleHomeRedirect />} />
          <Route
            path="/dashboard/student"
            element={(
              <ProtectedRoute allowedRoles={["USER"]}>
                <StudentDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard/technician"
            element={(
              <ProtectedRoute allowedRoles={["TECHNICIAN"]}>
                <TechnicianDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/dashboard/admin"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminRoleDashboard />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/account/settings"
            element={(
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/notifications"
            element={(
              <ProtectedRoute>
                <NotificationList />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin/users"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <UserManagement />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/resources"
            element={(
              <ProtectedRoute>
                <ResourcePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/bookings"
            element={(
              <ProtectedRoute>
                <BookingList />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/bookings/calendar"
            element={(
              <ProtectedRoute>
                <BookingCalendar />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/create"
            element={(
              <ProtectedRoute>
                <CreateBooking />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/bookings/:id/edit"
            element={(
              <ProtectedRoute>
                <UpdateBooking />
              </ProtectedRoute>
            )}
          />

          <Route
            path="/admin"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route
            path="/admin/bookings"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <BookingAdmin />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/scanner-mock"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <MockScannerPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/mock-verify/:id"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <MockVerifyPage />
              </ProtectedRoute>
            )}
          />

          {/* sandani */}
          <Route
            path="/tickets/create"
            element={(
              <ProtectedRoute>
                <CreateTicket />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/my"
            element={(
              <ProtectedRoute>
                <MyTickets />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/details/:id"
            element={(
              <ProtectedRoute>
                <TicketDetails />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/admin"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminTickets />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/technician"
            element={(
              <ProtectedRoute allowedRoles={["TECHNICIAN", "ADMIN"]}>
                <TechnicianTickets />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/assign/:id"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AssignTechnician />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/update-status/:id"
            element={(
              <ProtectedRoute allowedRoles={["TECHNICIAN", "ADMIN"]}>
                <UpdateTicketStatus />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/comments/:id"
            element={(
              <ProtectedRoute>
                <TicketComments />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/tickets/admin/details/:id"
            element={(
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminTicketDetails />
              </ProtectedRoute>
            )}
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

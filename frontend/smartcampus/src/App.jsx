import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header/Header";

import Home from "./pages/Home/Home";
import BookingList from "./pages/Booking/BookingList";
import CreateBooking from "./pages/Booking/CreateBooking";
import UpdateBooking from "./pages/Booking/UpdateBooking";
import BookingAdmin from "./pages/Booking/BookingAdmin";


import BookingCalendar from "./pages/Booking/BookingCalendar";


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

import ResourceList from "./pages/Resource/ResourceList";
import AdminResourcePage from "./pages/Resource/AdminResourcePage";
function App() {
  return (
    <div className="app-shell">

      <Header />

      {/* Pages */}
      <main className="sc-page">
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />


          <Route path="/resources" element={<ResourceList />} />
          <Route path="/admin/resources" element={<AdminResourcePage />} />


          
          <Route path="/bookings/calendar" element={<BookingCalendar />} />


          <Route path="/bookings" element={<BookingList />} />
          <Route path="/create" element={<CreateBooking />} />
          <Route path="/bookings/:id/edit" element={<UpdateBooking />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/bookings" element={<BookingAdmin />} />

          <Route path="/scanner-mock" element={<MockScannerPage />} />
          <Route path="/mock-verify/:id" element={<MockVerifyPage />} />

          {/* Ticket routes */}
          <Route path="/tickets/create" element={<CreateTicket />} />
          <Route path="/tickets/my" element={<MyTickets />} />
          <Route path="/tickets/details/:id" element={<TicketDetails />} />
          <Route path="/tickets/admin" element={<AdminTickets />} />
          <Route path="/tickets/technician" element={<TechnicianTickets />} />
          <Route path="/tickets/assign/:id" element={<AssignTechnician />} />
          <Route path="/tickets/update-status/:id" element={<UpdateTicketStatus />} />
          <Route path="/tickets/comments/:id" element={<TicketComments />} />
          <Route path="/tickets/admin/details/:id" element={<AdminTicketDetails />} />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>

    </div>
  );
}

export default App;
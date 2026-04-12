import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header/Header";

import Home from "./pages/Home/Home";
import BookingList from "./pages/Booking/BookingList";
import CreateBooking from "./pages/Booking/CreateBooking";
import UpdateBooking from "./pages/Booking/UpdateBooking";
import BookingAdmin from "./pages/Booking/BookingAdmin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import MockScannerPage from "./pages/Booking/MockScannerPage";
import MockVerifyPage from "./pages/Booking/MockVerifyPage";

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

          <Route path="/bookings" element={<BookingList />} />

          <Route path="/create" element={<CreateBooking />} />
          <Route path="/bookings/:id/edit" element={<UpdateBooking />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/bookings" element={<BookingAdmin />} />
          <Route path="/scanner-mock" element={<MockScannerPage />} />
          <Route path="/mock-verify/:id" element={<MockVerifyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>

    </div>
  );
}

export default App;

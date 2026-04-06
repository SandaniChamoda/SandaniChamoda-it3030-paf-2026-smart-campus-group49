import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import BookingList from "./pages/Booking/BookingList";
import CreateBooking from "./pages/Booking/CreateBooking";
import BookingAdmin from "./pages/Booking/BookingAdmin";

function App() {

  return (

    <div>

      {/* Navigation Bar */}

      <nav className="navbar navbar-dark bg-dark px-3">

        <Link to="/" className="navbar-brand">
          Smart Campus
        </Link>

        <div>

          <Link to="/" className="btn btn-light me-2">
            Home
          </Link>

          <Link to="/bookings" className="btn btn-light">
            Bookings
          </Link>

          <Link to="/create" className="btn btn-light ms-2">
            Create Booking
          </Link>

          <Link to="/admin" className="btn btn-light ms-2">
            Admin
          </Link>

        </div>

      </nav>

      {/* Pages */}

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/bookings" element={<BookingList />} />

        <Route path="/create" element={<CreateBooking />} />
        <Route path="/admin" element={<BookingAdmin />} />

      </Routes>

    </div>

  );
}

export default App;
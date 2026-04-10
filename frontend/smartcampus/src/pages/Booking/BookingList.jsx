import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

const getStatusBadgeClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-warning-subtle text-warning-emphasis border border-warning-subtle";
    case "APPROVED":
      return "bg-success-subtle text-success-emphasis border border-success-subtle";
    case "REJECTED":
      return "bg-danger-subtle text-danger-emphasis border border-danger-subtle";
    case "CANCELLED":
      return "bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle";
    default:
      return "bg-light text-dark border";
  }
};

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/bookings");
      setBookings(response.data);
    } catch (e) {
      console.error("Error fetching bookings", e);
      setError("Couldn't load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sc-container py-4">
      <div className="sc-card">
        <div className="sc-card-header d-flex align-items-end justify-content-between flex-wrap gap-2">
          <div>
            <h2 className="h4 mb-1">Bookings</h2>
            <div className="text-muted small">View all current bookings.</div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary btn-sm" onClick={fetchBookings}>
              Refresh
            </button>
            <Link to="/create" className="btn btn-primary btn-sm">
              Create Booking
            </Link>
          </div>
        </div>

        <div className="sc-card-body">
          {error ? <div className="alert alert-warning mb-3">{error}</div> : null}

          <div className="table-responsive border rounded-4 overflow-hidden">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th>Resource</th>
                  <th>Purpose</th>
                  <th style={{ width: 120 }}>Attendees</th>
                  <th style={{ width: 200 }}>Start</th>
                  <th style={{ width: 200 }}>End</th>
                  <th style={{ width: 140 }}>Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">
                      Loading…
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-semibold">{b.id}</td>
                      <td>{b.resourceName}</td>
                      <td className="text-muted">{b.purpose}</td>
                      <td>{b.attendees}</td>
                      <td className="text-muted small">{b.startTime}</td>
                      <td className="text-muted small">{b.endTime}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${getStatusBadgeClass(
                            b.status,
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingList;

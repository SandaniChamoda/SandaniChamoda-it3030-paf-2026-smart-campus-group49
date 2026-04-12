import { useEffect, useMemo, useState } from "react";
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
  const [resourceName, setResourceName] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBookings(resourceName, statusFilter);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [resourceName, statusFilter]);

  const fetchBookings = async (resource, status) => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      const trimmed = (resource ?? "").trim();

      if (trimmed) {
        params.resourceName = trimmed;
      }

      if (status && status !== "ALL") {
        params.status = status;
      }

      const response = await API.get("/bookings", { params });
      setBookings(response.data);
    } catch (e) {
      console.error("Error fetching bookings", e);
      setError("Couldn't load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this booking?");
    if (!confirmed) return;

    try {
      await API.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      console.error("Error deleting booking", e);
      setError("Couldn't delete booking. Please try again.");
    }
  };

  const handleCancel = async (id) => {
    const confirmed = window.confirm("Cancel this booking?");
    if (!confirmed) return;

    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (e) {
      console.error("Error cancelling booking", e);
      setError("Couldn't cancel booking. Please try again.");
    }
  };

  const buildQrUrl = (qrCode) => {
    const value = (qrCode ?? "").trim();
    if (!value) return "";

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    const apiBase = (API.defaults.baseURL ?? "").replace(/\/api\/?$/, "");
    return `${apiBase}/${value.replace(/^\/+/, "")}`;
  };

  const handleViewQr = (qrCode) => {
    const qrUrl = buildQrUrl(qrCode);

    if (!qrUrl) {
      setError("QR is not available for this booking yet.");
      return;
    }

    window.open(qrUrl, "_blank", "noopener,noreferrer");
  };

  const filteredBookings = useMemo(() => {
    const search = (resourceName ?? "").trim().toLowerCase();

    return bookings.filter((b) => {
      const name = ((b?.resourceName ?? "") + "").trim().toLowerCase();
      const statusOk = statusFilter === "ALL" ? true : b?.status === statusFilter;
      const searchOk = !search ? true : name.includes(search);
      return statusOk && searchOk;
    });
  }, [bookings, resourceName, statusFilter]);

  return (
    <div className="sc-container py-4">
      <div className="sc-card">
        <div className="sc-card-header d-flex align-items-end justify-content-between flex-wrap gap-2">
          <div>
            <h2 className="h4 mb-1">Bookings</h2>
            <div className="text-muted small">View all current bookings.</div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: 200 }}
              placeholder="Search resource"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
            />

            <select
              className="form-select form-select-sm"
              style={{ width: 180 }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => fetchBookings(resourceName, statusFilter)}
            >
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
                  <th>Booked By</th>
                  <th>Purpose</th>
                  <th style={{ width: 120 }}>Attendees</th>
                  <th style={{ width: 200 }}>Start</th>
                  <th style={{ width: 200 }}>End</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 230 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-5">
                      Loading…
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted py-5">
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-semibold">{b.id}</td>
                      <td>{b.resourceName}</td>
                      <td className="text-muted">{b.bookedBy || "-"}</td>
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
                      <td>
                        {b.status === "PENDING" ? (
                          <div className="d-flex gap-2">
                            <Link
                              to={`/bookings/${b.id}/edit`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(b.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : b.status === "APPROVED" ? (
                          <div className="d-flex gap-2 flex-wrap">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewQr(b.qrCode)}
                            >
                              View QR
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancel(b.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted small">No actions</span>
                        )}
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

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
  const colors = {
    primaryDark: "#1A1F5A",
    primaryGradientEnd: "#2A3080",
    accentOrange: "#F5A623",
    accentOrangeHover: "#E09612",
    textDark: "#1A1F5A",
    textMedium: "#6B7BA4",
    textLight: "#C8D9FF",
    bgLight: "#F7F9FF",
    bgStats: "#F0F4FF",
    borderLight: "#E3E9F8",
    white: "#FFFFFF",
    danger: "#DC2626",
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${colors.bgLight} 0%, ${colors.white} 100%)`,
      padding: "32px 20px 60px",
    },
    wrapper: {
      maxWidth: "1100px",
      margin: "0 auto",
    },
    hero: {
      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryGradientEnd} 100%)`,
      borderRadius: "24px",
      padding: "32px",
      color: colors.white,
      marginBottom: "28px",
      boxShadow: "0 18px 40px rgba(26, 31, 90, 0.16)",
    },
    heroTitle: {
      margin: 0,
      fontSize: "34px",
      fontWeight: "800",
      lineHeight: "1.2",
    },
    heroText: {
      marginTop: "10px",
      marginBottom: 0,
      color: colors.textLight,
      fontSize: "15px",
      lineHeight: "1.7",
      maxWidth: "760px",
    },
    card: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "22px",
      padding: "28px",
      boxShadow: "0 16px 36px rgba(17, 24, 39, 0.06)",
    },
    sectionTitle: {
      margin: 0,
      fontSize: "22px",
      fontWeight: "700",
      color: colors.textDark,
    },
    sectionText: {
      marginTop: "8px",
      color: colors.textMedium,
      fontSize: "14px",
      lineHeight: "1.7",
    },
    actionRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "16px",
      flexWrap: "wrap",
      marginTop: "18px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "12px",
      border: `1px solid ${colors.borderLight}`,
      backgroundColor: colors.white,
      fontSize: "13px",
      color: colors.textDark,
      outline: "none",
      boxSizing: "border-box",
    },
    primaryButton: {
      border: "none",
      borderRadius: "12px",
      backgroundColor: colors.accentOrange,
      color: colors.white,
      fontSize: "13px",
      fontWeight: "800",
      padding: "10px 16px",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 20px rgba(245, 166, 35, 0.2)",
    },
    ghostButton: {
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "12px",
      backgroundColor: colors.white,
      color: colors.textDark,
      fontSize: "13px",
      fontWeight: "700",
      padding: "10px 14px",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    errorBox: {
      backgroundColor: "#FEF2F2",
      border: "1px solid #FECACA",
      color: colors.danger,
      padding: "12px 14px",
      borderRadius: "14px",
      fontSize: "13px",
      fontWeight: "600",
      marginBottom: "18px",
    },
  };
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
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Booking Overview</h1>
          <p style={styles.heroText}>
            Track upcoming reservations and manage your bookings in one place.
            Use filters to find a resource quickly.
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Bookings</h2>
          <p style={styles.sectionText}>View all current bookings.</p>

          <div style={styles.actionRow}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search resource"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                style={{ ...styles.input, width: 200 }}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...styles.input, width: 180 }}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                type="button"
                style={styles.ghostButton}
                onClick={() => fetchBookings(resourceName, statusFilter)}
              >
                Refresh
              </button>
            </div>

            <Link to="/create" style={styles.primaryButton}>
              Create Booking
            </Link>
          </div>

          {error ? <div style={styles.errorBox}>{error}</div> : null}

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

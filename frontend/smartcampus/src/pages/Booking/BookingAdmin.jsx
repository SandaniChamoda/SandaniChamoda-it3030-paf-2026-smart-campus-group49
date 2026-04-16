import { useEffect, useMemo, useState } from "react";
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

const getResourceApiCandidates = () => {
  const baseURL = (API?.defaults?.baseURL ?? "").replace(/\/+$/, "");
  const nonApiBase = baseURL.replace(/\/api$/i, "");
  const candidates = ["/resources"];

  if (nonApiBase) {
    candidates.push(`${nonApiBase}/resources`);
  }

  return [...new Set(candidates)];
};

const normalizeName = (value) => (value ?? "").trim().toLowerCase();

function BookingAdmin() {
  const colors = {
    primaryDark: "#1A1F5A",
    primaryGradientEnd: "#2A3080",
    accentOrange: "#F5A623",
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
      maxWidth: "1200px",
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
  const [resourceName, setResourceName] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [allBookings, setAllBookings] = useState([]);
  const [resourceCapacityMap, setResourceCapacityMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resourceError, setResourceError] = useState("");

  useEffect(() => {
    fetchBookings(resourceName, statusFilter);
    fetchResources();
  }, []);

  const getCapacity = (name) => {
    const key = normalizeName(name);
    return resourceCapacityMap[key] ?? null;
  };

  const exceedsCapacity = (booking) => {
    const cap = getCapacity(booking?.resourceName);
    if (cap == null) return false;
    return Number(booking?.attendees) > Number(cap);
  };

  const filteredBookings = useMemo(() => {
    const search = (resourceName ?? "").trim().toLowerCase();

    return allBookings.filter((b) => {
      const name = ((b?.resourceName ?? "") + "").trim().toLowerCase();
      const statusOk = statusFilter === "ALL" ? true : b?.status === statusFilter;
      const searchOk = !search ? true : name.includes(search);
      return statusOk && searchOk;
    });
  }, [allBookings, resourceName, statusFilter]);

  const fetchResources = async () => {
    setResourceError("");

    const endpoints = getResourceApiCandidates();

    for (const endpoint of endpoints) {
      try {
        const response = await API.get(endpoint);

        if (!Array.isArray(response.data)) {
          continue;
        }

        const map = {};

        response.data.forEach((resource) => {
          const key = normalizeName(resource?.name);
          if (!key) return;
          map[key] = resource?.capacity ?? null;
        });

        setResourceCapacityMap(map);
        return;
      } catch {
        // Try next endpoint candidate.
      }
    }

    setResourceCapacityMap({});
    setResourceError("Couldn't load resource capacities.");
  };

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
      setAllBookings(response.data);
    } catch (e) {
      console.error("Error fetching bookings", e);
      setError("Couldn't load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const approveBooking = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to approve this booking?",
    );

    if (!confirmAction) return;

    await API.put(`/bookings/${id}/approve`);
    fetchBookings(resourceName, statusFilter);
  };

  const rejectBooking = async (id, presetReason = "") => {
    const reason = presetReason || prompt("Enter rejection reason:");

    if (!reason) {
      alert("Reason is required");
      return;
    }

    const confirmAction = window.confirm(
      "Are you sure you want to reject this booking?",
    );

    if (!confirmAction) return;

    try {
      await API.put(`/bookings/${id}/reject`, { reason });
      fetchBookings(resourceName, statusFilter);
    } catch (e) {
      console.error(e);
      alert("Error rejecting booking");
    }
  };

  const cancelBooking = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmAction) return;

    await API.put(`/bookings/${id}/cancel`);
    fetchBookings(resourceName, statusFilter);
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Booking Administration</h1>
          <p style={styles.heroText}>
            Approve, reject, and manage booking requests while keeping capacity
            and timing in view.
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Admin Queue</h2>
          <p style={styles.sectionText}>
            Review bookings, filter by status, and take action quickly.
          </p>

          <div style={styles.actionRow}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search resource"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                style={{ ...styles.input, width: 240 }}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...styles.input, width: 200 }}
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
                onClick={() => {
                  fetchBookings(resourceName, statusFilter);
                  fetchResources();
                }}
              >
                Refresh
              </button>
            </div>
          </div>

          {error ? <div style={styles.errorBox}>{error}</div> : null}
          {resourceError ? <div style={styles.errorBox}>{resourceError}</div> : null}

          <div className="table-responsive border rounded-4 overflow-hidden">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th>Resource</th>
                  <th>Booked By</th>
                  <th>Purpose</th>
                  <th style={{ width: 220 }}>Attendees / Capacity</th>
                  <th style={{ width: 200 }}>Start</th>
                  <th style={{ width: 200 }}>End</th>
                  <th style={{ width: 140 }}>Status</th>
                  <th style={{ width: 280 }}>Actions</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted py-5">
                      Loading...
                    </td>
                  </tr>
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-muted py-5">
                      No matching results.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => {
                    const capacity = getCapacity(b.resourceName);
                    const overLimit = exceedsCapacity(b);

                    return (
                      <tr key={b.id}>
                        <td className="fw-semibold">{b.id}</td>
                        <td>{b.resourceName}</td>
                        <td className="text-muted">{b.bookedBy || "-"}</td>
                        <td className="text-muted">{b.purpose}</td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <span>
                              {b.attendees}
                              {capacity != null ? ` / ${capacity}` : " / N/A"}
                            </span>
                            {overLimit ? (
                              <span className="badge bg-danger-subtle text-danger-emphasis border border-danger-subtle align-self-start">
                                Attendees limit exceeded
                              </span>
                            ) : null}
                          </div>
                        </td>
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
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => approveBooking(b.id)}
                              >
                                Approve
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => rejectBooking(b.id)}
                              >
                                Reject
                              </button>

                              {overLimit ? (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() =>
                                    rejectBooking(b.id, "attendees limit exceed")
                                  }
                                >
                                  Reject Limit
                                </button>
                              ) : null}
                            </div>
                          ) : b.status === "APPROVED" ? (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => cancelBooking(b.id)}
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-muted small">No actions</span>
                          )}
                        </td>
                        <td className="text-muted small">{b.rejectionReason}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingAdmin;

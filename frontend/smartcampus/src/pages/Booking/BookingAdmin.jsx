import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";

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
    approved: "#0D9488",
  };

  const statusColor = (status) => {
    if (status === "PENDING") return "#F59E0B";
    if (status === "APPROVED") return "#0D9488";
    if (status === "REJECTED") return "#EF4444";
    if (status === "CANCELLED") return "#6B7280";
    return colors.primaryDark;
  };

  const getStatusStyles = (status) => {
    const base = {
      backgroundColor: "#F3F4F8",
      borderColor: "#E0E6F0",
      color: colors.textMedium,
    };

    if (status === "PENDING") {
      return {
        backgroundColor: "#FFF5D6",
        borderColor: "#F7D58B",
        color: "#F59E0B",
      };
    }

    if (status === "APPROVED") {
      return {
        backgroundColor: "#E7FBF4",
        borderColor: "#8FE3C9",
        color: "#0D9488",
      };
    }

    if (status === "REJECTED") {
      return {
        backgroundColor: "#FFE5E5",
        borderColor: "#F6B6B6",
        color: "#EF4444",
      };
    }

    if (status === "CANCELLED") {
      return {
        backgroundColor: "#EDEEF2",
        borderColor: "#D6D8E0",
        color: "#6B7280",
      };
    }

    return base;
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${colors.bgLight} 0%, ${colors.white} 100%)`,
      padding: "28px 20px 60px",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    hero: {
      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryGradientEnd} 100%)`,
      borderRadius: "22px",
      padding: "26px 28px",
      color: colors.white,
      marginBottom: "22px",
      boxShadow: "0 18px 40px rgba(26, 31, 90, 0.16)",
    },
    heroTitle: {
      margin: 0,
      fontSize: "26px",
      fontWeight: "800",
      lineHeight: "1.2",
    },
    heroText: {
      marginTop: "10px",
      marginBottom: 0,
      color: colors.textLight,
      fontSize: "14px",
      lineHeight: "1.7",
      maxWidth: "640px",
    },
    filterContainer: {
      backgroundColor: colors.white,
      borderRadius: "18px",
      padding: "14px 16px",
      marginBottom: "22px",
      boxShadow: "0 8px 24px rgba(26, 31, 90, 0.08)",
      border: `1px solid ${colors.borderLight}`,
    },
    card: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "18px",
      padding: "20px",
      boxShadow: "0 16px 36px rgba(17, 24, 39, 0.06)",
    },
    sectionTitle: {
      display: "none",
    },
    sectionText: {
      display: "none",
    },
    actionRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      marginTop: "0px",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "12px",
      border: `1px solid ${colors.borderLight}`,
      backgroundColor: "#F7F8FC",
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
    refreshButton: {
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "12px",
      backgroundColor: colors.white,
      width: "40px",
      height: "40px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: colors.textMedium,
      cursor: "pointer",
      transition: "all 0.2s ease",
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
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: "16px",
    },
    bookingCard: (status) => ({
      backgroundColor: colors.white,
      borderRadius: "16px",
      padding: "16px",
      border: `1px solid ${colors.borderLight}`,
      borderLeft: `3px solid ${statusColor(status)}`,
      boxShadow: "0 8px 24px rgba(26, 31, 90, 0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }),
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "10px",
    },
    cardHeaderLeft: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      flex: 1,
    },
    statusPill: (status) => ({
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "10px",
      fontWeight: "800",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      border: `1px solid ${getStatusStyles(status).borderColor}`,
      backgroundColor: getStatusStyles(status).backgroundColor,
      color: getStatusStyles(status).color,
      width: "fit-content",
    }),
    cardTitle: {
      margin: 0,
      fontSize: "14px",
      fontWeight: "700",
      color: colors.textDark,
      lineHeight: "1.4",
    },
    cardSubtitle: {
      margin: 0,
      fontSize: "11px",
      color: colors.textMedium,
      fontWeight: "500",
      lineHeight: "1.6",
    },
    detailList: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      color: colors.textMedium,
      fontSize: "11px",
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      alignItems: "center",
    },
    detailLabel: {
      fontWeight: "600",
      color: colors.textMedium,
    },
    detailValue: {
      fontWeight: "600",
      color: colors.textDark,
      textAlign: "right",
    },
    capacityBadge: {
      alignSelf: "flex-start",
      fontSize: "10px",
      fontWeight: "700",
      padding: "4px 8px",
      borderRadius: "999px",
      backgroundColor: "#FFE5E5",
      border: "1px solid #F6B6B6",
      color: colors.danger,
    },
    cardActions: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      alignItems: "center",
      marginTop: "6px",
    },
    actionButton: {
      borderRadius: "10px",
      padding: "6px 12px",
      fontSize: "12px",
      fontWeight: "700",
      border: `1px solid ${colors.borderLight}`,
      backgroundColor: colors.white,
      cursor: "pointer",
    },
    approveButton: {
      backgroundColor: "#E7FBF4",
      borderColor: "#8FE3C9",
      color: colors.approved,
    },
    rejectButton: {
      backgroundColor: "#FFE5E5",
      borderColor: "#F6B6B6",
      color: colors.danger,
    },
    cancelButton: {
      backgroundColor: "#F7F8FC",
      borderColor: colors.borderLight,
      color: colors.textMedium,
    },
    emptyState: {
      textAlign: "center",
      padding: "32px",
      color: colors.textMedium,
      border: `1px dashed ${colors.borderLight}`,
      borderRadius: "16px",
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

  const formatDateTime = (value) => {
    if (!value) return { date: "-", time: "-" };
    const dateObj = new Date(value);
    if (Number.isNaN(dateObj.getTime())) {
      return { date: value?.substring(0, 10) || "-", time: "-" };
    }
    const date = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
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

        <div style={styles.filterContainer}>
          <h2 style={styles.sectionTitle}>Admin Queue</h2>
          <p style={styles.sectionText}>
            Review bookings, filter by status, and take action quickly.
          </p>

          <div style={styles.actionRow}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Search bookings..."
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                style={{ ...styles.input, width: 240 }}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...styles.input, width: 160 }}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>

              <button
                type="button"
                style={styles.refreshButton}
                onClick={() => {
                  fetchBookings(resourceName, statusFilter);
                  fetchResources();
                }}
                aria-label="Refresh"
                title="Refresh"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M21 12a9 9 0 1 1-2.64-6.36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M21 3v6h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {error ? <div style={styles.errorBox}>{error}</div> : null}
          {resourceError ? <div style={styles.errorBox}>{resourceError}</div> : null}
        </div>

        <div style={styles.card}>
          {loading ? (
            <div style={styles.emptyState}>Loading...</div>
          ) : filteredBookings.length === 0 ? (
            <div style={styles.emptyState}>No matching results.</div>
          ) : (
            <div style={styles.cardsGrid}>
              {filteredBookings.map((b) => {
                const capacity = getCapacity(b.resourceName);
                const overLimit = exceedsCapacity(b);
                const startTime = formatDateTime(b.startTime);
                const endTime = formatDateTime(b.endTime);

                return (
                  <div key={b.id} style={styles.bookingCard(b.status)}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardHeaderLeft}>
                        <span style={styles.statusPill(b.status)}>{b.status}</span>
                        <h3 style={styles.cardTitle}>{b.resourceName}</h3>
                        <p style={styles.cardSubtitle}>{b.purpose || "No Purpose"}</p>
                      </div>
                      <span style={styles.cardSubtitle}>#{b.id}</span>
                    </div>

                    <div style={styles.detailList}>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Booked By</span>
                        <span style={styles.detailValue}>{b.bookedBy || "-"}</span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Attendees</span>
                        <span style={styles.detailValue}>
                          {b.attendees}
                          {capacity != null ? ` / ${capacity}` : " / N/A"}
                        </span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>Start</span>
                        <span style={styles.detailValue}>
                          {startTime.date} · {startTime.time}
                        </span>
                      </div>
                      <div style={styles.detailRow}>
                        <span style={styles.detailLabel}>End</span>
                        <span style={styles.detailValue}>
                          {endTime.date} · {endTime.time}
                        </span>
                      </div>
                      {b.status === "REJECTED" && (
                        <div style={styles.detailRow}>
                          <span style={styles.detailLabel}>Reason</span>
                          <span style={styles.detailValue}>{b.rejectionReason || "-"}</span>
                        </div>
                      )}
                    </div>

                    {overLimit ? (
                      <span style={styles.capacityBadge}>Attendees limit exceeded</span>
                    ) : null}

                    <div style={styles.cardActions}>
                      {b.status === "PENDING" ? (
                        <>
                          <button
                            type="button"
                            style={{ ...styles.actionButton, ...styles.approveButton }}
                            onClick={() => approveBooking(b.id)}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            style={{ ...styles.actionButton, ...styles.rejectButton }}
                            onClick={() => rejectBooking(b.id)}
                          >
                            Reject
                          </button>
                          {overLimit ? (
                            <button
                              type="button"
                              style={{ ...styles.actionButton, ...styles.rejectButton }}
                              onClick={() => rejectBooking(b.id, "attendees limit exceed")}
                            >
                              Reject Limit
                            </button>
                          ) : null}
                        </>
                      ) : b.status === "APPROVED" ? (
                        <button
                          type="button"
                          style={{ ...styles.actionButton, ...styles.cancelButton }}
                          onClick={() => cancelBooking(b.id)}
                        >
                          Cancel
                        </button>
                      ) : (
                        <span style={styles.cardSubtitle}>No actions</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingAdmin;

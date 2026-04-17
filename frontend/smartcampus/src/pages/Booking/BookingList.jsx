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
    pending: "#F59E0B",
    approved: "#0D9488",
    rejected: "#EF4444",
    cancelled: "#6B7280",
  };

  const getCardColor = (status) => {
    switch (status) {
      case "PENDING":
        return colors.pending;
      case "APPROVED":
        return colors.approved;
      case "REJECTED":
        return colors.rejected;
      case "CANCELLED":
        return colors.cancelled;
      default:
        return colors.primaryDark;
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${colors.bgLight} 0%, ${colors.white} 100%)`,
      padding: "32px 20px 60px",
    },
    wrapper: {
      maxWidth: "1400px",
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
    filterContainer: {
      backgroundColor: colors.white,
      borderRadius: "20px",
      padding: "24px",
      marginBottom: "32px",
      boxShadow: "0 8px 24px rgba(26, 31, 90, 0.08)",
      border: `1px solid ${colors.borderLight}`,
    },
    sectionTitle: {
      margin: 0,
      fontSize: "22px",
      fontWeight: "700",
      color: colors.textDark,
      marginBottom: "16px",
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
      marginTop: "0px",
    },
    filterGroup: {
      display: "flex",
      gap: "12px",
      flexWrap: "wrap",
      alignItems: "center",
      flex: 1,
    },
    input: {
      padding: "10px 14px",
      borderRadius: "12px",
      border: `1px solid ${colors.borderLight}`,
      backgroundColor: colors.white,
      fontSize: "13px",
      color: colors.textDark,
      outline: "none",
      boxSizing: "border-box",
      fontWeight: "500",
    },
    primaryButton: {
      border: "none",
      borderRadius: "12px",
      backgroundColor: colors.accentOrange,
      color: colors.white,
      fontSize: "13px",
      fontWeight: "800",
      padding: "10px 18px",
      cursor: "pointer",
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 20px rgba(245, 166, 35, 0.2)",
      transition: "all 0.2s ease",
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
      marginBottom: "24px",
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "18px",
      marginTop: "24px",
    },
    bookingCard: (status) => {
      const getDotColor = () => {
        switch (status) {
          case "PENDING":
            return colors.pending;
          case "APPROVED":
            return colors.approved;
          case "REJECTED":
            return colors.rejected;
          case "CANCELLED":
            return colors.cancelled;
          default:
            return colors.primaryDark;
        }
      };
      
      const getBackgroundColor = () => {
        switch (status) {
          case "PENDING":
            return "#FEF9E7";
          case "APPROVED":
            return "#E8F9F6";
          case "REJECTED":
            return "#FEF2F2";
          case "CANCELLED":
            return "#F3F4F6";
          default:
            return "#F7F9FF";
        }
      };

      return {
        backgroundColor: getBackgroundColor(),
        borderRadius: "16px",
        padding: "18px",
        boxShadow: "0 8px 24px rgba(26, 31, 90, 0.06)",
        border: `1px solid ${colors.borderLight}`,
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      };
    },
    cardIndicator: (status) => {
      const getDotColor = () => {
        switch (status) {
          case "PENDING":
            return colors.pending;
          case "APPROVED":
            return colors.approved;
          case "REJECTED":
            return colors.rejected;
          case "CANCELLED":
            return colors.cancelled;
          default:
            return colors.primaryDark;
        }
      };

      return {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: getDotColor(),
        marginBottom: "10px",
        display: "block",
      };
    },
    cardHeader: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: "12px",
      paddingBottom: "0px",
    },
    cardTitle: {
      margin: 0,
      fontSize: "16px",
      fontWeight: "700",
      color: colors.textDark,
      marginBottom: "6px",
      lineHeight: "1.3",
    },
    cardSubtitle: {
      margin: "0",
      fontSize: "12px",
      color: colors.textMedium,
      fontWeight: "500",
      lineHeight: "1.5",
    },
    cardDetails: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      marginBottom: "12px",
      paddingBottom: "0px",
      borderBottom: "none",
      flex: 1,
    },
    detailRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "12px",
    },
    detailLabel: {
      color: colors.textMedium,
      fontWeight: "600",
      display: "none",
    },
    detailValue: {
      color: colors.textMuted,
      fontWeight: "500",
      fontSize: "12px",
    },
    cardFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: "12px",
      borderTop: `1px solid rgba(26, 31, 90, 0.08)`,
    },
    createdBy: {
      fontSize: "11px",
      color: colors.textMedium,
      fontWeight: "600",
    },
    arrowButton: {
      width: "auto",
      height: "32px",
      borderRadius: "8px",
      backgroundColor: colors.accentOrange,
      border: "none",
      color: colors.white,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "600",
      padding: "0 14px",
      transition: "all 0.2s ease",
    },
    cardActions: {
      display: "none",
    },
    smallBtn: {
      display: "none",
    },
    smallBtnPrimary: {
      display: "none",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: colors.textMedium,
    },
    emptyStateTitle: {
      fontSize: "24px",
      fontWeight: "700",
      color: colors.textDark,
      marginBottom: "12px",
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

        <div style={styles.filterContainer}>
          <h2 style={styles.sectionTitle}>Bookings</h2>
          <p style={styles.sectionText}>View all current bookings.</p>

          <div style={styles.actionRow}>
            <div style={styles.filterGroup}>
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
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <div style={styles.emptyStateTitle}>Loading Bookings...</div>
            <p>Please wait while we fetch your bookings.</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <div style={styles.emptyStateTitle}>No Bookings Found</div>
            <p>
              {bookings.length === 0
                ? "Create your first booking to get started!"
                : "No bookings match your filters. Try adjusting your search."}
            </p>
            <Link to="/create" style={styles.primaryButton}>
              Create Booking
            </Link>
          </div>
        ) : (
          <div style={styles.cardsGrid}>
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                style={{
                  ...styles.bookingCard(b.status),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 40px rgba(26, 31, 90, 0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(26, 31, 90, 0.06)";
                }}
              >
                <div style={styles.cardIndicator(b.status)} />
                
                <div style={styles.cardHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.cardTitle}>{b.resourceName}</h3>
                    <p style={styles.cardSubtitle}>{b.purpose || "No Purpose"}</p>
                  </div>
                </div>

                <div style={styles.cardDetails}>
                  <div style={{ fontSize: "12px", color: colors.textMuted }}>
                    <strong>Attendees:</strong> {b.attendees}
                  </div>
                  <div style={{ fontSize: "12px", color: colors.textMuted }}>
                    <strong>Date:</strong> {b.startTime?.substring(0, 10) || "-"}
                  </div>
                  <div style={{ fontSize: "12px", color: colors.textMuted }}>
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color: getCardColor(b.status),
                        fontWeight: "700",
                      }}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <div>
                    <span style={styles.createdBy}>
                      Booked by: <strong>{b.bookedBy || "-"}</strong>
                    </span>
                  </div>
                  {b.status === "APPROVED" && (
                    <button
                      type="button"
                      style={styles.arrowButton}
                      onClick={() => handleViewQr(b.qrCode)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.accentOrangeHover;
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          colors.accentOrange;
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      📱 View QR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingList;

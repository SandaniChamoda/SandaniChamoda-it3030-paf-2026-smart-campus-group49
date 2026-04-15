import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../services/api";

function TicketDetails() {
  const { id } = useParams();

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
    footerText: "#B6C6F0",
    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    info: "#2563EB",
    muted: "#94A3B8",
  };

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/tickets/${id}`);
      setTicket(response.data);
    } catch (err) {
      console.error("Failed to fetch ticket details:", err);
      setError("Unable to load ticket details right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const getStatusStyles = (status) => {
    switch (status) {
      case "OPEN":
        return { bg: "#EAF2FF", color: colors.info };
      case "IN_PROGRESS":
        return { bg: "#FFF4DD", color: colors.warning };
      case "RESOLVED":
        return { bg: "#EAFBF0", color: colors.success };
      case "CLOSED":
        return { bg: "#ECEFFD", color: colors.primaryDark };
      case "REJECTED":
        return { bg: "#FDECEC", color: colors.danger };
      default:
        return { bg: "#EEF2F7", color: colors.textMedium };
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "HIGH":
        return { bg: "#FDECEC", color: colors.danger };
      case "MEDIUM":
        return { bg: "#FFF4DD", color: colors.warning };
      case "LOW":
        return { bg: "#EAFBF0", color: colors.success };
      default:
        return { bg: "#EEF2F7", color: colors.textMedium };
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleString();
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${colors.bgLight} 0%, #ffffff 100%)`,
      padding: "40px 22px 60px",
    },
    container: {
      maxWidth: "1120px",
      margin: "0 auto",
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "14px",
      flexWrap: "wrap",
      marginBottom: "20px",
    },
    backLink: {
      textDecoration: "none",
      color: colors.primaryDark,
      fontSize: "14px",
      fontWeight: "800",
    },
    refreshButton: {
      backgroundColor: colors.white,
      color: colors.primaryDark,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "14px",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "700",
      cursor: "pointer",
      boxShadow: "0 8px 18px rgba(26, 31, 90, 0.05)",
    },
    heroCard: {
      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryGradientEnd} 100%)`,
      borderRadius: "26px",
      padding: "28px",
      color: colors.white,
      boxShadow: "0 20px 50px rgba(26, 31, 90, 0.18)",
      marginBottom: "24px",
    },
    heroTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "18px",
      flexWrap: "wrap",
    },
    heroLeft: {
      flex: 1,
      minWidth: "250px",
    },
    eyebrow: {
      display: "inline-block",
      padding: "7px 14px",
      borderRadius: "999px",
      backgroundColor: "rgba(255,255,255,0.14)",
      color: colors.white,
      fontSize: "12px",
      fontWeight: "800",
      letterSpacing: "0.7px",
      textTransform: "uppercase",
      marginBottom: "14px",
    },
    title: {
      margin: 0,
      fontSize: "34px",
      lineHeight: "1.2",
      fontWeight: "800",
    },
    subtitle: {
      marginTop: "12px",
      marginBottom: 0,
      color: colors.textLight,
      fontSize: "15px",
      lineHeight: "1.8",
      maxWidth: "760px",
    },
    pillRow: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "18px",
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 13px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "800",
    },
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "1.45fr 0.95fr",
      gap: "20px",
    },
    card: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "0 14px 28px rgba(26, 31, 90, 0.05)",
    },
    sectionTitle: {
      margin: 0,
      fontSize: "22px",
      fontWeight: "800",
      color: colors.textDark,
      marginBottom: "16px",
    },
    descriptionBox: {
      backgroundColor: "#FBFCFF",
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "18px",
      padding: "18px",
      marginBottom: "18px",
    },
    descriptionText: {
      margin: 0,
      fontSize: "15px",
      color: colors.textMedium,
      lineHeight: "1.9",
      whiteSpace: "pre-wrap",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "14px",
    },
    infoBox: {
      backgroundColor: "#FBFCFF",
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "16px",
      padding: "15px",
    },
    infoLabel: {
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.7px",
      fontWeight: "800",
      color: colors.textMedium,
      marginBottom: "8px",
    },
    infoValue: {
      fontSize: "14px",
      fontWeight: "700",
      color: colors.textDark,
      lineHeight: "1.6",
      wordBreak: "break-word",
    },
    sideStack: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    timelineItem: {
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
      paddingBottom: "16px",
      marginBottom: "16px",
      borderBottom: `1px solid ${colors.borderLight}`,
    },
    timelineDot: {
      width: "12px",
      height: "12px",
      borderRadius: "50%",
      backgroundColor: colors.accentOrange,
      marginTop: "6px",
      flexShrink: 0,
    },
    timelineContent: {
      flex: 1,
    },
    timelineTitle: {
      margin: 0,
      fontSize: "14px",
      fontWeight: "800",
      color: colors.textDark,
      marginBottom: "4px",
    },
    timelineText: {
      margin: 0,
      fontSize: "13px",
      color: colors.textMedium,
      lineHeight: "1.7",
    },
    quickActions: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    actionLink: {
      textDecoration: "none",
      backgroundColor: colors.bgStats,
      color: colors.primaryDark,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "14px",
      padding: "14px 16px",
      fontSize: "14px",
      fontWeight: "700",
      display: "block",
    },
    loadingBox: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "20px",
      padding: "26px",
      color: colors.textMedium,
      boxShadow: "0 12px 26px rgba(26, 31, 90, 0.05)",
    },
    errorBox: {
      backgroundColor: "#FEF2F2",
      border: "1px solid #FECACA",
      borderRadius: "16px",
      padding: "16px",
      color: colors.danger,
      marginBottom: "16px",
      fontWeight: "600",
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingBox}>Loading ticket details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>{error}</div>
          <Link to="/tickets/my" style={styles.backLink}>
            ← Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingBox}>Ticket not found.</div>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyles(ticket.status);
  const priorityStyle = getPriorityStyles(ticket.priority);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <Link to="/tickets/my" style={styles.backLink}>
            ← Back to My Tickets
          </Link>

          <button style={styles.refreshButton} onClick={fetchTicketDetails}>
            Refresh Details
          </button>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.heroTop}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>Ticket Details</div>
              <h1 style={styles.title}>{ticket.title}</h1>
              <p style={styles.subtitle}>
                Review the full details of your maintenance request, including
                status, category, assignment, and progress timestamps.
              </p>

              <div style={styles.pillRow}>
                <span
                  style={{
                    ...styles.pill,
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.color,
                  }}
                >
                  {ticket.status?.replace("_", " ")}
                </span>

                <span
                  style={{
                    ...styles.pill,
                    backgroundColor: priorityStyle.bg,
                    color: priorityStyle.color,
                  }}
                >
                  {ticket.priority || "N/A"} Priority
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Issue Description</h2>

            <div style={styles.descriptionBox}>
              <p style={styles.descriptionText}>
                {ticket.description || "No description available."}
              </p>
            </div>

            <div style={styles.infoGrid}>
              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Ticket ID</div>
                <div style={styles.infoValue}>#{ticket.id}</div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Category</div>
                <div style={styles.infoValue}>
                  {ticket.category || "Not specified"}
                </div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Assigned Technician</div>
                <div style={styles.infoValue}>
                  {ticket.assignedTo
                    ? `Technician #${ticket.assignedTo}`
                    : "Not assigned yet"}
                </div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Created By</div>
                <div style={styles.infoValue}>
                  {ticket.createdBy ? `User #${ticket.createdBy}` : "N/A"}
                </div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Created At</div>
                <div style={styles.infoValue}>{formatDate(ticket.createdAt)}</div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Last Updated</div>
                <div style={styles.infoValue}>{formatDate(ticket.updatedAt)}</div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Resolved At</div>
                <div style={styles.infoValue}>
                  {ticket.resolvedAt
                    ? formatDate(ticket.resolvedAt)
                    : "Not resolved yet"}
                </div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Image</div>
                <div style={styles.infoValue}>
                  {ticket.image ? ticket.image : "No image attached"}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.sideStack}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Progress Overview</h2>

              <div style={styles.timelineItem}>
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineContent}>
                  <p style={styles.timelineTitle}>Ticket Created</p>
                  <p style={styles.timelineText}>
                    Your issue was submitted on {formatDate(ticket.createdAt)}.
                  </p>
                </div>
              </div>

              <div style={styles.timelineItem}>
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineContent}>
                  <p style={styles.timelineTitle}>Current Status</p>
                  <p style={styles.timelineText}>
                    This ticket is currently marked as{" "}
                    <strong>{ticket.status?.replace("_", " ") || "N/A"}</strong>.
                  </p>
                </div>
              </div>

              <div
                style={{
                  ...styles.timelineItem,
                  borderBottom: "none",
                  marginBottom: 0,
                  paddingBottom: 0,
                }}
              >
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineContent}>
                  <p style={styles.timelineTitle}>Resolution</p>
                  <p style={styles.timelineText}>
                    {ticket.resolvedAt
                      ? `This issue was resolved on ${formatDate(ticket.resolvedAt)}.`
                      : "This issue has not been resolved yet."}
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Quick Actions</h2>

              <div style={styles.quickActions}>
                <Link to="/tickets/my" style={styles.actionLink}>
                  View all my tickets
                </Link>

                <Link to={`/tickets/comments/${ticket.id}`} style={styles.actionLink}>
                  Open ticket comments
                </Link>

                <Link to="/tickets/create" style={styles.actionLink}>
                  Create another ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetails;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function TechnicianTickets() {
  const { user } = useAuth();

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
    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#DC2626",
    info: "#2563EB",
    muted: "#94A3B8",
  };

  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState({
    totalAssigned: 0,
    openCount: 0,
    inProgressCount: 0,
    resolvedTodayCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  const fetchTechnicianSummary = async () => {
    if (!user?.id) {
      return;
    }

    try {
      const response = await API.get(`/tickets/technician/${user.id}/summary`);
      setSummary({
        totalAssigned: response.data?.totalAssigned || 0,
        openCount: response.data?.openCount || 0,
        inProgressCount: response.data?.inProgressCount || 0,
        resolvedTodayCount: response.data?.resolvedTodayCount || 0,
      });
    } catch (err) {
      console.error("Failed to fetch technician summary:", err);
    }
  };

  const fetchTechnicianTickets = async () => {
    if (!user?.id) {
      setError("Unable to determine technician account.");
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/tickets/technician/${user.id}`, {
        params: {
          status: statusFilter !== "ALL" ? statusFilter : undefined,
          priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
          search: searchTerm.trim() || undefined,
        },
      });
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch technician tickets:", err);
      setError("Unable to load assigned tickets.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTechnicianSummary();
  }, [user?.id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTechnicianTickets();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [user?.id, searchTerm, statusFilter, priorityFilter]);

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
          maxWidth: "1180px",
          margin: "0 auto",
        },
        heroCard: {
          background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryGradientEnd} 100%)`,
          borderRadius: "24px",
          padding: "30px",
          color: colors.white,
          boxShadow: "0 20px 50px rgba(26, 31, 90, 0.18)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        },
        heroTitle: {
          margin: 0,
          fontSize: "34px",
          fontWeight: "800",
          lineHeight: "1.2",
        },
        heroText: {
          marginTop: "12px",
          marginBottom: 0,
          color: colors.textLight,
          fontSize: "15px",
          lineHeight: "1.7",
          maxWidth: "760px",
        },
        heroButtons: {
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "18px",
        },
        secondaryButton: {
          backgroundColor: "rgba(255,255,255,0.12)",
          color: colors.white,
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: "12px",
          padding: "12px 18px",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
        },
        statsGrid: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "18px",
          marginBottom: "24px",
        },
        statCard: {
          backgroundColor: colors.white,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 10px 28px rgba(26, 31, 90, 0.06)",
        },
        statLabel: {
          fontSize: "13px",
          color: colors.textMedium,
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.7px",
          marginBottom: "10px",
        },
        statValue: {
          fontSize: "30px",
          fontWeight: "800",
          color: colors.textDark,
          lineHeight: "1",
        },
        filterCard: {
          backgroundColor: colors.white,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: "20px",
          padding: "22px",
          boxShadow: "0 10px 28px rgba(26, 31, 90, 0.06)",
          marginBottom: "24px",
        },
        sectionTitle: {
          margin: 0,
          fontSize: "22px",
          fontWeight: "800",
          color: colors.textDark,
        },
        sectionSubtext: {
          marginTop: "6px",
          marginBottom: "18px",
          fontSize: "14px",
          color: colors.textMedium,
        },
        filtersGrid: {
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "14px",
        },
        inputWrap: {
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        },
        inputLabel: {
          fontSize: "13px",
          fontWeight: "700",
          color: colors.textDark,
        },
        input: {
          height: "46px",
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight}`,
          backgroundColor: colors.white,
          padding: "0 14px",
          fontSize: "14px",
          color: colors.textDark,
          outline: "none",
        },
        select: {
          height: "46px",
          borderRadius: "12px",
          border: `1px solid ${colors.borderLight}`,
          backgroundColor: colors.white,
          padding: "0 14px",
          fontSize: "14px",
          color: colors.textDark,
          outline: "none",
        },
        resultText: {
          color: colors.textMedium,
          fontSize: "14px",
          marginBottom: "16px",
        },
        tableWrap: {
          backgroundColor: colors.white,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: "20px",
          boxShadow: "0 10px 28px rgba(26, 31, 90, 0.06)",
          overflow: "hidden",
        },
        tableScroller: {
          overflowX: "auto",
        },
        table: {
          width: "100%",
          borderCollapse: "collapse",
          minWidth: "920px",
        },
        th: {
          backgroundColor: "#F9FBFF",
          color: colors.textDark,
          fontSize: "13px",
          fontWeight: "800",
          textAlign: "left",
          padding: "16px",
          borderBottom: `1px solid ${colors.borderLight}`,
          textTransform: "uppercase",
          letterSpacing: "0.6px",
        },
        td: {
          padding: "16px",
          borderBottom: `1px solid ${colors.borderLight}`,
          fontSize: "14px",
          color: colors.textDark,
          verticalAlign: "top",
        },
        statusBadge: {
          display: "inline-block",
          padding: "7px 12px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "800",
          whiteSpace: "nowrap",
        },
        priorityPill: {
          display: "inline-block",
          padding: "7px 12px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "800",
        },
        actionGroup: {
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        },
        actionLink: {
          textDecoration: "none",
          color: colors.primaryDark,
          fontSize: "13px",
          fontWeight: "800",
          backgroundColor: colors.bgStats,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: "10px",
          padding: "9px 12px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        },
        loadingBox: {
          backgroundColor: colors.white,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: "20px",
          padding: "28px",
          color: colors.textMedium,
          boxShadow: "0 10px 28px rgba(26, 31, 90, 0.06)",
        },
        errorBox: {
          backgroundColor: "#FEF2F2",
          border: "1px solid #FECACA",
          color: colors.danger,
          borderRadius: "16px",
          padding: "16px 18px",
          marginBottom: "18px",
          fontWeight: "600",
        },
        emptyBox: {
          backgroundColor: colors.white,
          border: `1px solid ${colors.borderLight}`,
          borderRadius: "20px",
          padding: "36px 24px",
          textAlign: "center",
          boxShadow: "0 10px 28px rgba(26, 31, 90, 0.06)",
        },
      };

      return (
        <div style={styles.page}>
          <div style={styles.container}>
            <div style={styles.heroCard}>
              <div>
                <h1 style={styles.heroTitle}>Assigned Tickets Overview</h1>
                <p style={styles.heroText}>
                  Track your assigned incidents, filter by status and priority, and
                  quickly open details, comments, or status updates.
                </p>

                <div style={styles.heroButtons}>
                  <button
                    style={styles.secondaryButton}
                    onClick={() => {
                      fetchTechnicianSummary();
                      fetchTechnicianTickets();
                    }}
                  >
                    Refresh Tickets
                  </button>
                </div>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Total Assigned Tickets</div>
                <div style={styles.statValue}>{summary.totalAssigned}</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statLabel}>Open Tickets</div>
                <div style={styles.statValue}>{summary.openCount}</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statLabel}>In Progress</div>
                <div style={styles.statValue}>{summary.inProgressCount}</div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statLabel}>Resolved Today</div>
                <div style={styles.statValue}>{summary.resolvedTodayCount}</div>
              </div>
            </div>

            <div style={styles.filterCard}>
              <h2 style={styles.sectionTitle}>Filters</h2>
              <p style={styles.sectionSubtext}>
                Search by keyword and filter assigned tickets by status and priority.
              </p>

              <div style={styles.filtersGrid}>
                <div style={styles.inputWrap}>
                  <label style={styles.inputLabel}>Search Keyword</label>
                  <input
                    type="text"
                    placeholder="Search by id, title, or description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputWrap}>
                  <label style={styles.inputLabel}>Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={styles.select}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div style={styles.inputWrap}>
                  <label style={styles.inputLabel}>Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    style={styles.select}
                  >
                    <option value="ALL">All Priorities</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.resultText}>
              Showing <strong>{tickets.length}</strong> ticket
              {tickets.length !== 1 ? "s" : ""}
            </div>

            {loading ? (
              <div style={styles.loadingBox}>Loading technician tickets...</div>
            ) : tickets.length === 0 ? (
              <div style={styles.emptyBox}>No assigned tickets found.</div>
            ) : (
              <div style={styles.tableWrap}>
                <div style={styles.tableScroller}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Ticket ID</th>
                        <th style={styles.th}>Resource / Location</th>
                        <th style={styles.th}>Priority</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Created Date</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {tickets.map((ticket) => {
                        const statusStyle = getStatusStyles(ticket.status);
                        const priorityStyle = getPriorityStyles(ticket.priority);

                        return (
                          <tr key={ticket.id}>
                            <td style={styles.td}>#{ticket.id}</td>
                            <td style={styles.td}>
                              <div style={{ fontWeight: "800", marginBottom: "4px" }}>
                                {ticket.title || "N/A"}
                              </div>
                              <div style={{ color: colors.textMedium, fontSize: "13px" }}>
                                {ticket.category || "General"}
                              </div>
                            </td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.priorityPill,
                                  backgroundColor: priorityStyle.bg,
                                  color: priorityStyle.color,
                                }}
                              >
                                {ticket.priority || "N/A"}
                              </span>
                            </td>
                            <td style={styles.td}>
                              <span
                                style={{
                                  ...styles.statusBadge,
                                  backgroundColor: statusStyle.bg,
                                  color: statusStyle.color,
                                }}
                              >
                                {ticket.status?.replace("_", " ") || "N/A"}
                              </span>
                            </td>
                            <td style={styles.td}>{formatDate(ticket.createdAt)}</td>
                            <td style={styles.td}>
                              <div style={styles.actionGroup}>
                                <Link
                                  to={`/tickets/details/${ticket.id}`}
                                  style={styles.actionLink}
                                >
                                  Details
                                </Link>

                                <Link
                                  to={`/tickets/update-status/${ticket.id}`}
                                  style={styles.actionLink}
                                >
                                  Status
                                </Link>

                                <Link
                                  to={`/tickets/comments/${ticket.id}`}
                                  style={styles.actionLink}
                                >
                                  Comments
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    export default TechnicianTickets;
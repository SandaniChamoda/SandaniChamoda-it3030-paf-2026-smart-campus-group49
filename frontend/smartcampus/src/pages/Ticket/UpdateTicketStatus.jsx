import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { getTechnicianLabel } from "../../utils/technicianLabels";
import { useAuth } from "../../context/AuthContext";

function UpdateTicketStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  };

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [notesError, setNotesError] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const getAllowedTransitions = (currentStatus, role) => {
    const isAdmin = role === "ADMIN";
    switch (currentStatus) {
      case "OPEN":
        return isAdmin ? ["IN_PROGRESS", "REJECTED"] : ["IN_PROGRESS"];
      case "IN_PROGRESS":
        return isAdmin ? ["RESOLVED", "REJECTED"] : ["RESOLVED"];
      case "RESOLVED":
        return ["CLOSED"];
      default:
        return [];
    }
  };

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await API.get(`/tickets/${id}`);
      setTicket(response.data);
      setStatus(response.data?.status || "");
      setResolutionNotes(response.data?.resolutionNotes || "");
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
      setPageError("Unable to load selected ticket details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const validateStatus = (value) => {
    if (!value.trim()) {
      return "Status is required.";
    }

    const allowed = getAllowedTransitions(ticket?.status, user?.role);
    if (!allowed.includes(value) && value !== ticket?.status) {
      return "Please select a valid status.";
    }

    return "";
  };

  const validateResolutionNotes = (value, selectedStatus) => {
    if (value.length > 1000) {
      return "Resolution notes must be 1000 characters or less.";
    }

    if (
      (selectedStatus === "RESOLVED" || selectedStatus === "CLOSED") &&
      !value.trim()
    ) {
      return "Resolution notes are required when resolving or closing a ticket.";
    }

    return "";
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    setFieldError(validateStatus(value));
    setNotesError(validateResolutionNotes(resolutionNotes, value));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    scrollToTop();

    const validationMessage = validateStatus(status);
    setFieldError(validationMessage);

    const noteValidationMessage = validateResolutionNotes(resolutionNotes, status);
    setNotesError(noteValidationMessage);

    if (validationMessage || noteValidationMessage) return;

    if (!window.confirm(`Confirm status update to ${status.replace("_", " ")}?`)) {
      return;
    }

    try {
      setSubmitting(true);
      setPageError("");
      setSuccessMessage("");

      await API.put(`/tickets/${id}/status`, {
        status,
        resolutionNotes: resolutionNotes.trim(),
      });

      setSuccessMessage("Ticket status updated successfully.");
      scrollToTop();
      fetchTicket();

      setTimeout(() => {
        navigate(user?.role === "ADMIN" ? "/tickets/admin" : "/tickets/technician");
      }, 1200);
    } catch (err) {
      console.error("Failed to update status:", err);
      console.error("Server response:", err.response?.data);
      setPageError(
        err.response?.data?.message || "Failed to update ticket status."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: `linear-gradient(180deg, ${colors.bgLight} 0%, #ffffff 100%)`,
      padding: "40px 22px 60px",
    },
    container: {
      maxWidth: "980px",
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
    heroCard: {
      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryGradientEnd} 100%)`,
      borderRadius: "26px",
      padding: "28px",
      color: colors.white,
      boxShadow: "0 20px 50px rgba(26, 31, 90, 0.18)",
      marginBottom: "24px",
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
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
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
    ticketTitle: {
      margin: 0,
      fontSize: "24px",
      fontWeight: "800",
      color: colors.textDark,
      marginBottom: "10px",
      lineHeight: "1.35",
    },
    ticketDescription: {
      margin: 0,
      fontSize: "14px",
      color: colors.textMedium,
      lineHeight: "1.8",
      marginBottom: "18px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
    },
    infoBox: {
      backgroundColor: "#FBFCFF",
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "16px",
      padding: "14px",
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
    formGroup: {
      marginBottom: "18px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "800",
      color: colors.textDark,
      marginBottom: "8px",
    },
    select: {
      width: "100%",
      height: "48px",
      borderRadius: "14px",
      border: `1px solid ${fieldError ? colors.danger : colors.borderLight}`,
      backgroundColor: colors.white,
      padding: "0 14px",
      fontSize: "14px",
      color: colors.textDark,
      outline: "none",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      minHeight: "110px",
      borderRadius: "14px",
      border: `1px solid ${notesError ? colors.danger : colors.borderLight}`,
      backgroundColor: colors.white,
      padding: "12px 14px",
      fontSize: "14px",
      color: colors.textDark,
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: "1.7",
      marginTop: "10px",
    },
    helperText: {
      marginTop: "8px",
      fontSize: "13px",
      color: colors.textMedium,
      lineHeight: "1.7",
    },
    fieldErrorText: {
      marginTop: "8px",
      fontSize: "13px",
      color: colors.danger,
      fontWeight: "600",
    },
    primaryButton: {
      width: "100%",
      backgroundColor: colors.accentOrange,
      color: colors.white,
      border: "none",
      borderRadius: "14px",
      padding: "13px 18px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: submitting ? "not-allowed" : "pointer",
      opacity: submitting ? 0.75 : 1,
    },
    sideNote: {
      backgroundColor: colors.bgStats,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "16px",
      padding: "14px",
      fontSize: "14px",
      color: colors.textMedium,
      lineHeight: "1.7",
      marginTop: "16px",
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
    successBox: {
      backgroundColor: "#ECFDF3",
      border: "1px solid #BBF7D0",
      borderRadius: "16px",
      padding: "16px",
      color: colors.success,
      marginBottom: "16px",
      fontWeight: "700",
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingBox}>Loading selected ticket...</div>
        </div>
      </div>
    );
  }

  if (pageError && !ticket) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.errorBox}>{pageError}</div>
          <Link to={user?.role === "ADMIN" ? "/tickets/admin" : "/tickets/technician"} style={styles.backLink}>
            ← Back to Tickets
          </Link>
        </div>
      </div>
    );
  }

  const allowedTransitions = getAllowedTransitions(ticket?.status, user?.role);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <Link
            to={user?.role === "ADMIN" ? "/tickets/admin" : "/tickets/technician"}
            style={styles.backLink}
          >
            ← Back to Tickets
          </Link>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.eyebrow}>Ticket Status Update</div>
          <h1 style={styles.title}>Update the workflow status</h1>
          <p style={styles.subtitle}>
            Change the current state of this ticket so the workflow accurately
            reflects progress, resolution, or closure.
          </p>
        </div>

        {pageError && <div style={styles.errorBox}>{pageError}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        <div style={styles.contentGrid}>
          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Selected Ticket</h2>

            <h3 style={styles.ticketTitle}>{ticket?.title}</h3>
            <p style={styles.ticketDescription}>
              {ticket?.description || "No description available."}
            </p>

            <div style={styles.infoGrid}>
              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Ticket ID</div>
                <div style={styles.infoValue}>#{ticket?.id}</div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Category</div>
                <div style={styles.infoValue}>
                  {ticket?.category || "Not specified"}
                </div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Priority</div>
                <div style={styles.infoValue}>{ticket?.priority || "N/A"}</div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Current Status</div>
                <div style={styles.infoValue}>{ticket?.status || "N/A"}</div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Assigned Technician</div>
                <div style={styles.infoValue}>
                  {ticket?.assignedTo
                    ? getTechnicianLabel(ticket.assignedTo)
                    : "Not assigned"}
                </div>
              </div>

              <div style={styles.infoBox}>
                <div style={styles.infoLabel}>Created By</div>
                <div style={styles.infoValue}>
                  {ticket?.createdBy ? `User #${ticket.createdBy}` : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionTitle}>Choose New Status</h2>

            <form onSubmit={handleUpdateStatus}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Ticket Status</label>

                <select
                  value={status}
                  onChange={handleStatusChange}
                  style={styles.select}
                >
                  <option value={ticket?.status || ""}>
                    {ticket?.status || "Select status"}
                  </option>
                  {allowedTransitions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                {fieldError ? (
                  <div style={styles.fieldErrorText}>{fieldError}</div>
                ) : (
                  <div style={styles.helperText}>
                    Select the correct workflow status. This will directly update
                    the ticket in the backend and reflect in admin and user pages.
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Resolution Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => {
                    setResolutionNotes(e.target.value);
                    setNotesError(validateResolutionNotes(e.target.value, status));
                  }}
                  placeholder="Explain what was fixed and root cause"
                  style={styles.textarea}
                />
                {notesError && <div style={styles.fieldErrorText}>{notesError}</div>}
                {!notesError && (
                  <div style={styles.helperText}>
                    Add clear fix details for auditability and grading.
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={styles.primaryButton}
                disabled={submitting || allowedTransitions.length === 0}
              >
                {submitting
                  ? "Updating..."
                  : allowedTransitions.length === 0
                  ? "No Further Transition"
                  : "Update Status"}
              </button>
            </form>

            <div style={styles.sideNote}>
              If your backend sets `resolvedAt` automatically when status becomes
              `RESOLVED`, you will see that reflected later in ticket details and
              admin listings.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateTicketStatus;
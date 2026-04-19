import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../services/api";

function TicketComments() {
  const { id } = useParams();

  const DEMO_USER_ID = 1;

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

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setPageError("");

      const response = await API.get(`/tickets/${id}/comments`);
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setPageError("Unable to load comments for this ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const validateComment = (value) => {
    if (!value.trim()) {
      return "Comment cannot be empty.";
    }

    if (value.trim().length < 3) {
      return "Comment must be at least 3 characters.";
    }

    if (value.length > 500) {
      return "Comment must be 500 characters or less.";
    }

    return "";
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment(value);
    setFieldError(validateComment(value));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    scrollToTop();

    const validationMessage = validateComment(newComment);
    setFieldError(validationMessage);

    if (validationMessage) return;

    try {
      setSubmitting(true);
      setPageError("");
      setSuccessMessage("");

      await API.post(`/tickets/${id}/comments`, {
        comment: newComment.trim(),
        commentedBy: DEMO_USER_ID,
      });

      setSuccessMessage("Comment added successfully.");
      scrollToTop();
      setNewComment("");
      setFieldError("");
      setShowForm(false);
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
      console.error("Server response:", err.response?.data);

      setPageError(
        err.response?.data?.message || "Failed to add comment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setSuccessMessage("");
    setShowForm(true);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "No date";
    return new Date(dateValue).toLocaleString();
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
    card: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "24px",
      padding: "24px",
      boxShadow: "0 14px 28px rgba(26, 31, 90, 0.05)",
      marginBottom: "20px",
    },
    sectionTitle: {
      margin: 0,
      fontSize: "22px",
      fontWeight: "800",
      color: colors.textDark,
      marginBottom: "16px",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "13px",
      fontWeight: "800",
      color: colors.textDark,
      marginBottom: "8px",
    },
    textarea: {
      width: "100%",
      minHeight: "120px",
      borderRadius: "16px",
      border: `1px solid ${fieldError ? colors.danger : colors.borderLight}`,
      backgroundColor: colors.white,
      padding: "14px 16px",
      fontSize: "14px",
      color: colors.textDark,
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: "1.7",
    },
    helperRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      marginTop: "8px",
      flexWrap: "wrap",
    },
    helperText: {
      fontSize: "13px",
      color: colors.textMedium,
      lineHeight: "1.7",
    },
    fieldErrorText: {
      fontSize: "13px",
      color: colors.danger,
      fontWeight: "600",
    },
    charCount: {
      fontSize: "12px",
      color: colors.textMedium,
      fontWeight: "600",
    },
    primaryButton: {
      backgroundColor: colors.accentOrange,
      color: colors.white,
      border: "none",
      borderRadius: "14px",
      padding: "12px 18px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: submitting ? "not-allowed" : "pointer",
      opacity: submitting ? 0.75 : 1,
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
    emptyBox: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "20px",
      padding: "34px 24px",
      textAlign: "center",
      boxShadow: "0 12px 26px rgba(26, 31, 90, 0.05)",
    },
    emptyTitle: {
      fontSize: "22px",
      fontWeight: "800",
      color: colors.textDark,
      marginBottom: "10px",
    },
    emptyText: {
      fontSize: "14px",
      color: colors.textMedium,
      lineHeight: "1.8",
      margin: 0,
    },
    actionPanel: {
      backgroundColor: "#F8FAFF",
      border: `1px dashed ${colors.borderLight}`,
      borderRadius: "18px",
      padding: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "18px",
    },
    actionText: {
      fontSize: "14px",
      color: colors.textMedium,
      fontWeight: "600",
      margin: 0,
    },
    actionRow: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    },
    secondaryButton: {
      backgroundColor: colors.white,
      color: colors.primaryDark,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "12px",
      padding: "12px 18px",
      fontSize: "14px",
      fontWeight: "800",
      cursor: "pointer",
      textDecoration: "none",
    },
    summaryRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "16px",
      flexWrap: "wrap",
    },
    summaryText: {
      fontSize: "14px",
      color: colors.textMedium,
      fontWeight: "700",
      margin: 0,
    },
    countBadge: {
      backgroundColor: colors.bgStats,
      color: colors.primaryDark,
      borderRadius: "999px",
      padding: "6px 12px",
      fontSize: "12px",
      fontWeight: "800",
    },
    commentsList: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    commentCard: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "20px",
      padding: "20px",
      boxShadow: "0 10px 24px rgba(26, 31, 90, 0.05)",
      display: "grid",
      gridTemplateColumns: "48px 1fr",
      gap: "14px",
    },
    commentAvatar: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "#EEF2FF",
      color: colors.primaryDark,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "800",
      fontSize: "14px",
    },
    commentBody: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    commentTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "12px",
      flexWrap: "wrap",
    },
    commentMeta: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    commentUser: {
      fontSize: "14px",
      fontWeight: "800",
      color: colors.primaryDark,
    },
    commentTag: {
      fontSize: "11px",
      color: colors.textMedium,
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.6px",
    },
    commentTime: {
      fontSize: "12px",
      color: colors.textMedium,
      fontWeight: "600",
    },
    commentText: {
      fontSize: "15px",
      color: colors.textDark,
      lineHeight: "1.8",
      margin: 0,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <Link to={`/tickets/details/${id}`} style={styles.backLink}>
            ← Back to Ticket Details
          </Link>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.eyebrow}>Ticket Discussion</div>
          <h1 style={styles.title}>Comments and updates</h1>
          <p style={styles.subtitle}>
            Use this space to add follow-up notes, updates, and communication
            related to the selected maintenance ticket.
          </p>
        </div>

        {pageError && <div style={styles.errorBox}>{pageError}</div>}
        {successMessage && showForm && (
          <div style={styles.successBox}>{successMessage}</div>
        )}

        {!showForm && successMessage && (
          <div style={styles.actionPanel}>
            <p style={styles.actionText}>{successMessage}</p>
            <div style={styles.actionRow}>
              <button type="button" style={styles.primaryButton} onClick={handleAddAnother}>
                Add another comment
              </button>
              <Link to={`/tickets/details/${id}`} style={styles.secondaryButton}>
                Back to ticket
              </Link>
            </div>
          </div>
        )}

        {showForm && (
          <div style={styles.card}>
            <div style={styles.summaryRow}>
              <h2 style={styles.sectionTitle}>Add New Comment</h2>
              <span style={styles.countBadge}>{comments.length} total</span>
            </div>

            <form onSubmit={handleAddComment}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Comment</label>

                <textarea
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Write your update or message here..."
                  style={styles.textarea}
                />

                <div style={styles.helperRow}>
                  <div>
                    {fieldError ? (
                      <div style={styles.fieldErrorText}>{fieldError}</div>
                    ) : (
                      <div style={styles.helperText}>
                        Keep your comment clear and relevant to this ticket.
                      </div>
                    )}
                  </div>

                  <div style={styles.charCount}>{newComment.length}/500</div>
                </div>
              </div>

              <button type="submit" style={styles.primaryButton} disabled={submitting}>
                {submitting ? "Adding..." : "Add Comment"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={styles.loadingBox}>Loading comments...</div>
        ) : comments.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyTitle}>No comments yet</div>
            <p style={styles.emptyText}>
              Start the conversation by adding the first comment for this ticket.
            </p>
          </div>
        ) : (
          <div style={styles.commentsList}>
            {comments.map((commentItem) => {
              const avatarLabel = `U${commentItem.commentedBy || "?"}`;
              return (
                <div key={commentItem.id} style={styles.commentCard}>
                  <div style={styles.commentAvatar}>{avatarLabel}</div>
                  <div style={styles.commentBody}>
                    <div style={styles.commentTop}>
                      <div style={styles.commentMeta}>
                        <div style={styles.commentUser}>
                          User #{commentItem.commentedBy}
                        </div>
                        <div style={styles.commentTag}>Ticket update</div>
                      </div>
                      <div style={styles.commentTime}>
                        {formatDate(commentItem.createdAt)}
                      </div>
                    </div>

                    <p style={styles.commentText}>
                      {commentItem.comment || "No comment text."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketComments;
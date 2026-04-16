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

  const handleAddComment = async (e) => {
    e.preventDefault();

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
      setNewComment("");
      setFieldError("");
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
    },
    commentTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "12px",
    },
    commentUser: {
      fontSize: "14px",
      fontWeight: "800",
      color: colors.primaryDark,
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
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Add New Comment</h2>

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
            {comments.map((commentItem) => (
              <div key={commentItem.id} style={styles.commentCard}>
                <div style={styles.commentTop}>
                  <div style={styles.commentUser}>
                    User #{commentItem.commentedBy}
                  </div>
                  <div style={styles.commentTime}>
                    {formatDate(commentItem.createdAt)}
                  </div>
                </div>

                <p style={styles.commentText}>
                  {commentItem.comment || "No comment text."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketComments;
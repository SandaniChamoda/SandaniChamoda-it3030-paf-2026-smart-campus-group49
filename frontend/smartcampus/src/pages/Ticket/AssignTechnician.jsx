import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

function AssignTechnician() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const [ticket, setTicket] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");

  // TEMP DEMO DATA
  // Later replace this with Krishanth's real auth/profile API response
  const technicians = [
    {
      id: 5,
      fullName: "Nethmi Perera",
      email: "nethmi@campus.lk",
      specialty: "ELECTRICAL",
      availability: "AVAILABLE",
      role: "Technician",
      avatar: "NP",
    },
    {
      id: 6,
      fullName: "Kasun Silva",
      email: "kasun@campus.lk",
      specialty: "NETWORK",
      availability: "BUSY",
      role: "Technician",
      avatar: "KS",
    },
    {
      id: 7,
      fullName: "Dinuka Fernando",
      email: "dinuka@campus.lk",
      specialty: "EQUIPMENT",
      availability: "AVAILABLE",
      role: "Technician",
      avatar: "DF",
    },
    {
      id: 8,
      fullName: "Ayesh Maduranga",
      email: "ayesh@campus.lk",
      specialty: "FURNITURE",
      availability: "AVAILABLE",
      role: "Technician",
      avatar: "AM",
    },
    {
      id: 9,
      fullName: "Sanduni Jayasekara",
      email: "sanduni@campus.lk",
      specialty: "CLEANING",
      availability: "OFFLINE",
      role: "Technician",
      avatar: "SJ",
    },
    {
      id: 10,
      fullName: "Ravindu Peris",
      email: "ravindu@campus.lk",
      specialty: "OTHER",
      availability: "AVAILABLE",
      role: "Technician",
      avatar: "RP",
    },
  ];

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setPageError("");

      const res = await API.get(`/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
      setPageError("Unable to load selected ticket.");
    } finally {
      setLoading(false);
    }
  };

  const uniqueSpecialties = ["ALL", ...new Set(technicians.map((t) => t.specialty))];

  const filteredTechnicians = useMemo(() => {
    let result = [...technicians];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((tech) =>
        tech.fullName.toLowerCase().includes(q) ||
        tech.email.toLowerCase().includes(q) ||
        tech.specialty.toLowerCase().includes(q)
      );
    }

    if (specialtyFilter !== "ALL") {
      result = result.filter((tech) => tech.specialty === specialtyFilter);
    }

    if (availabilityFilter !== "ALL") {
      result = result.filter((tech) => tech.availability === availabilityFilter);
    }

    // Smart ordering:
    // 1. matching specialty first
    // 2. available before busy/offline
    result.sort((a, b) => {
      const aCategoryMatch = ticket?.category && a.specialty === ticket.category ? 1 : 0;
      const bCategoryMatch = ticket?.category && b.specialty === ticket.category ? 1 : 0;

      if (aCategoryMatch !== bCategoryMatch) {
        return bCategoryMatch - aCategoryMatch;
      }

      const availabilityRank = {
        AVAILABLE: 3,
        BUSY: 2,
        OFFLINE: 1,
      };

      return availabilityRank[b.availability] - availabilityRank[a.availability];
    });

    return result;
  }, [technicians, searchTerm, specialtyFilter, availabilityFilter, ticket]);

  const handleAssign = async () => {
    if (!selectedTech) {
      setPageError("Please select a technician first.");
      return;
    }

    try {
      setSubmitting(true);
      setPageError("");
      setSuccessMessage("");

      await API.put(`/tickets/${id}/assign`, {
        assignedTo: selectedTech.id,
      });

      setSuccessMessage(`Technician ${selectedTech.fullName} assigned successfully.`);

      setTimeout(() => {
        navigate("/tickets/admin");
      }, 1200);
    } catch (err) {
      console.error("Assignment failed:", err);
      console.error("Server response:", err.response?.data);
      setPageError(err.response?.data?.message || "Assignment failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatSpecialty = (value) => {
    if (!value) return "N/A";
    return value.charAt(0) + value.slice(1).toLowerCase();
  };

  const getAvailabilityStyles = (status) => {
    switch (status) {
      case "AVAILABLE":
        return { bg: "#EAFBF0", color: colors.success };
      case "BUSY":
        return { bg: "#FFF4DD", color: colors.warning };
      case "OFFLINE":
        return { bg: "#EEF2F7", color: colors.textMedium };
      default:
        return { bg: "#EEF2F7", color: colors.textMedium };
    }
  };

  const styles = {
    page: {
      background: colors.bgLight,
      minHeight: "100vh",
      padding: "40px 22px 60px",
    },
    container: {
      maxWidth: "1180px",
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
      fontWeight: "800",
      fontSize: "14px",
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
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "22px",
      alignItems: "start",
    },
    card: {
      background: colors.white,
      borderRadius: "22px",
      padding: "24px",
      border: `1px solid ${colors.borderLight}`,
      boxShadow: "0 16px 36px rgba(17, 24, 39, 0.05)",
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
      fontSize: "22px",
      fontWeight: "800",
      color: colors.textDark,
      lineHeight: "1.35",
      marginBottom: "10px",
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
      marginTop: "18px",
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
    },
    searchGrid: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr",
      gap: "12px",
      marginBottom: "18px",
    },
    fieldWrap: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    fieldLabel: {
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
      boxSizing: "border-box",
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
      boxSizing: "border-box",
    },
    resultText: {
      fontSize: "13px",
      color: colors.textMedium,
      marginBottom: "14px",
    },
    techList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    techCard: (active, recommended) => ({
      border: active
        ? `2px solid ${colors.accentOrange}`
        : recommended
        ? `1px solid ${colors.accentOrange}`
        : `1px solid ${colors.borderLight}`,
      borderRadius: "16px",
      padding: "16px",
      background: active ? "#FFF8ED" : colors.white,
      cursor: "pointer",
      transition: "0.2s ease",
      boxShadow: active
        ? "0 10px 24px rgba(245, 166, 35, 0.12)"
        : "0 8px 16px rgba(17, 24, 39, 0.03)",
    }),
    techTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "12px",
      marginBottom: "12px",
    },
    techLeft: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },
    avatar: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      background: colors.primaryDark,
      color: colors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "800",
      fontSize: "16px",
      flexShrink: 0,
    },
    techName: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "800",
      color: colors.textDark,
      lineHeight: "1.3",
    },
    techRole: {
      margin: "4px 0 0 0",
      fontSize: "13px",
      color: colors.textMedium,
      fontWeight: "600",
    },
    badgeRow: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
      marginTop: "8px",
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 10px",
      borderRadius: "999px",
      fontSize: "11px",
      fontWeight: "800",
    },
    emailText: {
      fontSize: "13px",
      color: colors.textMedium,
      margin: 0,
    },
    selectedPanel: {
      marginTop: "18px",
      backgroundColor: colors.bgStats,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "16px",
      padding: "16px",
    },
    selectedTitle: {
      margin: 0,
      fontSize: "15px",
      fontWeight: "800",
      color: colors.textDark,
      marginBottom: "10px",
    },
    selectedText: {
      margin: 0,
      fontSize: "14px",
      color: colors.textMedium,
      lineHeight: "1.8",
    },
    actionButton: {
      width: "100%",
      marginTop: "16px",
      background: colors.accentOrange,
      border: "none",
      color: colors.white,
      padding: "14px",
      borderRadius: "14px",
      cursor: submitting ? "not-allowed" : "pointer",
      fontWeight: "800",
      fontSize: "15px",
      boxShadow: "0 12px 24px rgba(245, 166, 35, 0.20)",
      opacity: submitting ? 0.7 : 1,
    },
    errorBox: {
      backgroundColor: "#FEF2F2",
      border: "1px solid #FECACA",
      color: colors.danger,
      borderRadius: "14px",
      padding: "14px",
      marginBottom: "16px",
      fontWeight: "600",
    },
    successBox: {
      backgroundColor: "#ECFDF3",
      border: "1px solid #BBF7D0",
      color: colors.success,
      borderRadius: "14px",
      padding: "14px",
      marginBottom: "16px",
      fontWeight: "700",
    },
    emptyBox: {
      backgroundColor: "#FBFCFF",
      border: `1px dashed ${colors.borderLight}`,
      borderRadius: "16px",
      padding: "20px",
      textAlign: "center",
      color: colors.textMedium,
      fontSize: "14px",
      lineHeight: "1.7",
    },
    loadingBox: {
      backgroundColor: colors.white,
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "20px",
      padding: "26px",
      color: colors.textMedium,
      boxShadow: "0 12px 26px rgba(26, 31, 90, 0.05)",
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
          <Link to="/tickets/admin" style={styles.backLink}>
            ← Back to Admin Tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <Link to="/tickets/admin" style={styles.backLink}>
            ← Back to Admin Tickets
          </Link>
        </div>

        <div style={styles.heroCard}>
          <div style={styles.eyebrow}>Ticket Assignment</div>
          <h1 style={styles.title}>Assign the right technician for this issue</h1>
          <p style={styles.subtitle}>
            Search, filter, and review technicians before assigning the most
            suitable person to handle this maintenance ticket.
          </p>
        </div>

        {pageError && <div style={styles.errorBox}>{pageError}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        <div style={styles.grid}>
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
                <div style={styles.infoLabel}>Current Technician</div>
                <div style={styles.infoValue}>
                  {ticket?.assignedTo
                    ? `Technician #${ticket.assignedTo}`
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
            <h2 style={styles.sectionTitle}>Select Technician</h2>

            <div style={styles.searchGrid}>
              <div style={styles.fieldWrap}>
                <label style={styles.fieldLabel}>Search technician</label>
                <input
                  type="text"
                  placeholder="Search by name, email, or specialty"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldWrap}>
                <label style={styles.fieldLabel}>Specialty</label>
                <select
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  style={styles.select}
                >
                  {uniqueSpecialties.map((item) => (
                    <option key={item} value={item}>
                      {item === "ALL" ? "All Specialties" : formatSpecialty(item)}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldWrap}>
                <label style={styles.fieldLabel}>Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  style={styles.select}
                >
                  <option value="ALL">All Availability</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>
            </div>

            <div style={styles.resultText}>
              Showing <strong>{filteredTechnicians.length}</strong> technician
              {filteredTechnicians.length !== 1 ? "s" : ""}. Matching
              specialty technicians appear first.
            </div>

            {filteredTechnicians.length === 0 ? (
              <div style={styles.emptyBox}>
                No technicians match the selected filters. Try changing your
                search or filter options.
              </div>
            ) : (
              <div style={styles.techList}>
                {filteredTechnicians.map((tech) => {
                  const isSelected = selectedTech?.id === tech.id;
                  const isRecommended = ticket?.category === tech.specialty;
                  const availabilityStyle = getAvailabilityStyles(tech.availability);

                  return (
                    <div
                      key={tech.id}
                      style={styles.techCard(isSelected, isRecommended)}
                      onClick={() => setSelectedTech(tech)}
                    >
                      <div style={styles.techTop}>
                        <div style={styles.techLeft}>
                          <div style={styles.avatar}>{tech.avatar}</div>

                          <div>
                            <h3 style={styles.techName}>{tech.fullName}</h3>
                            <p style={styles.techRole}>{tech.role}</p>
                            <div style={styles.badgeRow}>
                              <span
                                style={{
                                  ...styles.badge,
                                  backgroundColor: colors.bgStats,
                                  color: colors.primaryDark,
                                }}
                              >
                                {formatSpecialty(tech.specialty)}
                              </span>

                              <span
                                style={{
                                  ...styles.badge,
                                  backgroundColor: availabilityStyle.bg,
                                  color: availabilityStyle.color,
                                }}
                              >
                                {formatSpecialty(tech.availability)}
                              </span>

                              {isRecommended && (
                                <span
                                  style={{
                                    ...styles.badge,
                                    backgroundColor: "#FFF4DD",
                                    color: colors.warning,
                                  }}
                                >
                                  Recommended Match
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p style={styles.emailText}>{tech.email}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={styles.selectedPanel}>
              <h3 style={styles.selectedTitle}>Selected Technician</h3>
              <p style={styles.selectedText}>
                {selectedTech
                  ? `${selectedTech.fullName} • ${formatSpecialty(
                      selectedTech.specialty
                    )} • ${selectedTech.email}`
                  : "No technician selected yet. Choose a technician card before assigning."}
              </p>
            </div>

            <button style={styles.actionButton} onClick={handleAssign} disabled={submitting}>
              {submitting ? "Assigning..." : "Assign Technician"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignTechnician;  
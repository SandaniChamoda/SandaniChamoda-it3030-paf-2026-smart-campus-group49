import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import notificationService from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import StudentSidebar from "../../components/Dashboard/StudentSidebar";
import "../Admin/AdminDashboard.css";

function StudentDashboard() {
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [resources, setResources] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bookingError, setBookingError] = useState("");
  const [dashboardWarning, setDashboardWarning] = useState("");
  const [loading, setLoading] = useState(true);

  const links = [
    {
      to: "/bookings",
      title: "My Bookings",
      desc: "Review upcoming and past reservation requests.",
    },
    {
      to: "/create",
      title: "Create Booking",
      desc: "Reserve campus spaces and shared facilities quickly.",
    },
    {
      to: "/bookings/calendar",
      title: "Booking Calendar",
      desc: "Preview schedules and availability for key resources.",
    },
    {
      to: "/tickets/my",
      title: "My Tickets",
      desc: "Track incident reports and support requests.",
    },
    {
      to: "/notifications",
      title: "Notifications",
      desc: "Stay updated with booking and ticket activity.",
    },
    {
      to: "/account/settings",
      title: "Account Settings",
      desc: "Manage your profile and notification preferences.",
    },
  ];

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      if (!user?.id) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
      }

      const [
        bookingsResult,
        ticketsResult,
        notificationsResult,
        unreadCountResult,
        resourcesResult,
      ] = await Promise.allSettled([
        API.get("/bookings/my-bookings"),
        API.get(`/tickets/user/${user.id}`),
        notificationService.getNotifications(),
        notificationService.getUnreadCount(),
        API.get("/resources"),
      ]);

      if (cancelled) {
        return;
      }

      const warnings = [];

      if (bookingsResult.status === "fulfilled" && Array.isArray(bookingsResult.value.data)) {
        setBookings(bookingsResult.value.data);
        setBookingError("");
      } else {
        setBookings([]);
        setBookingError("Booking data unavailable.");
        warnings.push("Bookings");
      }

      if (ticketsResult.status === "fulfilled" && Array.isArray(ticketsResult.value.data)) {
        setTickets(ticketsResult.value.data);
      } else {
        setTickets([]);
        warnings.push("Tickets");
      }

      if (
        notificationsResult.status === "fulfilled"
        && Array.isArray(notificationsResult.value)
      ) {
        setNotifications(notificationsResult.value);
      } else {
        setNotifications([]);
        warnings.push("Notifications");
      }

      if (unreadCountResult.status === "fulfilled") {
        setUnreadCount(Number(unreadCountResult.value) || 0);
      } else {
        setUnreadCount(0);
        warnings.push("Unread count");
      }

      if (resourcesResult.status === "fulfilled" && Array.isArray(resourcesResult.value.data)) {
        setResources(resourcesResult.value.data);
      } else {
        setResources([]);
        warnings.push("Resources");
      }

      setDashboardWarning(
        warnings.length
          ? `${warnings.join(", ")} data could not be loaded right now.`
          : "",
      );
      setLoading(false);
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date(today.getFullYear(), today.getMonth(), today.getDate()),
  );

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const bookingCountByDate = useMemo(() => {
    const map = new Map();

    bookings.forEach((booking) => {
      const value = booking?.startTime;
      if (!value) return;

      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().slice(0, 10);
      map.set(key, (map.get(key) || 0) + 1);
    });

    return map;
  }, [bookings]);

  const dashboardStats = useMemo(() => {
    const openTickets = tickets.filter(
      (ticket) => ticket?.status === "OPEN" || ticket?.status === "IN_PROGRESS",
    ).length;

    const now = new Date();
    const upcomingBookings = bookings.filter((booking) => {
      const startTime = booking?.startTime;
      if (!startTime) return false;

      const startDate = new Date(startTime);
      if (Number.isNaN(startDate.getTime())) return false;

      const status = String(booking?.status || "").toUpperCase();
      if (status === "CANCELLED" || status === "REJECTED") return false;

      return startDate >= now;
    }).length;

    return [
      { label: "My Bookings", value: bookings.length, helper: "Total booking entries" },
      { label: "Open Tickets", value: openTickets, helper: "Open + in progress" },
      { label: "Unread Notifications", value: unreadCount, helper: "Waiting for your review" },
      { label: "Upcoming Bookings", value: upcomingBookings, helper: "Future scheduled requests" },
    ];
  }, [bookings, tickets, unreadCount]);

  const weeklyAnalytics = useMemo(() => {
    const days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      days.push({
        key: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        bookings: 0,
        tickets: 0,
        notifications: 0,
      });
    }

    const indexMap = new Map(days.map((day, index) => [day.key, index]));

    bookings.forEach((booking) => {
      const date = new Date(booking?.startTime);
      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().slice(0, 10);
      const idx = indexMap.get(key);
      if (idx == null) return;

      days[idx].bookings += 1;
    });

    tickets.forEach((ticket) => {
      const date = new Date(ticket?.createdAt);
      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().slice(0, 10);
      const idx = indexMap.get(key);
      if (idx == null) return;

      days[idx].tickets += 1;
    });

    notifications.forEach((notification) => {
      const date = new Date(notification?.createdAt);
      if (Number.isNaN(date.getTime())) return;

      const key = date.toISOString().slice(0, 10);
      const idx = indexMap.get(key);
      if (idx == null) return;

      days[idx].notifications += 1;
    });

    const series = days.map((day) => ({
      ...day,
      total: day.bookings + day.tickets + day.notifications,
    }));

    const maxValue = Math.max(...series.map((day) => day.total), 1);
    const chartWidth = 330;
    const chartHeight = 110;
    const step = chartWidth / 6;

    const points = series
      .map((item, index) => {
        const x = index * step;
        const y = chartHeight - (item.total / maxValue) * (chartHeight - 10);
        return `${x},${y}`;
      })
      .join(" ");

    return { series, maxValue, points, chartWidth, chartHeight };
  }, [bookings, tickets, notifications]);

  const operationalInsights = useMemo(() => {
    const approvedBookings = bookings.filter((booking) => booking?.status === "APPROVED").length;

    const resolvedTickets = tickets.filter(
      (ticket) => ticket?.status === "RESOLVED" || ticket?.status === "CLOSED",
    ).length;

    const now = new Date();
    const upcomingBookings = bookings.filter((booking) => {
      const date = new Date(booking?.startTime);
      if (Number.isNaN(date.getTime())) return false;

      const status = String(booking?.status || "").toUpperCase();
      if (status === "CANCELLED" || status === "REJECTED") return false;

      return date >= now;
    }).length;

    const activeResources = resources.filter(
      (resource) => String(resource?.status || "").toUpperCase() === "ACTIVE",
    ).length;

    return {
      bookingApprovalRate: bookings.length
        ? Math.round((approvedBookings / bookings.length) * 100)
        : 0,
      ticketResolutionRate: tickets.length
        ? Math.round((resolvedTickets / tickets.length) * 100)
        : 0,
      upcomingBookingRate: bookings.length
        ? Math.round((upcomingBookings / bookings.length) * 100)
        : 0,
      resourceAvailabilityRate: resources.length
        ? Math.round((activeResources / resources.length) * 100)
        : 0,
    };
  }, [bookings, tickets, resources]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const start = new Date(year, month, 1 - startDay);
    const days = [];

    for (let i = 0; i < 42; i += 1) {
      const current = new Date(start);
      current.setDate(start.getDate() + i);
      days.push(current);
    }

    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <section className="admin-layout">
      <StudentSidebar />

      <div className="admin-shell">
        <header className="admin-head">
          <div>
            <p className="admin-kicker">Student Workspace</p>
            <h1>Campus Activity Dashboard</h1>
            <p className="admin-subtitle">
              Track your reservations, monitor ticket progress, and stay updated with campus
              notifications from one place.
            </p>
          </div>
          <Link to="/create" className="btn btn-primary">
            Create Booking
          </Link>
        </header>

        <div className="admin-content-grid">
          <div className="admin-main-col">
            <div className="admin-stats">
              {dashboardStats.map((stat) => (
                <article className="admin-stat-card" key={stat.label}>
                  <p>{stat.label}</p>
                  <h2>{loading ? "..." : stat.value}</h2>
                  <span>{stat.helper}</span>
                </article>
              ))}
            </div>

            <section className="admin-analytics-grid" aria-label="Student activity analytics">
              <article className="admin-analytics-card">
                <header className="admin-analytics-head">
                  <div>
                    <p>Analytics</p>
                    <h3>My Weekly Activity</h3>
                  </div>
                  <span>Last 7 Days</span>
                </header>

                <div className="admin-analytics-bars">
                  {weeklyAnalytics.series.map((item) => (
                    <div key={item.key} className="admin-analytics-col">
                      <span>{loading ? "..." : item.total}</span>
                      <div className="admin-analytics-track">
                        <div
                          className="admin-analytics-fill"
                          style={{
                            height: `${(item.total / weeklyAnalytics.maxValue) * 100}%`,
                          }}
                        />
                      </div>
                      <strong>{item.label}</strong>
                    </div>
                  ))}
                </div>

                <div className="admin-analytics-line">
                  <svg
                    viewBox={`0 0 ${weeklyAnalytics.chartWidth} ${weeklyAnalytics.chartHeight}`}
                    role="img"
                    aria-label="Student trend line"
                  >
                    <polyline points={weeklyAnalytics.points} />
                  </svg>
                </div>
              </article>

              <article className="admin-analytics-card admin-analytics-card-side">
                <header className="admin-analytics-head">
                  <div>
                    <p>Insights</p>
                    <h3>Personal Snapshot</h3>
                  </div>
                </header>
                <ul className="admin-insight-list">
                  <li>
                    <p>Booking approval rate</p>
                    <strong>{loading ? "..." : `${operationalInsights.bookingApprovalRate}%`}</strong>
                  </li>
                  <li>
                    <p>Ticket resolution rate</p>
                    <strong>{loading ? "..." : `${operationalInsights.ticketResolutionRate}%`}</strong>
                  </li>
                  <li>
                    <p>Upcoming booking rate</p>
                    <strong>{loading ? "..." : `${operationalInsights.upcomingBookingRate}%`}</strong>
                  </li>
                  <li>
                    <p>Resource availability</p>
                    <strong>{loading ? "..." : `${operationalInsights.resourceAvailabilityRate}%`}</strong>
                  </li>
                </ul>
                {dashboardWarning ? (
                  <p className="admin-insight-warning">{dashboardWarning}</p>
                ) : null}
              </article>
            </section>

            <div className="admin-links" aria-label="Student quick actions">
              {links.map((item) => (
                <Link key={item.to} to={item.to} className="admin-link-card">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span>Go to section</span>
                </Link>
              ))}
            </div>
          </div>

          <aside className="admin-aside-col">
            <section className="admin-calendar-card" aria-label="My booking calendar">
              <header className="admin-calendar-head">
                <div className="admin-calendar-title-wrap">
                  <span className="admin-calendar-title-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="16" rx="3" />
                      <path d="M8 3v4M16 3v4M3 10h18" />
                    </svg>
                  </span>
                  <h3>{monthLabel}</h3>
                </div>
                <div className="admin-calendar-nav">
                  <button type="button" onClick={handlePrevMonth} aria-label="Previous month">
                    &#8249;
                  </button>
                  <button type="button" onClick={handleNextMonth} aria-label="Next month">
                    &#8250;
                  </button>
                </div>
              </header>

              {bookingError ? (
                <p className="admin-calendar-error">{bookingError}</p>
              ) : null}

              <div className="admin-calendar-grid">
                <span className="admin-calendar-day">Sun</span>
                <span className="admin-calendar-day">Mon</span>
                <span className="admin-calendar-day">Tue</span>
                <span className="admin-calendar-day">Wed</span>
                <span className="admin-calendar-day">Thu</span>
                <span className="admin-calendar-day">Fri</span>
                <span className="admin-calendar-day">Sat</span>

                {calendarDays.map((date) => {
                  const key = date.toISOString().slice(0, 10);
                  const count = bookingCountByDate.get(key) || 0;
                  const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                  const isToday =
                    date.getFullYear() === today.getFullYear()
                    && date.getMonth() === today.getMonth()
                    && date.getDate() === today.getDate();
                  const isSelected =
                    date.getFullYear() === selectedDate.getFullYear()
                    && date.getMonth() === selectedDate.getMonth()
                    && date.getDate() === selectedDate.getDate();

                  const classes = ["admin-calendar-date"];
                  if (!isCurrentMonth) classes.push("is-muted");
                  if (count > 0) classes.push("has-events");
                  if (isToday) classes.push("is-today");
                  if (isSelected) classes.push("is-selected");

                  return (
                    <button
                      key={key}
                      type="button"
                      className={classes.join(" ")}
                      onClick={() => setSelectedDate(new Date(date))}
                      aria-label={`Select ${date.toDateString()}`}
                    >
                      <span>{date.getDate()}</span>
                      {count > 0 ? <span className="admin-calendar-dot" /> : null}
                    </button>
                  );
                })}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default StudentDashboard;

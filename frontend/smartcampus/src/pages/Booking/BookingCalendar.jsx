import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import "./BookingCalendar.css";

const ACTIVE_STATUSES = new Set(["PENDING", "APPROVED"]);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const startOfCalendar = (date) => {
  const start = startOfMonth(date);
  const day = start.getDay();
  return addDays(start, -day);
};

const endOfCalendar = (date) => {
  const end = endOfMonth(date);
  const day = end.getDay();
  return addDays(end, 6 - day);
};

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const formatTime = (date) =>
  date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

const normalizeBooking = (booking) => {
  const start = new Date(booking?.startTime);
  const end = new Date(booking?.endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return {
    ...booking,
    start,
    end,
  };
};

const isSameMonth = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

function BookingCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeBooking, setActiveBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await API.get("/bookings");
        const data = Array.isArray(response.data) ? response.data : [];
        const normalized = data
          .filter((item) => ACTIVE_STATUSES.has(item?.status))
          .map(normalizeBooking)
          .filter(Boolean);
        setBookings(normalized);
      } catch (e) {
        console.error("Error fetching bookings", e);
        setError("Couldn't load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const calendarDays = useMemo(() => {
    const start = startOfCalendar(currentMonth);
    const end = endOfCalendar(currentMonth);
    const days = [];

    for (let day = new Date(start); day <= end; day = addDays(day, 1)) {
      days.push(new Date(day));
    }

    return days;
  }, [currentMonth]);

  const bookingsByDate = useMemo(() => {
    const map = new Map();
    bookings.forEach((booking) => {
      const key = formatDateKey(booking.start);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(booking);
    });
    return map;
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((booking) => booking.end >= now)
      .sort((a, b) => a.start - b.start)
      .slice(0, 6);
  }, [bookings]);

  const monthLabel = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="sc-container py-4 booking-calendar">
      <div className="sc-card">
        <div className="sc-card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div>
            <h2 className="h4 mb-1">Booking Calendar</h2>
            <div className="text-muted small">
              Hover a booking to preview details, click to view more.
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))}
            >
              Prev
            </button>
            <span className="fw-semibold">{monthLabel}</span>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setCurrentMonth(addDays(endOfMonth(currentMonth), 1))}
            >
              Next
            </button>
          </div>
        </div>

        <div className="sc-card-body">
          {error ? <div className="alert alert-warning mb-3">{error}</div> : null}
          {loading ? <div className="text-muted">Loading calendar...</div> : null}

          <div className="calendar-layout">
            <aside className="calendar-side">
              <div className="side-header">
                <h3 className="h5 mb-1">Upcoming Events</h3>
                <span className="text-muted small">Don't miss schedule</span>
              </div>

              <div className="side-list">
                {upcomingBookings.length === 0 ? (
                  <div className="text-muted">No upcoming bookings yet.</div>
                ) : (
                  upcomingBookings.map((booking) => (
                    <button
                      key={booking.id}
                      type="button"
                      className="event-card"
                      onClick={() => setActiveBooking(booking)}
                    >
                      <div className="event-row">
                        <span className="event-dot" />
                        <span className="event-time">
                          {booking.start.toLocaleDateString()} - {formatTime(booking.start)} -
                          {formatTime(booking.end)}
                        </span>
                      </div>
                      <div className="event-title">{booking.resourceName}</div>
                      <div className="event-subtitle">
                        {booking.purpose || "Campus booking"} - {booking.bookedBy || "N/A"}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>

            <section className="calendar-main">
              <div className="calendar-controls">
                <span className="calendar-pill">Month</span>
              </div>

              <div className="calendar-weekdays">
                {[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarDays.map((day) => {
                  const key = formatDateKey(day);
                  const isCurrent = isSameMonth(day, currentMonth);
                  const dayBookings = bookingsByDate.get(key) ?? [];
                  const hasBookings = dayBookings.length > 0;

                  return (
                    <div
                      key={key}
                      className={`calendar-day${isCurrent ? "" : " muted"}${
                        hasBookings ? " booked" : " free"
                      }`}
                    >
                      <div className="calendar-day-top">
                        <span className="calendar-date">{day.getDate()}</span>
                      </div>
                      <div className="calendar-events">
                        {dayBookings.slice(0, 2).map((booking) => (
                          <button
                            key={booking.id}
                            type="button"
                            className="calendar-event"
                            onClick={() => setActiveBooking(booking)}
                          >
                            <span className="event-time">
                              {formatTime(booking.start)} - {formatTime(booking.end)}
                            </span>
                            <span className="event-title">
                              {booking.resourceName}
                            </span>
                            <span className="event-tooltip">
                              {booking.resourceName} - {booking.purpose || "Booking"}
                              <br />
                              Booked by: {booking.bookedBy || "N/A"}
                              <br />
                              {formatTime(booking.start)} - {formatTime(booking.end)}
                            </span>
                          </button>
                        ))}
                        {dayBookings.length > 2 ? (
                          <span className="event-more">+{dayBookings.length - 2} more</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>

      {activeBooking ? (
        <div className="calendar-modal" role="dialog" aria-modal="true">
          <div className="calendar-modal-card">
            <div className="calendar-modal-header">
              <h4 className="h5 mb-0">Booking Details</h4>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => setActiveBooking(null)}
              >
                Close
              </button>
            </div>
            <div className="calendar-modal-body">
              <div className="detail-row">
                <span className="detail-label">Resource</span>
                <span>{activeBooking.resourceName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Purpose</span>
                <span>{activeBooking.purpose}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Booked By</span>
                <span>{activeBooking.bookedBy || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Attendees</span>
                <span>{activeBooking.attendees}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span>{activeBooking.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time</span>
                <span>
                  {formatTime(activeBooking.start)} - {formatTime(activeBooking.end)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default BookingCalendar;

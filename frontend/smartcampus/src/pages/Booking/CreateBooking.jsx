import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

const toDatetimeLocalMin = (date = new Date()) => {
  const pad = (value) => String(value).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const resolveEndMin = (startTime, minNow) => {
  if (!startTime) return minNow;
  return startTime > minNow ? startTime : minNow;
};

function CreateBooking() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    resourceName: "",
    purpose: "",
    attendees: "",
    startTime: "",
    endTime: "",
  });
  const [touched, setTouched] = useState({
    startTime: false,
    endTime: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [minNow, setMinNow] = useState(() => toDatetimeLocalMin());

  const minEnd = resolveEndMin(booking.startTime, minNow);
  const startTimeError =
    !submitting &&
    touched.startTime &&
    booking.startTime &&
    booking.startTime < minNow
      ? "Please select a future start time."
      : "";
  const endTimeError =
    !submitting &&
    touched.endTime &&
    booking.endTime &&
    booking.endTime < minEnd
      ? "Please select a future end time."
      : "";

  const isValid = useMemo(() => {
    return (
      booking.resourceName.trim() &&
      booking.purpose.trim() &&
      booking.attendees !== "" &&
      booking.startTime &&
      booking.endTime
    );
  }, [booking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const minNowValue = toDatetimeLocalMin();

    if (name === "startTime") {
      const safeStart = value && value < minNowValue ? minNowValue : value;
      const resolvedMinEnd = resolveEndMin(safeStart, minNowValue);

      setMinNow(minNowValue);
      setTouched((prev) => ({ ...prev, startTime: true }));
      setBooking((prev) => ({
        ...prev,
        startTime: safeStart,
        endTime: prev.endTime && prev.endTime < resolvedMinEnd ? "" : prev.endTime,
      }));
      return;
    }

    if (name === "endTime") {
      const resolvedMinEnd = resolveEndMin(booking.startTime, minNowValue);
      const safeEnd = value && value < resolvedMinEnd ? resolvedMinEnd : value;

      setMinNow(minNowValue);
      setTouched((prev) => ({ ...prev, endTime: true }));
      setBooking((prev) => ({
        ...prev,
        endTime: safeEnd,
      }));
      return;
    }

    setBooking({
      ...booking,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid || submitting) return;

    setSubmitting(true);

    try {
      await API.post("/bookings", booking);
      alert("Booking created successfully");
      navigate("/bookings");
    } catch (error) {
      alert(error.response?.data?.message || "Error creating booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sc-container py-4">
      <div className="sc-card" style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="sc-card-header">
          <h2 className="h4 mb-1">Create Booking</h2>
          <div className="text-muted small">
            Fill in the details below to reserve a campus resource.
          </div>
        </div>

        <div className="sc-card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-8">
              <label className="form-label">Resource Name</label>
              <input
                type="text"
                className="form-control"
                name="resourceName"
                value={booking.resourceName}
                onChange={handleChange}
                placeholder="e.g., Auditorium A"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Attendees</label>
              <input
                type="number"
                className="form-control"
                name="attendees"
                value={booking.attendees}
                onChange={handleChange}
                min={1}
                placeholder="e.g., 30"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Purpose</label>
              <input
                type="text"
                className="form-control"
                name="purpose"
                value={booking.purpose}
                onChange={handleChange}
                placeholder="e.g., Workshop / Lecture"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="startTime"
                value={booking.startTime}
                onChange={handleChange}
                onFocus={() => setMinNow(toDatetimeLocalMin())}
                min={minNow}
                required
              />
              {startTimeError ? (
                <div className="form-text text-danger">{startTimeError}</div>
              ) : null}
            </div>

            <div className="col-md-6">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="endTime"
                value={booking.endTime}
                onChange={handleChange}
                onFocus={() => setMinNow(toDatetimeLocalMin())}
                min={minEnd}
                required
              />
              {endTimeError ? (
                <div className="form-text text-danger">{endTimeError}</div>
              ) : null}
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center pt-2">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => navigate("/bookings")}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isValid || submitting}
              >
                {submitting ? "Creating…" : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBooking;

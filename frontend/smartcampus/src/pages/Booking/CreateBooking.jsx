import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function CreateBooking() {
  const navigate = useNavigate();

  const [booking, setBooking] = useState({
    resourceName: "",
    purpose: "",
    attendees: "",
    startTime: "",
    endTime: "",
  });

  const [submitting, setSubmitting] = useState(false);

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
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
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
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                className="form-control"
                name="endTime"
                value={booking.endTime}
                onChange={handleChange}
                required
              />
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

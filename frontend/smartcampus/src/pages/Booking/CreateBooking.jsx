import { useState } from "react";
import API from "../../services/api";

function CreateBooking() {

  const [booking, setBooking] = useState({
    resourceName: "",
    purpose: "",
    attendees: "",
    startTime: "",
    endTime: ""
  });

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post("/bookings", booking);

      alert("Booking created successfully");

      setBooking({
        resourceName: "",
        purpose: "",
        attendees: "",
        startTime: "",
        endTime: ""
      });

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Error creating booking"
      );

    }

  };

  return (

    <div className="container mt-4">

      <h2>Create Booking</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">

          <label className="form-label">
            Resource Name
          </label>

          <input
            type="text"
            className="form-control"
            name="resourceName"
            value={booking.resourceName}
            onChange={handleChange}
            required
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Purpose
          </label>

          <input
            type="text"
            className="form-control"
            name="purpose"
            value={booking.purpose}
            onChange={handleChange}
            required
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Attendees
          </label>

          <input
            type="number"
            className="form-control"
            name="attendees"
            value={booking.attendees}
            onChange={handleChange}
            required
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            Start Time
          </label>

          <input
            type="datetime-local"
            className="form-control"
            name="startTime"
            value={booking.startTime}
            onChange={handleChange}
            required
          />

        </div>

        <div className="mb-3">

          <label className="form-label">
            End Time
          </label>

          <input
            type="datetime-local"
            className="form-control"
            name="endTime"
            value={booking.endTime}
            onChange={handleChange}
            required
          />

        </div>

        <button
          type="submit"
          className="btn btn-success"
        >
          Create Booking
        </button>

      </form>

    </div>

  );

}

export default CreateBooking;
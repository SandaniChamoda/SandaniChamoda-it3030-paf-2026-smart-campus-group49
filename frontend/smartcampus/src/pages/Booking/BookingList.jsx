import { useEffect, useState } from "react";
import API from "../../services/api";

function BookingList() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Bookings</h2>

      <table className="table table-bordered table-striped">

        <thead>
          <tr>
            <th>ID</th>
            <th>Resource</th>
            <th>Purpose</th>
            <th>Attendees</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.resourceName}</td>
              <td>{b.purpose}</td>
              <td>{b.attendees}</td>
              <td>{b.startTime}</td>
              <td>{b.endTime}</td>
              <td>{b.status}</td>
            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}

export default BookingList;
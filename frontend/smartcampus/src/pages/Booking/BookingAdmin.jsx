import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import axios from "axios";

function BookingList() {
  const [resourceName, setResourceName] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [allBookings, setAllBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const search = (resourceName ?? "").trim().toLowerCase();

    return allBookings.filter((b) => {
      const name = ((b?.resourceName ?? "") + "").trim();
      const nameLower = name.toLowerCase();

      const statusOk = statusFilter === "ALL" ? true : b?.status === statusFilter;
      const searchOk = !search ? true : nameLower.startsWith(search);

      return statusOk && searchOk;
    });
  }, [allBookings, resourceName, statusFilter]);

  const fetchBookings = async () => {
    try {
      const response = await API.get("/bookings");

      setAllBookings(response.data); // store original data
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  const approveBooking = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to approve this booking?",
    );

    if (!confirmAction) return;

    await API.put(`/bookings/${id}/approve`);

    alert("Booking approved");

    fetchBookings();
  };

  const rejectBooking = async (id) => {
    const reason = prompt("Enter rejection reason:");

    if (!reason) {
      alert("Reason is required");
      return;
    }
    const confirmAction = window.confirm(
      "Are you sure you want to reject this booking?",
    );

    if (!confirmAction) return;

    try {
      await axios.put(
        `http://localhost:8086/api/bookings/${id}/reject`,
        {
          reason: reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Error rejecting booking");
    }
  };
  const cancelBooking = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmAction) return;

    await API.put(`/bookings/${id}/cancel`);

    alert("Booking cancelled");

    fetchBookings();
  };

  return (
    <div className="container mt-4">
      <h2>All Bookings</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control d-inline w-25 me-2"
          placeholder="Search by Resource"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
        />

        <select
          className="form-select d-inline w-auto me-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

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
            <th>Actions</th>
            <th>Reason</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center text-muted py-4">
                No matching results
              </td>
            </tr>
          ) : (
            filteredBookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.resourceName}</td>
                <td>{b.purpose}</td>
                <td>{b.attendees}</td>
                <td>{b.startTime}</td>
                <td>{b.endTime}</td>
                <td>{b.status}</td>
                <td>
                  {b.status === "PENDING" && (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => approveBooking(b.id)}
                      >
                        Approve
                      </button>

                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => rejectBooking(b.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {b.status === "APPROVED" && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => cancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  )}

                  {(b.status === "REJECTED" || b.status === "CANCELLED") && (
                    <span className="text-muted">No Actions</span>
                  )}
                </td>
                <td>{b.rejectionReason}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BookingList;

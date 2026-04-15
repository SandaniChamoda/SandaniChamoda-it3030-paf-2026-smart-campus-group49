import { useMemo } from "react";
import { useParams } from "react-router-dom";

const MOCK_BOOKINGS = {
  1: {
    id: 1,
    resourceName: "Lab A",
    purpose: "Programming Class",
    attendees: 40,
    startTime: "2026-04-12 09:00",
    endTime: "2026-04-12 11:00",
    status: "APPROVED"
  },
  2: {
    id: 2,
    resourceName: "Seminar Hall",
    purpose: "Research Meetup",
    attendees: 120,
    startTime: "2026-04-12 14:00",
    endTime: "2026-04-12 16:00",
    status: "PENDING"
  },
  3: {
    id: 3,
    resourceName: "Library Room 3",
    purpose: "Group Study",
    attendees: 8,
    startTime: "2026-04-12 17:00",
    endTime: "2026-04-12 19:00",
    status: "APPROVED"
  }
};

const buildMockBooking = (id) => {
  const numericId = Number(id);
  if (!numericId) return null;
  if (MOCK_BOOKINGS[numericId]) return MOCK_BOOKINGS[numericId];

  return {
    id: numericId,
    resourceName: "Unknown Resource",
    purpose: "Mock booking from QR",
    attendees: 0,
    startTime: "N/A",
    endTime: "N/A",
    status: "PENDING"
  };
};

function MockVerifyPage() {
  const { id } = useParams();

  const booking = useMemo(() => buildMockBooking(id), [id]);

  if (!booking) {
    return (
      <div className="sc-container py-4">
        <div className="sc-card">
          <div className="sc-card-body">Booking not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sc-container py-4">
      <div className="sc-card">
        <div className="sc-card-header">
          <h2 className="h4 mb-1">Booking Details</h2>
          <div className="text-muted small">
            Mock details shown after scanning the QR code.
          </div>
        </div>

        <div className="sc-card-body">
          <div className="border rounded-3 p-3 bg-light">
            <div className="d-flex gap-2">
              <strong style={{ minWidth: 90 }}>ID:</strong>
              <span>{booking.id}</span>
            </div>
            <div className="d-flex gap-2">
              <strong style={{ minWidth: 90 }}>Resource:</strong>
              <span>{booking.resourceName}</span>
            </div>
            <div className="d-flex gap-2">
              <strong style={{ minWidth: 90 }}>Purpose:</strong>
              <span>{booking.purpose}</span>
            </div>
            <div className="d-flex gap-2">
              <strong style={{ minWidth: 90 }}>Attendees:</strong>
              <span>{booking.attendees}</span>
            </div>
            <div className="d-flex gap-2">
              <strong style={{ minWidth: 90 }}>Start:</strong>
              <span>{booking.startTime}</span>
            </div>
            <div className="d-flex gap-2">
              <strong style={{ minWidth: 90 }}>End:</strong>
              <span>{booking.endTime}</span>
            </div>
            <div className="d-flex gap-2">
              <strong style={{ minWidth: 90 }}>Status:</strong>
              <span>{booking.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MockVerifyPage;

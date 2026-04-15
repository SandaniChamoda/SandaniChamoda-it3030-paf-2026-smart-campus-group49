import { useEffect, useMemo, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

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

const parseBookingId = (value) => {
  if (!value) return "";
  const matches = String(value).match(/\d+/g);
  if (!matches || matches.length === 0) return "";
  return matches[matches.length - 1];
};

const parseQrJson = (value) => {
  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
};

const buildMockBooking = (id, rawValue) => {
  if (MOCK_BOOKINGS[id]) {
    return MOCK_BOOKINGS[id];
  }

  return {
    id: Number(id) || 0,
    resourceName: "Unknown Resource",
    purpose: "Mock booking from QR",
    attendees: 0,
    startTime: "N/A",
    endTime: "N/A",
    status: "PENDING",
    rawValue
  };
};

function MockScannerPage() {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("mock-reader", {
      fps: 10,
      qrbox: 250
    });

    scanner.render(
      (decodedText) => {
        const parsed = parseQrJson(decodedText);

        if (parsed) {
          setError("");
          setBooking(parsed);
          return;
        }

        const id = parseBookingId(decodedText);
        if (!id) {
          setError("Could not read booking details from the QR code.");
          setBooking(null);
          return;
        }

        setError("");
        setBooking(buildMockBooking(id, decodedText));
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const bookingEntries = useMemo(() => {
    if (!booking) return [];

    const formatValue = (value) => {
      if (value === null || value === undefined || value === "") {
        return "N/A";
      }
      return String(value);
    };

    return [
      ["ID", booking.id],
      ["Resource", booking.resourceName],
      ["Purpose", booking.purpose],
      ["Attendees", booking.attendees],
      ["Start", booking.startTime],
      ["End", booking.endTime],
      ["Status", booking.status],
      ["Checked In", booking.checkedInTime],
      ["Rejection Reason", booking.rejectionReason]
    ].map(([label, value]) => [label, formatValue(value)]);
  }, [booking]);

  return (
    <div className="sc-container py-4">
      <div className="sc-card">
        <div className="sc-card-header">
          <h2 className="h4 mb-1">Mock QR Scanner</h2>
          <div className="text-muted small">
            Scans a QR payload and shows booking details as a card.
          </div>
        </div>

        <div className="sc-card-body">
          <div id="mock-reader" style={{ maxWidth: 360 }} />

          {error ? (
            <div className="alert alert-warning mt-3 mb-0">{error}</div>
          ) : null}

          {booking ? (
            <div className="mt-4">
              <h3 className="h6">Booking Details</h3>
              <div className="table-responsive border rounded-3 bg-light">
                <table className="table table-sm mb-0">
                  <tbody>
                    {bookingEntries.map(([label, value]) => (
                      <tr key={label}>
                        <th scope="row" style={{ width: 140 }}>
                          {label}
                        </th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MockScannerPage;

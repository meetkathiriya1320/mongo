import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "../common/Button";
import { Loader2 } from "lucide-react";
import classNames from "classnames";
import toast from "react-hot-toast";

import { showConfirmationToast } from "../../utils/toastUtils";

// ... existing code ...

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/booking");
      setBookings(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    let action = "Update";
    if (newStatus === "confirmed") action = "Confirm";
    else if (newStatus === "delivered") action = "Mark as Delivered";
    else if (newStatus === "received") action = "Mark as Received";

    showConfirmationToast(`${action} this booking?`, async () => {
      try {
        await api.put(`/booking/${id}/status`, { status: newStatus });
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
        );
        toast.success(`Booking ${newStatus}`);
      } catch (error) {
        toast.error("Update failed");
      }
    });
  };

  const handleCancel = (id) => {
    showConfirmationToast("Cancel this booking?", async () => {
      try {
        await api.post(`/booking/cancel/${id}`);
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
        );
        toast.success("Booking cancelled");
      } catch (error) {
        toast.error("Failed to cancel");
      }
    });
  };

  if (loading)
    return (
      <div className="flex-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="admin-section-header">
        <h2 className="admin-section-title">All Bookings</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td style={{ color: "var(--text-muted)" }}>
                  #{booking._id.slice(-6)}
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>
                    {booking.user_id?.name || "Unknown"}
                  </div>
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    {booking.user_id?.email}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>
                    {booking.selection_id?.name}
                  </div>
                  <div
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}
                  >
                    {booking.selectedTopSize && (
                      <span style={{ marginRight: "6px" }}>
                        T: {booking.selectedTopSize}
                      </span>
                    )}
                    {booking.selectedBottomSize && (
                      <span style={{ marginRight: "6px" }}>
                        B: {booking.selectedBottomSize}
                      </span>
                    )}
                    {booking.selectedColor && (
                      <span>{booking.selectedColor}</span>
                    )}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>₹{booking.pay}</td>
                <td>
                  <span
                    className={classNames(
                      "status-badge",
                      `status-${booking.status}`,
                    )}
                  >
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {booking.status === "pending" && (
                      <Button
                        size="sm"
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          border: "none",
                        }}
                        onClick={() =>
                          handleStatusUpdate(booking._id, "confirmed")
                        }
                      >
                        Confirm
                      </Button>
                    )}
                    {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        style={{
                          background: "#fef3c7",
                          color: "#b45309",
                          border: "none",
                        }}
                        onClick={() =>
                          handleStatusUpdate(booking._id, "delivered")
                        }
                      >
                        Deliver
                      </Button>
                    )}
                    {booking.status === "delivered" && (
                      <Button
                        size="sm"
                        style={{
                          background: "#dcfce7",
                          color: "#15803d",
                          border: "none",
                        }}
                        onClick={() =>
                          handleStatusUpdate(booking._id, "received")
                        }
                      >
                        Received
                      </Button>
                    )}
                    {booking.status !== "cancelled" &&
                      booking.status !== "received" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{ color: "var(--error)" }}
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </Button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center"
                  style={{ padding: "2rem" }}
                >
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;

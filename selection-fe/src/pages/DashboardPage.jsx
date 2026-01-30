import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import {
  Loader2,
  Calendar,
  Package,
  Clock,
  XCircle,
  ChevronRight,
  History,
} from "lucide-react";
import "./Dashboard.css";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";
import { showConfirmationToast } from "../utils/toastUtils";

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/booking/my");
        setBookings(response.data.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = (id) => {
    showConfirmationToast(
      "Are you sure you want to cancel this order?",
      async () => {
        try {
          await api.post(`/booking/cancel/${id}`);
          setBookings((prev) =>
            prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b)),
          );
          toast.success("Order cancelled");
        } catch (error) {
          toast.error(
            "Failed to cancel order: " +
              (error.response?.data?.message || "Unknown error"),
          );
        }
      },
    );
  };

  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Order History</h1>
          <p className="dashboard-subtitle">
            Welcome back, <strong>{user?.name}</strong>. Here is a history of
            your orders.
          </p>
        </header>

        <section>
          <div className="dashboard-section-title">
            <History size={20} className="text-primary" />
            Your Orders
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-state">
              <div
                style={{
                  background: "#f8f9fa",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  color: "#999",
                }}
              >
                <Package size={28} />
              </div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                No orders yet
              </h3>
              <p
                style={{
                  color: "#666",
                  marginBottom: "1.5rem",
                  maxWidth: "300px",
                  marginInline: "auto",
                }}
              >
                Start exploring our curated collection and make your first order
                today.
              </p>
              <Link to="/selections">
                <Button size="lg">Explore Collection</Button>
              </Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-info">
                    <div className="booking-header">
                      <span
                        className={`booking-status status-${booking.status}`}
                      >
                        {statusLabels[booking.status] || booking.status}
                      </span>
                      <span className="booking-id">
                        #{booking._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="booking-item-name">
                      {booking.selection_id?.name || "Unknown Selection"}
                    </h3>

                    <div className="booking-details">
                      <span className="detail-item">
                        <Package size={14} />
                        SKU: {booking.selection_id?.SKU || "N/A"}
                      </span>
                      {booking.createdAt && (
                        <span className="detail-item">
                          <Calendar size={14} />
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="booking-actions">
                    <div className="booking-price">
                      ₹{booking.pay?.toLocaleString()}
                    </div>

                    {booking.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        style={{
                          color: "#dc2626",
                          borderColor: "#fee2e2",
                          fontSize: "0.85rem",
                        }}
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;

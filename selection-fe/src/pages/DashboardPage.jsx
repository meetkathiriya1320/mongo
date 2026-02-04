import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button";
import AdminOrderDetailsModal from "../components/features/AdminOrderDetailsModal"; // Reuse for now
import {
  Loader2,
  Calendar,
  Package,
  Clock,
  ChevronRight,
  History,
  Eye,
} from "lucide-react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const DashboardPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOrderId, setViewOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/order/my");
        setOrders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
            your booking requests.
          </p>
        </header>

        <section>
          <div className="dashboard-section-title">
            <History size={20} className="text-primary" />
            Your Bookings
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <Package size={28} />
              </div>
              <h3>No bookings yet</h3>
              <p>
                Start exploring our curated collection and make your first
                booking today.
              </p>
              <Link to="/selections">
                <Button size="lg">Explore Collection</Button>
              </Link>
            </div>
          ) : (
            <div className="bookings-list">
              {orders.map((order) => (
                <div key={order._id} className="booking-card">
                  <div className="booking-info">
                    <div className="booking-header">
                      <span className={`booking-status status-${order.status}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                      <span className="booking-id">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="booking-item-name">
                      {order.items_count} Item
                      {order.items_count !== 1 ? "s" : ""}
                    </h3>

                    <div className="booking-details">
                      <span className="detail-item">
                        <Calendar size={14} />
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="detail-item">
                        Total:{" "}
                        <strong>₹{order.total_amount?.toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewOrderId(order._id)}
                    >
                      <Eye size={16} style={{ marginRight: "6px" }} /> View
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reuse the Order Details Modal */}
        <AdminOrderDetailsModal
          isOpen={!!viewOrderId}
          onClose={() => setViewOrderId(null)}
          orderId={viewOrderId}
          isUserView={true} // Optional: Pass flag if we need to hide admin controls like "Update Status"
        />
      </div>
    </div>
  );
};

export default DashboardPage;

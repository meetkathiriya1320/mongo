import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { X, Loader2 } from "lucide-react";

const AdminOrderDetailsModal = ({ isOpen, onClose, orderId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && orderId) {
      fetchDetails();
    }
  }, [isOpen, orderId]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/order/${orderId}`);
      setData(res.data.data); // { order, items }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          width: "95%",
          maxWidth: "800px",
          maxHeight: "90vh",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Order Details #{orderId.slice(-6)}
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: "1.5rem", overflowY: "auto" }}>
          {loading ? (
            <div className="flex-center" style={{ padding: "2rem" }}>
              <Loader2 className="animate-spin" />
            </div>
          ) : data ? (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1rem",
                  marginBottom: "2rem",
                  background: "#f9fafb",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    User
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {data.order.user_id?.name}
                  </div>
                  <div style={{ fontSize: "0.8rem" }}>
                    {data.order.user_id?.email}
                  </div>
                </div>
                <div>
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Total Amount
                  </div>
                  <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>
                    ₹{data.order.total_amount}
                  </div>
                </div>
                <div>
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                  >
                    Items Count
                  </div>
                  <div style={{ fontWeight: 600 }}>
                    {data.order.items_count}
                  </div>
                </div>
              </div>

              <h3 style={{ marginBottom: "1rem" }}>Ordered Items</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Details</th>
                    <th>Dates</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>
                          {item.selection_id?.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          SKU: {item.selection_id?.SKU}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.85rem" }}>
                          {item.selectedTopSize && (
                            <span
                              style={{
                                marginRight: "8px",
                                background: "#eff6ff",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              T: {item.selectedTopSize}
                            </span>
                          )}
                          {item.selectedBottomSize && (
                            <span
                              style={{
                                marginRight: "8px",
                                background: "#eff6ff",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              B: {item.selectedBottomSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span>{item.selectedColor}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8rem" }}>
                          <div>
                            From:{" "}
                            {new Date(item.deliver_date).toLocaleDateString(
                              "en-GB",
                            )}
                          </div>
                          <div>
                            To:{" "}
                            {new Date(item.receive_date).toLocaleDateString(
                              "en-GB",
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>Not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailsModal;

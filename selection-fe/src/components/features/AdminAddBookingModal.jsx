import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Button from "../common/Button";
import Input from "../common/Input"; // Assuming Input component exists, check path
import { X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminAddBookingModal = ({ isOpen, onClose, onBookingAdded }) => {
  const [users, setUsers] = useState([]);
  const [selections, setSelections] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Form State
  const [selecteduserId, setSelectedUserId] = useState("");
  const [cart, setCart] = useState([]);

  // Current Item State to add to cart
  const [currentItemId, setCurrentItemId] = useState("");
  const [currentTop, setCurrentTop] = useState("");
  const [currentBottom, setCurrentBottom] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [deliverDate, setDeliverDate] = useState("");
  const [receiveDate, setReceiveDate] = useState("");

  const [submissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchConfig();
      // Reset state
      setCart([]);
      setSelectedUserId("");
      resetCurrentItem();
    }
  }, [isOpen]);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const [usersRes, selectionsRes] = await Promise.all([
        api.get("/user/users"),
        api.get("/selection"),
      ]);
      setUsers(usersRes.data.data || []);
      setSelections(selectionsRes.data.data || []);
    } catch (error) {
      toast.error("Failed to load users or items");
    } finally {
      setLoadingConfig(false);
    }
  };

  const resetCurrentItem = () => {
    setCurrentItemId("");
    setCurrentTop("");
    setCurrentBottom("");
    setCurrentColor("");
    setDeliverDate("");
    setReceiveDate("");
  };

  const handleAddItem = () => {
    if (!currentItemId) return toast.error("Select an item");
    if (!deliverDate || !receiveDate) return toast.error("Select dates");

    // Find selection to validate varieties
    const item = selections.find((s) => s._id === currentItemId);
    if (!item) return;

    if (item.topSizes?.length > 0 && !currentTop)
      return toast.error("Select Top Size");
    if (item.bottomSizes?.length > 0 && !currentBottom)
      return toast.error("Select Bottom Size");
    if (item.colors?.length > 0 && !currentColor)
      return toast.error("Select Color");

    const cartItem = {
      tempId: Date.now(),
      selection: item,
      topSize: currentTop,
      bottomSize: currentBottom,
      color: currentColor,
      deliverDate,
      receiveDate,
    };

    setCart([...cart, cartItem]);
    resetCurrentItem();
  };

  const handleRemoveItem = (tempId) => {
    setCart(cart.filter((i) => i.tempId !== tempId));
  };

  const handleSubmit = async () => {
    if (!selecteduserId) return toast.error("Select a User");
    if (cart.length === 0) return toast.error("Add at least one item");

    setSubmissionLoading(true);
    try {
      // Loop create bookings
      // In a real app you might want a batch API, but loop is fine for now
      for (const item of cart) {
        const payload = {
          user_id: selecteduserId,
          selection_id: item.selection._id,
          deposit: item.selection.price * 0.5,
          pay: item.selection.price,
          selectedTopSize: item.topSize,
          selectedBottomSize: item.bottomSize,
          selectedColor: item.color,
          deliver_date: item.deliverDate,
          receive_date: item.receiveDate,
        };
        await api.post("/booking", payload);
      }
      toast.success("Bookings created successfully");
      onBookingAdded();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create some bookings");
    } finally {
      setSubmissionLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentSelection = selections.find((s) => s._id === currentItemId);

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
        {/* Header */}
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
            New Admin Booking
          </h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "1.5rem", overflowY: "auto", flex: 1 }}>
          {loadingConfig ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              Loading...
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
              }}
            >
              {/* Left Col: Config */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* 1. User Selection */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: 500,
                    }}
                  >
                    Select User
                  </label>
                  <select
                    value={selecteduserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid #ced4da",
                    }}
                  >
                    <option value="">-- Choose User --</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <hr
                  style={{ border: "none", borderTop: "1px solid #f3f4f6" }}
                />

                {/* 2. Add Item Form */}
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <h3
                    style={{
                      marginBottom: "1rem",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    Add Item
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <select
                      value={currentItemId}
                      onChange={(e) => {
                        setCurrentItemId(e.target.value);
                        // Reset vars when item changes
                        setCurrentTop("");
                        setCurrentBottom("");
                        setCurrentColor("");
                      }}
                      style={{
                        width: "100%",
                        padding: "0.6rem",
                        borderRadius: "6px",
                        border: "1px solid #ced4da",
                      }}
                    >
                      <option value="">-- Select Item --</option>
                      {selections.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} (₹{s.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentSelection && (
                    <>
                      {/* Options */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.5rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {currentSelection.topSizes?.length > 0 && (
                          <select
                            value={currentTop}
                            onChange={(e) => setCurrentTop(e.target.value)}
                            style={{
                              padding: "0.5rem",
                              borderRadius: "4px",
                              border: "1px solid #ced4da",
                            }}
                          >
                            <option value="">Top Size</option>
                            {currentSelection.topSizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                        {currentSelection.bottomSizes?.length > 0 && (
                          <select
                            value={currentBottom}
                            onChange={(e) => setCurrentBottom(e.target.value)}
                            style={{
                              padding: "0.5rem",
                              borderRadius: "4px",
                              border: "1px solid #ced4da",
                            }}
                          >
                            <option value="">Bottom Size</option>
                            {currentSelection.bottomSizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                        {currentSelection.colors?.length > 0 && (
                          <select
                            value={currentColor}
                            onChange={(e) => setCurrentColor(e.target.value)}
                            style={{
                              padding: "0.5rem",
                              borderRadius: "4px",
                              border: "1px solid #ced4da",
                              gridColumn: "span 2",
                            }}
                          >
                            <option value="">Color</option>
                            {currentSelection.colors.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* Dates */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "0.5rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <input
                          type="date"
                          value={deliverDate}
                          onChange={(e) => setDeliverDate(e.target.value)}
                          style={{
                            padding: "0.5rem",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                          }}
                        />
                        <input
                          type="date"
                          value={receiveDate}
                          onChange={(e) => setReceiveDate(e.target.value)}
                          style={{
                            padding: "0.5rem",
                            borderRadius: "4px",
                            border: "1px solid #ced4da",
                          }}
                        />
                      </div>

                      <Button
                        size="sm"
                        onClick={handleAddItem}
                        style={{ width: "100%" }}
                      >
                        <Plus size={16} style={{ marginRight: "4px" }} /> Add to
                        Order
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Col: Cart List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderLeft: "1px solid #e5e7eb",
                  paddingLeft: "2rem",
                }}
              >
                <h3
                  style={{
                    marginBottom: "1rem",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  Items to Book ({cart.length})
                </h3>

                <div
                  style={{ flex: 1, overflowY: "auto", marginBottom: "1rem" }}
                >
                  {cart.length === 0 ? (
                    <p
                      style={{
                        color: "#9ca3af",
                        fontStyle: "italic",
                        fontSize: "0.9rem",
                      }}
                    >
                      No items added yet.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      {cart.map((item) => (
                        <div
                          key={item.tempId}
                          style={{
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            padding: "0.75rem",
                            position: "relative",
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                            {item.selection.name}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#6b7280",
                              margin: "0.25rem 0",
                            }}
                          >
                            {item.topSize && `T:${item.topSize} `}
                            {item.bottomSize && `B:${item.bottomSize} `}
                            {item.color && `${item.color}`}
                          </div>
                          <div
                            style={{ fontSize: "0.75rem", color: "#9ca3af" }}
                          >
                            {item.deliverDate} - {item.receiveDate}
                          </div>
                          <div
                            style={{
                              fontWeight: 600,
                              marginTop: "0.25rem",
                              color: "var(--primary)",
                              fontSize: "0.9rem",
                            }}
                          >
                            ₹{item.selection.price}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.tempId)}
                            style={{
                              position: "absolute",
                              top: "0.5rem",
                              right: "0.5rem",
                              color: "#ef4444",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                      fontWeight: 700,
                    }}
                  >
                    <span>Total</span>
                    <span>
                      ₹
                      {cart.reduce(
                        (sum, item) => sum + item.selection.price,
                        0,
                      )}
                    </span>
                  </div>
                  <Button
                    style={{ width: "100%" }}
                    onClick={handleSubmit}
                    isLoading={submissionLoading}
                    disabled={cart.length === 0 || !selecteduserId}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAddBookingModal;

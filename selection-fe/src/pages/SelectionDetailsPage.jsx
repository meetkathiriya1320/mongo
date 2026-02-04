import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { Loader2, Calendar, AlertCircle } from "lucide-react";
import "./SelectionDetailsPage.css";

const SelectionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  // Selection states
  const [selectedTop, setSelectedTop] = useState("");
  const [selectedBottom, setSelectedBottom] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/selection/${id}`);
        const data = response.data.data;
        setSelection(data);
        // Set initial image
        setSelectedImage(
          data.photos?.[0] ||
            data.photo ||
            "https://via.placeholder.com/600x800",
        );
      } catch (err) {
        console.error("Error fetching details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    setBookingLoading(true);

    // Validation
    if (new Date(startDate) >= new Date(endDate)) {
      setError("End date must be after start date");
      setBookingLoading(false);
      return;
    }

    if (selection.topSizes?.length > 0 && !selectedTop) {
      setError("Please select a Top Size");
      setBookingLoading(false);
      return;
    }
    if (selection.bottomSizes?.length > 0 && !selectedBottom) {
      setError("Please select a Bottom Size");
      setBookingLoading(false);
      return;
    }
    if (selection.colors?.length > 0 && !selectedColor) {
      setError("Please select a Color");
      setBookingLoading(false);
      return;
    }

    try {
      const itemPayload = {
        selection_id: id,
        deposit: selection.price * 0.5,
        pay: selection.price,
        selectedTopSize: selectedTop,
        selectedBottomSize: selectedBottom,
        selectedColor: selectedColor,
        deliver_date: startDate,
        receive_date: endDate,
      };

      // Wrap in items array for the Order API
      await api.post("/order", { items: [itemPayload] });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex-center" style={{ height: "50vh" }}>
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!selection)
    return <div className="text-center py-5">Selection not found</div>;

  const photos =
    selection.photos && selection.photos.length > 0
      ? selection.photos
      : [selection.photo || "https://via.placeholder.com/600x800"];

  return (
    <div className="details-page container">
      <div className="details-grid">
        {/* Image Section */}
        <div className="details-media">
          <div className="details-image-container">
            <img
              src={selectedImage}
              alt={selection.name}
              className="details-image"
            />
          </div>
          {/* Thumbnails */}
          {photos.length > 1 && (
            <div
              className="details-thumbnails"
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "1rem",
                overflowX: "auto",
              }}
            >
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImage(photo)}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border:
                      selectedImage === photo
                        ? "2px solid var(--primary)"
                        : "2px solid transparent",
                    opacity: selectedImage === photo ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="details-info">
          <div style={{ marginBottom: "1rem" }}>
            <span
              className="status-badge"
              style={{
                background: "#f3f4f6",
                color: "#4b5563",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {selection.category || "General"}
            </span>
          </div>
          <h1>{selection.name}</h1>
          <p className="details-sku">SKU: {selection.SKU}</p>

          <div
            className="details-description"
            style={{
              color: "var(--text-muted)",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
            }}
          >
            {selection.description || "No description available for this item."}
          </div>

          <div className="details-specs">
            <div className="specs-row">
              <span style={{ color: "var(--text-muted)" }}>Available Tops</span>
              <span>
                {selection.topSizes?.length > 0
                  ? selection.topSizes.join(", ")
                  : "N/A"}
              </span>
            </div>
            <div className="specs-row">
              <span style={{ color: "var(--text-muted)" }}>
                Available Bottoms
              </span>
              <span>
                {selection.bottomSizes?.length > 0
                  ? selection.bottomSizes.join(", ")
                  : "N/A"}
              </span>
            </div>
            <div className="specs-row">
              <span style={{ color: "var(--text-muted)" }}>Colors</span>
              <span>
                {selection.colors?.length > 0
                  ? selection.colors.join(", ")
                  : "N/A"}
              </span>
            </div>
            <div
              className="specs-row"
              style={{
                marginTop: "0.5rem",
                borderTop: "1px dashed #e5e7eb",
                paddingTop: "0.5rem",
              }}
            >
              <span style={{ fontWeight: 600 }}>Rent Price</span>
              <span className="highlight-price">₹{selection.price}</span>
            </div>
          </div>

          {/* Variety Selection */}
          <div style={{ margin: "1.5rem 0" }}>
            {selection.topSizes?.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <span
                  style={{
                    display: "block",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Top Size
                </span>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {selection.topSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedTop(s)}
                      style={{
                        padding: "0.5rem 1rem",
                        border:
                          selectedTop === s
                            ? "2px solid var(--primary)"
                            : "1px solid #e5e7eb",
                        borderRadius: "6px",
                        background: selectedTop === s ? "#eff6ff" : "white",
                        color: selectedTop === s ? "var(--primary)" : "#374151",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selection.bottomSizes?.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <span
                  style={{
                    display: "block",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Bottom Size
                </span>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {selection.bottomSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedBottom(s)}
                      style={{
                        padding: "0.5rem 1rem",
                        border:
                          selectedBottom === s
                            ? "2px solid var(--primary)"
                            : "1px solid #e5e7eb",
                        borderRadius: "6px",
                        background: selectedBottom === s ? "#eff6ff" : "white",
                        color:
                          selectedBottom === s ? "var(--primary)" : "#374151",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selection.colors?.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <span
                  style={{
                    display: "block",
                    fontWeight: 500,
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Color
                </span>
                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  {selection.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      style={{
                        padding: "0.5rem 1rem",
                        border:
                          selectedColor === c
                            ? "2px solid var(--primary)"
                            : "1px solid #e5e7eb",
                        borderRadius: "6px",
                        background: selectedColor === c ? "#eff6ff" : "white",
                        color:
                          selectedColor === c ? "var(--primary)" : "#374151",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <div className="booking-form">
            <h3
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Calendar size={20} style={{ marginRight: "0.5rem" }} /> Book
              Dates
            </h3>

            {error && (
              <div
                style={{
                  background: "#fff5f5",
                  color: "var(--error)",
                  padding: "0.75rem",
                  borderRadius: "4px",
                  marginBottom: "1rem",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AlertCircle size={16} style={{ marginRight: "0.5rem" }} />{" "}
                {error}
              </div>
            )}

            <form onSubmit={handleBooking}>
              <div className="date-grid">
                <Input
                  label="From"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <Input
                  label="To"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                style={{ width: "100%" }}
                size="lg"
                isLoading={bookingLoading}
              >
                {user ? "Confirm Booking" : "Login to Book"}
              </Button>
              <p
                style={{
                  fontSize: "0.8rem",
                  textAlign: "center",
                  marginTop: "1rem",
                  color: "var(--text-muted)",
                }}
              >
                50% deposit required to confirm.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionDetailsPage;

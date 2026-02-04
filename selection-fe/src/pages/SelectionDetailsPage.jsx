import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Loader2, Calendar, AlertCircle, ShoppingBag } from "lucide-react";
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

  const { addToCart } = useCart(); // Use Cart Context

  const handleAddToCart = (e) => {
    e.preventDefault();
    setError("");

    // Variant Validation
    if (selection.topSizes?.length > 0 && !selectedTop) {
      setError("Please select a Top Size");
      return;
    }
    if (selection.bottomSizes?.length > 0 && !selectedBottom) {
      setError("Please select a Bottom Size");
      return;
    }
    if (selection.colors?.length > 0 && !selectedColor) {
      setError("Please select a Color");
      return;
    }

    // Add to Cart Logic
    const cartItem = {
      ...selection,
      selectedTopSize: selectedTop,
      selectedBottomSize: selectedBottom,
      selectedColor: selectedColor,
      uniqueId: Date.now(), // Simple unique ID for cart
    };

    addToCart(cartItem);
  };

  if (loading)
    return (
      <div className="flex-center" style={{ minHeight: "80vh" }}>
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  if (!selection)
    return <div className="text-center py-5">Selection not found</div>;

  const photos =
    selection.photos && selection.photos.length > 0
      ? selection.photos
      : [selection.photo || "https://via.placeholder.com/600x800"];

  return (
    <div className="details-container">
      <div className="details-wrapper">
        {/* Left Column: Media */}
        <div className="product-media">
          <div className="main-image-frame">
            <img src={selectedImage} alt={selection.name} />
          </div>
          {photos.length > 1 && (
            <div className="thumbnail-list">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={`thumb-item ${selectedImage === photo ? "active" : ""}`}
                  onClick={() => setSelectedImage(photo)}
                >
                  <img src={photo} alt={`Thumb ${index}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className="product-info">
          <div className="info-header">
            <p className="product-category">
              {selection.category || "Collection"}
            </p>
            <h1 className="product-name">{selection.name}</h1>
            <p className="product-sku">SKU: {selection.SKU}</p>
            <h2 className="product-price">
              ₹{selection.price.toLocaleString()}
            </h2>
          </div>

          <div className="product-description">
            <p>
              {selection.description ||
                "Detailed description not available for this exclusive piece."}
            </p>
          </div>

          <div className="divider"></div>

          {/* Variants */}
          <div className="variant-section">
            {/* Top Size */}
            {selection.topSizes?.length > 0 && (
              <div className="selector-group">
                <label>
                  Top Size: <span className="selected-val">{selectedTop}</span>
                </label>
                <div className="options-grid">
                  {selection.topSizes.map((s) => (
                    <button
                      key={s}
                      className={`option-btn ${selectedTop === s ? "selected" : ""}`}
                      onClick={() => setSelectedTop(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Size */}
            {selection.bottomSizes?.length > 0 && (
              <div className="selector-group">
                <label>
                  Bottom Size:{" "}
                  <span className="selected-val">{selectedBottom}</span>
                </label>
                <div className="options-grid">
                  {selection.bottomSizes.map((s) => (
                    <button
                      key={s}
                      className={`option-btn ${selectedBottom === s ? "selected" : ""}`}
                      onClick={() => setSelectedBottom(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {selection.colors?.length > 0 && (
              <div className="selector-group">
                <label>
                  Color: <span className="selected-val">{selectedColor}</span>
                </label>
                <div className="options-grid">
                  {selection.colors.map((c) => (
                    <button
                      key={c}
                      className={`option-btn ${selectedColor === c ? "selected" : ""}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Action */}
          <div className="booking-actions">
            {error && (
              <div className="error-alert">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                marginTop: "1rem",
                height: "48px",
                fontSize: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <ShoppingBag size={20} /> Add to Cart
            </Button>
            <p className="deposit-note">Select your dates at checkout.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionDetailsPage;

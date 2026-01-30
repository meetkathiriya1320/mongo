import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Button from "../common/Button";
import Input from "../common/Input";
import { Loader2, Plus, Trash, Edit, X } from "lucide-react";

import toast from "react-hot-toast";
import { showConfirmationToast } from "../../utils/toastUtils";

const AdminSelections = () => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "Wedding",
    price: "",
    SKU: "",
    photos: [""],
    up_color: "Red",
    up_size: "M",
    dawn_color: "Red",
    dawn_size: "M",
  });

  useEffect(() => {
    fetchSelections();
    fetchCategories();
  }, []);

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/category");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchSelections = async () => {
    try {
      const response = await api.get("/selection");
      setSelections(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    showConfirmationToast("Delete this item?", async () => {
      try {
        await api.delete(`/selection/${id}`);
        setSelections((prev) => prev.filter((s) => s._id !== id));
        toast.success("Selection deleted");
      } catch (error) {
        toast.error("Failed to delete");
      }
    });
  };

  const handleEdit = (selection) => {
    setCurrentSelection(selection);
    // Ensure photos array exists
    const photos =
      selection.photos && selection.photos.length > 0
        ? selection.photos
        : [selection.photo || ""];
    setFormData({
      ...selection,
      photos,
      topSizes: selection.topSizes?.join(", ") || "",
      bottomSizes: selection.bottomSizes?.join(", ") || "",
      colors: selection.colors?.join(", ") || "",
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentSelection(null);
    setFormData({
      name: "",
      category: "Wedding",
      price: "",
      SKU: "",
      photos: [""],
      up_color: "Red",
      up_size: "M",
      dawn_color: "Red",
      dawn_size: "M",
      topSizes: "",
      bottomSizes: "",
      colors: "",
    });
    setIsEditing(true);
  };

  const handlePhotoChange = (index, value) => {
    const newPhotos = [...formData.photos];
    newPhotos[index] = value;
    setFormData({ ...formData, photos: newPhotos });
  };

  const addPhotoField = () => {
    setFormData({ ...formData, photos: [...formData.photos, ""] });
  };

  const removePhotoField = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Filter out empty photo strings
      const payload = {
        ...formData,
        photos: formData.photos.filter((p) => p.trim() !== ""),
        topSizes: formData.topSizes
          ? formData.topSizes.split(",").map((s) => s.trim())
          : [],
        bottomSizes: formData.bottomSizes
          ? formData.bottomSizes.split(",").map((s) => s.trim())
          : [],
        colors: formData.colors
          ? formData.colors.split(",").map((s) => s.trim())
          : [],
      };

      if (currentSelection) {
        await api.put(`/selection/${currentSelection._id}`, payload);
        toast.success("Selection updated");
      } else {
        await api.post("/selection", payload);
        toast.success("Selection created");
      }
      setIsEditing(false);
      fetchSelections();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      setLoading(true); // temporary loading
      const response = await api.post("/upload", formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newPhotos = [...formData.photos];
      newPhotos[index] = response.data.data.url;
      setFormData({ ...formData, photos: newPhotos });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
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
        <h2 className="admin-section-title">Manage Selections</h2>
        {!isEditing && (
          <Button variant="primary" size="sm" onClick={handleAddNew}>
            <Plus size={16} style={{ marginRight: "0.5rem" }} /> Add New
          </Button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="admin-form">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h3>{currentSelection ? "Edit Item" : "New Item"}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>

          <div className="form-grid">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="SKU"
              value={formData.SKU}
              onChange={(e) =>
                setFormData({ ...formData, SKU: e.target.value })
              }
              required
            />
          </div>
          <div className="form-grid">
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "white",
                  fontFamily: "inherit",
                }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: 500,
                fontSize: "0.9rem",
              }}
            >
              Photo URLs
            </label>
            {formData.photos.map((photo, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <Input
                  value={photo}
                  onChange={(e) => handlePhotoChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{ flexGrow: 1, marginBottom: 0, display: "none" }}
                />

                {/* Preview or Fallback */}
                {photo ? (
                  <div
                    style={{
                      flexGrow: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "0.5rem",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <img
                      src={photo}
                      alt="Preview"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {photo.split("/").pop()}
                    </span>
                  </div>
                ) : (
                  <div style={{ flexGrow: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(index, e.target.files[0])
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                      }}
                    />
                  </div>
                )}
                {formData.photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhotoField(index)}
                    style={{
                      background: "none",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      padding: "0 0.75rem",
                      color: "var(--error)",
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPhotoField}
              style={{ marginTop: "0.5rem" }}
            >
              <Plus size={14} style={{ marginRight: "0.25rem" }} /> Add Another
              Photo
            </Button>
          </div>

          <div className="form-grid">
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Available Top Sizes
              </label>
              <select
                onChange={(e) => {
                  if (
                    e.target.value &&
                    !formData.topSizes.includes(e.target.value)
                  ) {
                    const current = formData.topSizes
                      ? formData.topSizes.split(", ").filter((x) => x)
                      : [];
                    setFormData({
                      ...formData,
                      topSizes: [...current, e.target.value].join(", "),
                    });
                  }
                  e.target.value = "";
                }}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "white",
                  marginBottom: "0.5rem",
                }}
              >
                <option value="">Select Top Size</option>
                {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {formData.topSizes &&
                  formData.topSizes
                    .split(", ")
                    .filter((x) => x)
                    .map((s, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {s}
                        <X
                          size={12}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const newSizes = formData.topSizes
                              .split(", ")
                              .filter((x) => x)
                              .filter((item) => item !== s)
                              .join(", ");
                            setFormData({ ...formData, topSizes: newSizes });
                          }}
                        />
                      </span>
                    ))}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Available Bottom Sizes
              </label>
              <select
                onChange={(e) => {
                  if (
                    e.target.value &&
                    !formData.bottomSizes.includes(e.target.value)
                  ) {
                    const current = formData.bottomSizes
                      ? formData.bottomSizes.split(", ").filter((x) => x)
                      : [];
                    setFormData({
                      ...formData,
                      bottomSizes: [...current, e.target.value].join(", "),
                    });
                  }
                  e.target.value = "";
                }}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  background: "white",
                  marginBottom: "0.5rem",
                }}
              >
                <option value="">Select Bottom Size</option>
                {[
                  "28",
                  "30",
                  "32",
                  "34",
                  "36",
                  "38",
                  "40",
                  "42",
                  "44",
                  "46",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {formData.bottomSizes &&
                  formData.bottomSizes
                    .split(", ")
                    .filter((x) => x)
                    .map((s, i) => (
                      <span
                        key={i}
                        style={{
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {s}
                        <X
                          size={12}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const newSizes = formData.bottomSizes
                              .split(", ")
                              .filter((x) => x)
                              .filter((item) => item !== s)
                              .join(", ");
                            setFormData({ ...formData, bottomSizes: newSizes });
                          }}
                        />
                      </span>
                    ))}
              </div>
            </div>
          </div>

          <div className="form-grid">
            <Input
              label="Available Colors (Red, Blue...)"
              value={formData.colors}
              onChange={(e) =>
                setFormData({ ...formData, colors: e.target.value })
              }
              placeholder="e.g. Red, Blue, Black"
            />
          </div>

          <Button type="submit" style={{ width: "100%", marginTop: "1rem" }}>
            Save Item
          </Button>
        </form>
      ) : (
        <div className="items-grid">
          {selections.map((item) => (
            <div key={item._id} className="item-row">
              <div className="flex" style={{ gap: "0.25rem" }}>
                <img
                  src={
                    item.photos?.[0] ||
                    item.photo ||
                    "https://via.placeholder.com/100"
                  }
                  alt=""
                  className="item-image"
                />
                {item.photos?.length > 1 && (
                  <div
                    style={{
                      width: "20px",
                      background: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      borderRadius: "4px",
                    }}
                  >
                    +{item.photos.length - 1}
                  </div>
                )}
              </div>

              <div className="item-info">
                <h4 className="item-title">{item.name}</h4>
                <p className="item-meta">
                  ₹{item.price} | SKU: {item.SKU}
                </p>
              </div>
              <div className="item-actions">
                <button className="action-btn" onClick={() => handleEdit(item)}>
                  <Edit size={18} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSelections;

import React, { useState, useEffect } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { motion } from "framer-motion";
import { Loader2, Filter } from "lucide-react";
import "./SelectionsPage.css";

const SelectionsPage = () => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "All";
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/category");
        const catNames = ["All", ...response.data.data.map((c) => c.name)];
        setCategories(catNames);
      } catch (e) {
        console.error(e);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    const fetchSelections = async () => {
      setLoading(true);
      try {
        const query =
          currentCategory === "All" ? "" : `?category=${currentCategory}`;
        const response = await api.get(`/selection${query}`);
        setSelections(response.data.data);
      } catch (error) {
        console.error("Failed to fetch selections", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelections();
  }, [currentCategory]);

  const handleCategoryChange = (category) => {
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="selections-page container">
      <div className="selections-header">
        <div>
          <h1>Our Collection</h1>
          <p style={{ color: "var(--text-muted)" }}>
            Explore our wide range of exclusive wear.
          </p>
        </div>

        <div className="filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`filter-btn ${currentCategory === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: "5rem 0" }}>
          <Loader2 className="animate-spin" color="var(--primary)" size={32} />
        </div>
      ) : (
        <div className="selection-grid">
          {selections.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/selections/${item._id}`}>
                <Card hover style={{ padding: 0, height: "100%" }}>
                  <div
                    style={{
                      aspectRatio: "3/4",
                      position: "relative",
                      background: "#f0f0f0",
                    }}
                  >
                    <img
                      src={
                        item.photos?.[0] ||
                        item.photo ||
                        "https://via.placeholder.com/400x600"
                      }
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "white",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {item.category || "Exclusive"}
                    </div>
                  </div>
                  <div className="selection-card-content">
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>
                      {item.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        marginBottom: "1rem",
                      }}
                    >
                      SKU: {item.SKU}
                    </p>
                    <div className="flex-between">
                      <span className="selection-price">₹{item.price}</span>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && selections.length === 0 && (
        <div className="empty-state">
          <Filter size={48} style={{ opacity: 0.2, margin: "0 auto 1rem" }} />
          <p>No items found in this category.</p>
          <Button
            variant="ghost"
            onClick={() => handleCategoryChange("All")}
            style={{ marginTop: "1rem" }}
          >
            View All
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectionsPage;

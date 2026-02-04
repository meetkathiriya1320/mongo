import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { Loader2, Search, SlidersHorizontal, ChevronRight } from "lucide-react"; // Added standard icons
import "./SelectionsPage.css";

const SelectionsPage = () => {
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "All";
  const [categories, setCategories] = useState(["All"]);

  // Fetch Categories
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

  // State for sidebar collapse
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  // Fetch Selections
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
    setIsMobileFilterOpen(false); // Close mobile menu on select
  };

  // Helper to toggle category section
  const toggleCategories = () => {
    setIsCategoryExpanded(!isCategoryExpanded);
  };

  return (
    <div className="selections-page">
      <div className="container">
        {/* Simple Header with Breadcrumb-style feel */}
        <header className="page-header">
          <div className="header-text">
            <h1>Shop Selections</h1>
            <p>{selections.length} products found</p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            className="mobile-filter-toggle"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </header>

        <div className="shop-layout">
          {/* Sidebar Filters */}
          <aside className={`shop-sidebar ${isMobileFilterOpen ? "open" : ""}`}>
            {/* Collapsible Category Section */}
            <div className="sidebar-section">
              <div className="section-header" onClick={toggleCategories}>
                <h3>Categories</h3>
                <ChevronRight
                  size={16}
                  className={`section-arrow ${isCategoryExpanded ? "rotated" : ""}`}
                />
              </div>

              <div
                className={`section-content ${isCategoryExpanded ? "expanded" : "collapsed"}`}
              >
                <ul className="category-list">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategoryChange(cat)}
                        className={`cat-btn ${currentCategory === cat ? "active" : ""}`}
                      >
                        {cat}
                        {currentCategory === cat && <ChevronRight size={14} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="shop-content">
            {loading ? (
              <div className="flex-center" style={{ minHeight: "300px" }}>
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : (
              <>
                {selections.length > 0 ? (
                  <div className="product-grid">
                    {selections.map((item) => (
                      <Link
                        to={`/selections/${item._id}`}
                        key={item._id}
                        className="product-card"
                      >
                        <div className="img-wrapper">
                          <img
                            src={
                              item.photos?.[0] ||
                              item.photo ||
                              "https://via.placeholder.com/400x500"
                            }
                            alt={item.name}
                          />
                        </div>
                        <div className="product-details">
                          <div className="product-meta">
                            <span className="category-tag">
                              {item.category}
                            </span>
                          </div>
                          <h3 className="product-title">{item.name}</h3>
                          <div className="product-footer">
                            <span className="price">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <button className="btn-view">View</button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <p>No products found in this category.</p>
                    <button
                      onClick={() => handleCategoryChange("All")}
                      className="btn-reset"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SelectionsPage;

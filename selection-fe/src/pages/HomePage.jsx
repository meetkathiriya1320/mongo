import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./HomePage.css";

const HomePage = () => {
  const [banners, setBanners] = useState([]);
  const [featuredCategories, setFeaturedCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, catRes] = await Promise.all([
          api.get("/banner"),
          api.get("/category"),
        ]);

        setBanners(bannerRes.data.data.filter((b) => b.isActive));

        // Filter featured categories
        const featured = catRes.data.data.filter(
          (c) => c.isFeatured && c.isActive,
        );
        setFeaturedCategories(featured);
      } catch (err) {
        console.error("Failed to load data");
      }
    };
    fetchData();
  }, []);

  const heroImage =
    banners.length > 0
      ? banners[0].image
      : "https://images.unsplash.com/photo-1510070263660-60b13854d6af?q=80&w=2071&auto=format&fit=crop";
  const heroTitle = banners.length > 0 ? banners[0].title : "Define Your Style";

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <img src={heroImage} alt="Hero" className="hero-bg" />

        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            {heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Exclusive selections for your special moments. Discover our premium
            collection today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/selections">
              <Button
                size="lg"
                className="bg-white text-black hover:opacity-90"
                style={{ backgroundColor: "white", color: "black" }}
              >
                Explore Selections
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <h2>Curated Collections</h2>
            <p className="text-muted">Handpicked pieces for every occasion.</p>
          </div>

          <div className="grid-3">
            {featuredCategories.length > 0 ? (
              featuredCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="category-card"
                >
                  <img
                    src={
                      category.image ||
                      `https://source.unsplash.com/random/800x1000?fashion,${category.name}`
                    }
                    alt={category.name}
                    className="cat-img"
                  />
                  <div className="cat-overlay">
                    <h3>{category.name}</h3>
                    <Link
                      to={`/selections?category=${category.name}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0.5rem",
                      }}
                    >
                      Shop Now{" "}
                      <ArrowRight size={16} style={{ marginLeft: "8px" }} />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <p
                className="text-muted text-center"
                style={{ gridColumn: "1/-1" }}
              >
                No featured collections yet. Check back soon!
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

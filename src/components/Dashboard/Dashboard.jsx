import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Card, CardMedia } from "@mui/material";

import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Cards from "./CardsList";
import Hero from "./Hero";
import { HeaderSection } from "../HeaderSection/HeaderSection";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Active card index for auto-scroll functionality
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for scroll management
  const scrollRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const resumeTimer = useRef(null);

  /**
   * Handle manager card click and navigation with loading state
   * @param {string} section - Management section to navigate to
   * @param {string} page - Page type (default: "vessel")
   */
  const handleCardClick = (section, page = "general-ledger") => {
    setLoading(true);
    // Simulate loading time for better UX
    setTimeout(() => {
      setLoading(false);
      navigate(`/${section}/${page}`);
    }, 1000);
  };

  /**
   * Auto-scroll functionality for manager cards
   * Provides smooth scrolling with pause on user interaction
   */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const cards = container.children;
    let index = 0;

    const scrollToCard = () => {
      if (!cards.length) return;

      setActiveIndex(index);

      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      index = (index + 1) % cards.length;
    };

    // Start auto-scroll timer
    autoScrollTimer.current = setInterval(scrollToCard, 2600);

    // Handle user scroll interruption
    const handleUserScroll = () => {
      clearInterval(autoScrollTimer.current);
      clearTimeout(resumeTimer.current);

      // Resume auto-scroll after user stops scrolling
      resumeTimer.current = setTimeout(() => {
        autoScrollTimer.current = setInterval(scrollToCard, 1000);
      }, 600);
    };

    container.addEventListener("scroll", handleUserScroll);

    // Cleanup on component unmount
    return () => {
      clearInterval(autoScrollTimer.current);
      clearTimeout(resumeTimer.current);
      container.removeEventListener("scroll", handleUserScroll);
    };
  }, []);

  return (
    <>
      {/* Loading overlay with maritime-themed animation */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box className="ship-dot" />
            <Box className="ship-dot" />
            <Box className="ship-dot" />
          </Box>

          <Typography
            sx={{
              color: "#fff",
              mt: 3,
              fontFamily: "Fjalla One",
              fontSize: "1.1rem",
            }}
          >
            Loading Please Wait...
          </Typography>
        </Box>
      )}



      {/* Main dashboard section with background */}
      <section className="dashboard-section">
        <div className="background-image" />
        <div className="overlay" />

        <div className="dashboard-content">
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "80vh",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            {/* Left side - Hero section */}
            <Hero />
            
            {/* Right side - Manager selection */}
            <Cards onCardClick={handleCardClick} />
          </Box>
        </div>
      </section>
    </>
  );
};

export default Dashboard

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Card, CardMedia } from "@mui/material";

import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Cards from "./CardsList";
import Hero from "./Hero";
import { HeaderSection } from "../HeaderSection/HeaderSection";
import LoadingScreen from "../common/LoadingScreen";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();

  // Active card index for auto-scroll functionality
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for scroll management
  const scrollRef = useRef(null);
  const autoScrollTimer = useRef(null);
  const resumeTimer = useRef(null);

  /**
   * Handle manager card click and navigation
   * @param {string} section - Management section to navigate to
   * @param {string} page - Page type (default: "vessel")
   */
  const handleCardClick = (section, page = "general-ledger") => {
    setLoading(true);
    setLoadingMessage("Loading page...");
    setTimeout(() => {
      setLoading(false);
      navigate(`/${section}/${page}`);
    }, 800);
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

      <LoadingScreen open={loading} message={loadingMessage} />
    </>
  );
};

export default Dashboard

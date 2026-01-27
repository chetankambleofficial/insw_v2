import React, { useEffect, useRef, useState } from "react";
import { Box, Skeleton, Card as MuiCard } from "@mui/material";
import "./style.css";

import CardComponent from "./Card";

// Images
import vessel3 from "/public/images/vessel4.jpg";
import vessel4 from "/public/images/vessel5.jpg";
import vessel5 from "/public/images/vessel6.jpg";
import vessel6 from "/public/images/vessel7.jpg";
import vessel7 from "/public/images/vessel3.jpg";

export default function CardsList({ onCardClick }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [managers, setManagers] = useState([]);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCards, setShowCards] = useState(false);

  const images = [vessel3, vessel4, vessel5, vessel6, vessel7];

  // ✅ STATIC DATA
  const STATIC_MANAGERS = [
    "AETMS",
    "V.Ships"
    
  ];

  // Load static data (keeps skeleton animation)
  useEffect(() => {
    setTimeout(() => {
      setManagers(STATIC_MANAGERS);
      setIsLoading(false);
      setTimeout(() => setShowCards(true), 100);
    }, 1000);
  }, []);

  // Auto-scroll (unchanged logic)
  useEffect(() => {
    if (isLoading) return;

    const container = scrollRef.current;
    if (!container || managers.length === 0) return;

    const cards = container.children;
    let index = 0;
    let scrollTimer;

    const scrollToCard = () => {
      if (!cards.length || isUserScrolling) return;

      setActiveIndex(index);
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      index = (index + 1) % cards.length;
    };

    const handleUserScroll = () => {
      setIsUserScrolling(true);
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsUserScrolling(false), 2000);
    };

    container.addEventListener("scroll", handleUserScroll);
    const timer = setInterval(scrollToCard, 1000);

    return () => {
      clearInterval(timer);
      clearTimeout(scrollTimer);
      container.removeEventListener("scroll", handleUserScroll);
    };
  }, [managers, isUserScrolling, isLoading]);

  // Loading skeleton (unchanged)
  if (isLoading) {
    return (
      <Box sx={{ width: "40%", pl: 5 }}>
        {[...Array(2)].map((_, idx) => (
          <MuiCard key={idx} className="card-animate">
            <Skeleton variant="rectangular" height={180} />
          </MuiCard>
        ))}
      </Box>
    );
  }

  return (
    <Box
      ref={scrollRef}
      className="wheel-container"
      sx={{
        width: "40%",
        maxHeight: "75vh",
        overflowY: "auto",
        display: "grid",
        gap: 4,
        scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
        pl: 5,
        opacity: showCards ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
    >
      {managers.map((manager, idx) => {
        const isActive = idx === activeIndex;
        const isPrev =
          idx === activeIndex - 1 ||
          (activeIndex === 0 && idx === managers.length - 1);
        const isNext =
          idx === activeIndex + 1 ||
          (activeIndex === managers.length - 1 && idx === 0);

        let wheelClass = "wheel-card";
        if (isActive) wheelClass += " active";
        else if (isPrev) wheelClass += " prev";
        else if (isNext) wheelClass += " next";
        else wheelClass += " far";

        return (
          <CardComponent
            key={manager}
            manager={manager}
            image={images[idx % images.length]}
            wheelClass={wheelClass}
            onClick={() => onCardClick?.(manager)}
          />
        );
      })}
    </Box>
  );
}

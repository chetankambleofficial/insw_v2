
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 4,
        animation: "fadeUp 1s ease forwards", // CSS animation for entrance effect
      }}
    >
      {/* Main heading with animated underline effect */}
      <Typography
        className="animated-underline"
        sx={{
          color: "white",
          fontFamily: "Fjalla One",
          fontSize: 80,
          lineHeight: 1.15,
          mb: 3,
        }}
      >
        WELCOME TO THE
        <br />
        {/* Company name with special styling */}
        <span
          style={{
            whiteSpace: "nowrap",
            color: "#000",
            WebkitTextStroke: "1.5px white", // Text outline effect
            padding: "4px 8px",
            display: "inline-block",
          }}
        >
          INTERNATIONAL SEAWAYS
        </span>
        <br />
        PORTAL
      </Typography>

      {/* Descriptive text about the dashboard */}
      <Typography
        sx={{
          color: "rgba(255,255,255,0.85)",
          fontFamily: "Space Grotesk",
          fontSize: "1.4rem",
          maxWidth: "90%",
        }}
      >
        This dashboard provides an overview of our fleet operations and
        company updates. Explore vessel information, ongoing projects,
        and key metrics across our global fleet.
      </Typography>
      {/* Call-to-action button */}
<Button
  variant="outlined"
  sx={{
    mt: 4,
    px: 5,
    py: 1.5,
    fontSize: "1rem",
    fontWeight: 600,
    letterSpacing: "0.05em",
    color: "#fff",
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: "30px",
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#184a70",
      borderColor: "#ffffff",
      transform: "translateY(-2px)",
    },
  }}
 onClick={() => navigate("/insw-vessels")}
>
  INSW FleetList
</Button>

    </Box>
  );
};

export default Hero;

import { Box } from "@mui/material";
import React from "react";

export const NavLink = ({ label, isActive, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        position: "relative",
        fontFamily: "Space Grotesk",
        color: isActive ? "#ffffff" : "#c7c9d9",
        backgroundColor: isActive ? "#004781ff" : "transparent",
        padding: "8px 16px",
        borderRadius: "5px 5px 0 0",
        fontWeight: 600,
        fontSize: "15px",
        transition: "all 0.3s ease",

        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          bottom: 0,
          width: isActive ? "100%" : "0%",
          height: "2px",
          bgcolor: "#4f7cff",
          transition: "width 0.35s ease",
        },

        "&:hover": {
          color: "#ffffff",
        },

        "&:hover::after": {
          width: "100%",
        },
      }}
    >
      {label}
    </Box>
  );
};

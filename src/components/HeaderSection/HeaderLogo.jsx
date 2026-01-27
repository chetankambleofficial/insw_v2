import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

export const HeaderLogo = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="img"
      alt="Logo"
      src="https://c.animaapp.com/mgrxz7o3oIDiS4/img/logo.png"
      sx={{ width: 120, height: 80, objectFit: "cover", cursor: "pointer" }}
      onClick={() => navigate("/")}
    />
  );
};

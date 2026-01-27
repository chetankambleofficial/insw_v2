import { Stack, Typography } from "@mui/material";
import React from "react";
import { NavLink } from "./NavLink";
import { useLocation } from "react-router-dom";

export const NavMenu = ({ section, navLinks, handleNavigation }) => {
  const { pathname } = useLocation();

  return (
    <Stack direction="row" spacing={4} alignItems="center">
      {section && section !== "unified" && (
        <Typography
          sx={{
            color: "#ffffff",
            backgroundColor: "#26547cff",
            fontWeight: 700,
            fontSize: "18px",
            fontFamily: "Space Grotesk",
            px: 2,
            py: 1,
            mr: 2,
            borderRadius: "20px",
          }}
        >
          {section === "AETMS" ? "AETMS" : "V-Ships"}
        </Typography>
      )}

      {navLinks.map((link) => {
        const isActive =
          pathname === link.path ||
          pathname.startsWith(link.path + "/");

        return (
          <NavLink
            key={link.path}
            label={link.label}
            isActive={isActive}
            onClick={() => handleNavigation(link.path)}
          />
        );
      })}
    </Stack>
  );
};

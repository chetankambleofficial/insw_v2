import React, { useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import { HeaderLogo } from "./headerLogo";
import { NavMenu } from "./NavMenu";
import { useLocation } from "react-router-dom";

export const HeaderSection = ({ section = "ae", activeMenu = null, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  // 🔹 Detect current section from URL
  const currentSection = pathname.includes("/AETMS/")
    ? "AETMS"
    : pathname.includes("/V.Ships/")
    ? "V.Ships"
    : null;

  // 🔹 Base path for section-based routing
  const basePath =
    currentSection === "AETMS"
      ? "/AETMS"
      : currentSection === "V.Ships"
      ? "/V.Ships"
      : "";

  const handleNavigation = (path) => {
    if (onNavigate) {
      setLoading(true);
      onNavigate(path);
      setLoading(false);
    }
  };

  // 🔹 Pages where Dashboard button should be visible
  const showDashboard =
    pathname === "/AETMS/general-ledger" ||
    pathname === "/V.Ships/general-ledger" ||
     pathname === "/V.Ships/openbill-request" ||
      pathname === "/AETMS/openbill-request" ||
    pathname === "/insw-vessels";

  // 🔹 Navigation links
  const navLinks = [
    ...(showDashboard ? [{ label: "Dashboard", path: "/" }] : []),

    ...(basePath
      ? [
          {
            label: "General Ledger",
            path: `${basePath}/general-ledger`,
          },
          {
            label: "Open Bill Request",
            path: `${basePath}/openbill-request`,
          },
        ]
      : []),
  ];

  return (
    <>
      {loading && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 2000,
          }}
        />
      )}

      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: 96,
          bgcolor: "#1a1f36",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          zIndex: 1000,
        }}
      >
        {/* 🔹 Left: Logo */}
        <HeaderLogo />

        {/* 🔹 Center: Navigation */}
        <NavMenu
          section={currentSection}
          navLinks={navLinks}
          activeMenu={activeMenu}
          handleNavigation={handleNavigation}
        />

        {/* 🔹 Right spacer */}
        <Box sx={{ width: 200 }} />
      </Box>
    </>
  );
};

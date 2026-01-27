import React from "react";
import { Box, Typography } from "@mui/material";

const LedgerLoading = () => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      bgcolor: "rgba(0,0,0,0.85)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <Typography color="#fff">Loading records...</Typography>
  </Box>
);

export default LedgerLoading;

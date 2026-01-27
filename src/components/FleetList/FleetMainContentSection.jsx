import React, { useState } from "react";
import {
  Box,
  Chip,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const FleetMainContentSection = ({
  recordCount = 0,
  searchQuery,
  setSearchQuery,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery || "");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearchQuery("");
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 96,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        py: 2,
        bgcolor: "white",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* LEFT SIDE */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography variant="h5" fontWeight={600} fontSize={20}>
          Vessel Details
        </Typography>

        <Chip
          label={`${recordCount} Vessels`}
          sx={{
            bgcolor: "#174bcc1a",
            color: "#174bcc",
            fontWeight: 600,
            fontSize: 14,
            height: "auto",
            px: 1.2,
            py: 0.4,
            borderRadius: "16px",
          }}
        />
      </Stack>

      {/* RIGHT SIDE – SEARCH */}
      <TextField
        placeholder="Search by Vessel Name, IMO, or Manager..."
        value={localSearch}
        onChange={handleSearchChange}
        size="small"
        sx={{
          width: 350,
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": { borderColor: "#174bcc" },
            "&.Mui-focused fieldset": { borderColor: "#174bcc" },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#666" }} />
            </InputAdornment>
          ),
          endAdornment: localSearch && (
            <InputAdornment position="end">
              <ClearIcon
                sx={{
                  cursor: "pointer",
                  color: "#666",
                  "&:hover": { color: "#174bcc" },
                }}
                onClick={clearSearch}
              />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default FleetMainContentSection;

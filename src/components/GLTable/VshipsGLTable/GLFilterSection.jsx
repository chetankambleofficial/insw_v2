import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DownloadIcon from "@mui/icons-material/Download";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const GLFilterSection = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  loading = false,
  setSearchQuery,
  setManualLedgerData,
}) => {
  const [downloadLoading, setDownloadLoading] = useState(false);

  const handleRetrieveLedger = () => {
    // STATIC: just console log
    console.log("Retrieve clicked for period:", startDate?.format("MM-YYYY"));
  };

  const handleClearPeriod = () => {
    setStartDate(null);
    setEndDate(null);
    setManualLedgerData([]);
  };

  const handleDownloadReport = () => {
    // STATIC: no API
    setDownloadLoading(true);
    setTimeout(() => {
      console.log("Download triggered (static)");
      setDownloadLoading(false);
    }, 1000);
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 96,
        height: "calc(100vh - 110px)",
        overflowY: "auto",
        bgcolor: "#f5f5f5",
        borderRight: 1,
        borderColor: "divider",
        p: 3,
        width: "20vw",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        Filters
      </Typography>

      {/* Accounting Period */}
      <Box sx={{ p: 2, bgcolor: "#fff", borderRadius: 2 }}>
        <Stack spacing={2}>
          <Typography fontWeight={600}>
            <CalendarMonthIcon sx={{ mr: 1, fontSize: 18 }} />
            Accounting Period
          </Typography>

          <DatePicker
            views={["year", "month"]}
            label="Select Month & Year"
            value={startDate}
            maxDate={dayjs()}
            onChange={(value) => {
              setStartDate(value);
              setEndDate(value);
            }}
            slotProps={{ textField: { size: "small" } }}
          />

          <Button
            variant="contained"
            onClick={handleRetrieveLedger}
            disabled={!startDate || loading}
          >
            Retrieve
          </Button>

          {startDate && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearPeriod}
            >
              Clear Period
            </Button>
          )}

          {loading && (
            <Stack alignItems="center">
              <CircularProgress size={22} />
              <Typography fontSize={13}>
                Fetching ledger...
              </Typography>
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Reset Filters */}
      <Button
        variant="outlined"
        onClick={() => {
          setStartDate(null);
          setEndDate(null);
          setSearchQuery("");
          setManualLedgerData([]);
        }}
        disabled={loading}
      >
        Reset All Filters
      </Button>

      {/* Push download to bottom */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Download (STATIC) */}
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleDownloadReport}
        disabled={downloadLoading}
        sx={{
          bgcolor: "white",
          color: "#4f7cff",
          borderColor: "#4f7cff",
          borderStyle: "dotted",
          borderWidth: 2,
        }}
      >
        {downloadLoading ? "Downloading..." : "Download Report"}
      </Button>
    </Box>
  );
};

export default GLFilterSection;

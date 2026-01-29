import React from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Switch,
  FormControlLabel,
  TextField,
  MenuItem,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const compactTextFieldSx = {
  "& .MuiInputBase-input": { fontSize: 12, py: "6px" },
  "& .MuiInputLabel-root": { fontSize: 11 },
};

const compactButtonSx = {
  fontSize: 12,
  py: "6px",
  px: "12px",
  minHeight: 32,
  textTransform: "none",
};

const workflowLabels = {
  load: "Load Transactions",
  generate: "Generate GL Entries",
  post: "Post Entries",
};

const GLMainContentSection = ({
  filters,
  setFilters,
  workflow,
  showErrorsOnly,
  setShowErrorsOnly,
  onLoad,
  onGenerate,
  onPost,
  excelFile,
  setExcelFile,
  hasErrors,
  loading,
  uploadSummary,
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setExcelFile(file || null);
  };

  const getProgressColor = (step) => {
    if ((step === "generate" || step === "post") && hasErrors) {
      return "#d32f2f";
    }
    return "#2e7d32";
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        bgcolor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        px: 2.5,
        py: 2,
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "nowrap",
        }}
      >
        {/* TITLE */}
        <Typography fontSize={18} fontWeight={600} sx={{ flexShrink: 0 }}>
          General Ledger
        </Typography>

        {/* WORKFLOW */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 1.5 }}>
           {["load", "generate", "post"].map((step) => (
  <Box key={step} sx={{ textAlign: "center" }}>
    <Typography fontSize={10}>
      {workflowLabels[step]}
    </Typography>

    <LinearProgress
      variant="determinate"
      value={workflow[step] ? 100 : 0}
      sx={{
        width: 100,
        height: 4,
        borderRadius: 2,
        bgcolor: "#e5e7eb",
        "& .MuiLinearProgress-bar": {
          bgcolor: getProgressColor(step),
        },
      }}
    />
  </Box>
))}

          </Box>

          {uploadSummary && (
            <Box sx={{ display: "flex", gap: 8, fontSize: 10, mt: 1, fontWeight:500, whiteSpace: "nowrap" }}>
              <span>Total: <b>{uploadSummary.totalCount}</b></span>
              <span>
                Success:{" "}
                <b style={{ color: "#2e7d32" }}>{uploadSummary.successCount}</b>
              </span>
              <span>
                Errors:{" "}
                <b style={{ color: "#d32f2f" }}>{uploadSummary.errorCount}</b>
              </span>
            </Box>
          )}
        </Box>

        {/* INPUTS & ACTIONS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, backgroundColor:"#ffffff" }}>
          <TextField
            select
            size="small"
            label="Month"
            value={filters.month}
            sx={{ width: 80, ...compactTextFieldSx }}
            onChange={(e) =>
              setFilters((p) => ({ ...p, month: Number(e.target.value) }))
            }
          >
            {Array.from({ length: 12 }, (_, i) => (
              <MenuItem key={i} value={i + 1} sx={{ fontSize: 12 }}>
                {new Date(0, i).toLocaleString("default", { month: "short" })}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Year"
            value={filters.year}
            sx={{ width: 80, ...compactTextFieldSx }}
            onChange={(e) =>
              setFilters((p) => ({ ...p, year: Number(e.target.value) }))
            }
          >
            {[2024, 2025, 2026].map((y) => (
              <MenuItem key={y} value={y} sx={{ fontSize: 12 }}>
                {y}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            size="small"
            label="Date"
            value={filters.effectiveDate}
            sx={{ width: 120, ...compactTextFieldSx }}
            onChange={(e) =>
              setFilters((p) => ({ ...p, effectiveDate: e.target.value }))
            }
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon sx={{ fontSize: 16 }} />}
            sx={{ ...compactButtonSx, minWidth: 90 }}
            disabled={workflow.generate || workflow.post}
          >
            {excelFile ? "Selected" : "Excel"}
            <input type="file" hidden accept=".xls,.xlsx" onChange={handleFileChange} />
          </Button>

          {!workflow.load && (
            <Button
              variant="contained"
              sx={compactButtonSx}
              onClick={() => onLoad(excelFile)}
              disabled={loading}
            >
              Load Transaction
            </Button>
          )}

          {workflow.load && !workflow.generate && (
            <Button variant="contained" sx={compactButtonSx} onClick={onGenerate}>
              Generate GL Entries
            </Button>
          )}

          {workflow.generate && !workflow.post && (
            <Button
              variant="contained"
              sx={compactButtonSx}
              onClick={onPost}
              disabled={hasErrors || loading}
              color={hasErrors ? "error" : "primary"}
            >
              Post Entries
            </Button>
          )}

          {workflow.generate && (
            <FormControlLabel
              sx={{ "& .MuiFormControlLabel-label": { fontSize: 11 } }}
              control={
                <Switch
                  size="small"
                  checked={showErrorsOnly}
                  onChange={(e) => setShowErrorsOnly(e.target.checked)}
                  disabled={!hasErrors || loading}
                />
              }
              label="Errors"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GLMainContentSection;

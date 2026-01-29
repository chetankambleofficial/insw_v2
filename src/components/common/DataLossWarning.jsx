import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Warning } from "@mui/icons-material";

const DataLossWarning = ({ open, onStayHere, onLeaveAnyway, message }) => {
  return (
    <Dialog
      open={open}
      onClose={onStayHere}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Warning sx={{ color: "#ff9800" }} />
        <Typography variant="h6">Unsaved Changes</Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography variant="body1">
            {message || "You have unsaved changes that will be lost if you leave this page."}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onStayHere}
          variant="contained"
          color="primary"
          sx={{ minWidth: 120 }}
        >
          Stay Here
        </Button>
        <Button
          onClick={onLeaveAnyway}
          variant="outlined"
          color="error"
          sx={{ minWidth: 120 }}
        >
          Leave Anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DataLossWarning;
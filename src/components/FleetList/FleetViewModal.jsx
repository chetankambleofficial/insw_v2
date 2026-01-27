import React from "react";
import { Box, Card, Typography, Table, TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export const FleetViewModal = ({ vessel, onClose, columns, renderStatus, formatDate }) => (
  <Box sx={{
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1300
  }}>
    <Card sx={{ width: 600, maxHeight: "80vh", overflowY: "auto", p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">{vessel.vesselName} Details</Typography>
        <IconButton onClick={onClose}><Close /></IconButton>
      </Box>

      <Table size="small">
        <TableBody>
          {columns.filter(c => !["__index", "edit", "view"].includes(c.key)).map(col => (
            <TableRow key={col.key}>
              <TableCell sx={{ fontWeight: 600 }}>{col.label}</TableCell>
              <TableCell>
                {col.key === "activeStatus" ? renderStatus(vessel[col.key]) :
                  col.isDate ? formatDate(vessel[col.key]) : vessel[col.key] || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </Box>
);

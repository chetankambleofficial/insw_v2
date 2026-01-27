import React from "react";
import { TableHead, TableRow, TableCell, Box } from "@mui/material";
import { ArrowUpward, ArrowDownward, UnfoldMore } from "@mui/icons-material";

export const FleetTableHead = ({ columns, sortConfig, onSort }) => {
  const SortIcon = ({ column }) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === "asc" ? <ArrowUpward /> : <ArrowDownward />;
    }
    return <UnfoldMore sx={{ color: "#bbb" }} />;
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map(col => (
          <TableCell
            key={col.key}
            sx={{ backgroundColor: "#184a70", color: "#fff", cursor: col.sortable ? "pointer" : "default" }}
            onClick={() => col.sortable && onSort(col.key)}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {col.label} {col.sortable && <SortIcon column={col.key} />}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";

const GLTableHead = ({ columns, sortConfig, onSort }) => (
  <TableHead >
    <TableRow>
      {columns.map(col => (
        <TableCell
          key={col.key}
          sx={{ 
            backgroundColor: "#184a70ff", 
            color: "#fff", 
            fontWeight: 600,
            width: "10vw",
            minWidth: "10vw",
            maxWidth: "10vw",
            height:"50px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {col.key === "errorFlag" ? (
            <TableSortLabel
              active={sortConfig.key === col.key}
              direction={sortConfig.direction}
              onClick={() => onSort(col.key)}
            >
              Status
            </TableSortLabel>
          ) : (
            col.label
          )}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default GLTableHead;

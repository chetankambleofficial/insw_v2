import React from "react";
import { TableBody, TableRow, TableCell } from "@mui/material";
import GLTableRow from "./GLTableRow";

const GLTableBody = ({ rows, columns, rowTextColor = "default" }) => {
  try {
    // Ensure rows is defined and is an array
    const safeRows = rows && Array.isArray(rows) ? rows : [];
    
    if (safeRows.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columns?.length || 1}
              align="center"
              sx={{ color: "#6b7280", py: 3 }}
            >
              No data available
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {safeRows.map((row, idx) => (
          <GLTableRow
            key={idx}
            row={row}
            columns={columns}
            rowTextColor={rowTextColor}
          />
        ))}
      </TableBody>
    );
  } catch (error) {
    console.error('GLTableBody error:', error);
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columns?.length || 1}
            align="center"
            sx={{ color: "#ef4444", py: 3 }}
          >
            Error loading data
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
};

export default GLTableBody;

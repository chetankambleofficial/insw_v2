import React from "react";
import { TableRow, TableCell, Tooltip } from "@mui/material";

const formatDateToMMYY = (dateValue) => {
  if (!dateValue || dateValue === "-") return dateValue;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue;
    
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}-${year}`;
  } catch {
    return dateValue;
  }
};

const GLTableRow = ({ row, columns, rowTextColor = "default" }) => {
  const isError = rowTextColor === "error";
  console.log("GLTableRow rowTextColor:", rowTextColor, "isError:", isError);

  return (
    <TableRow
      hover
      sx={{
        backgroundColor: isError ? "#ffffff" : "inherit",
        "&:hover": {
          backgroundColor: isError ? "#ffffff" : "rgba(0, 0, 0, 0.04)",
        },
        "& td": {
          color: isError ? "#d32f2f" : "inherit",
          fontWeight: isError ? 500 : "normal",
        },
      }}
    >
      {columns.map((column) => {
        const cellValue = row[column.key] ?? "";
        
        // Format date fields
        const isDateField = column.key.includes('Date') || column.key.includes('date') || column.key === 'period';
        const formattedValue = isDateField ? formatDateToMMYY(cellValue) : cellValue;
        const displayValue = String(formattedValue).substring(0, 10);

        return (
          <TableCell
            key={column.key}
            sx={{
              width: "10vw",
              minWidth: "10vw",
              maxWidth: "10vw",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            <Tooltip title={formattedValue} placement="top">
              <span>{displayValue}</span>
            </Tooltip>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default GLTableRow;

import React from "react";
import { TableRow, TableCell, Tooltip } from "@mui/material";

const GLTableRow = ({ row, columns, rowTextColor = "default" }) => {
  const isError = rowTextColor === "error";

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
        const cellValue = row[column.key] ?? "-";
        const displayValue = String(cellValue).substring(0, 10);

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
            <Tooltip title={cellValue} placement="top">
              <span>{displayValue}</span>
            </Tooltip>
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default GLTableRow;

import React, { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableContainer,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import GLTableHead from "./GLTableHead";
import GLTableBody from "./GLTableBody";
import LedgerLoading from "./LedgerLoading";
import { VSHIPS_GL_COLUMNS, VSHIPS_VALIDATE_COLUMNS, VSHIPS_ERROR_COLUMNS } from "./columnConfig";

const GLTable = ({
  data = [],
  tableType = "gl", // "gl", "validate", "error"
  loading = false,
  currentPage = 1,
  hasNextPage = false,
  onNextPage,
  onPrevPage,
  rowTextColor = "default",
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const columns = useMemo(() => {
    switch (tableType) {
      case "validate":
        return VSHIPS_VALIDATE_COLUMNS;
      case "error":
        return VSHIPS_ERROR_COLUMNS;
      default:
        return VSHIPS_GL_COLUMNS;
    }
  }, [tableType]);

  const transformedData = useMemo(() => {
    if (!data.length) return [];
    
    return data.map(row => {
      const transformedRow = {};
      columns.forEach(col => {
        const value = row[col.apiField];
        transformedRow[col.key] = value === null || value === undefined ? "-" : value;
      });
      return transformedRow;
    });
  }, [data, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return transformedData;

    return [...transformedData].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc"
          ? aVal - bVal
          : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [transformedData, sortConfig]);

  if (loading) return <LedgerLoading />;

  if (!transformedData.length) return <Box p={2}>No data available</Box>;

  return (
    <Box sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper} sx={{ flex: 1 }}>
        <Table stickyHeader size="small">
          <GLTableHead
            columns={columns}
            sortConfig={sortConfig}
            onSort={(key) =>
              setSortConfig((prev) => ({
                key,
                direction:
                  prev.key === key && prev.direction === "asc"
                    ? "desc"
                    : "asc",
              }))
            }
          />
          <GLTableBody
            rows={sortedData}
            columns={columns}
            rowTextColor={rowTextColor}
          />
        </Table>
      </TableContainer>

      {transformedData.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, pt:0 }}>
          <Button
            startIcon={<ChevronLeft />}
            onClick={onPrevPage}
            disabled={loading || currentPage === 1}
            variant="outlined"
            size="small"
          >
            Previous
          </Button>
          
          <Typography variant="body2" color="text.secondary">
            Page {currentPage}
          </Typography>
          
          <Button
            endIcon={<ChevronRight />}
            onClick={onNextPage}
            disabled={loading || !hasNextPage}
            variant="outlined"
            size="small"
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GLTable;

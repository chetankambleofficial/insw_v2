import React, { useMemo, useState } from "react";
import { Box, Table, TableContainer, Paper, Button, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import GLTableHead from "./GLTableHead";
import GLTableBody from "./GLTableBody";
import LedgerLoading from "./LedgerLoading";
import { AE_GET_GL_COLUMNS, AE_UPLOAD_EXCEL_COLUMNS, AE_VALIDATE_COLUMNS, AE_ERROR_COLUMNS } from "./columnConfig";

const GLTable = ({
  data = [],
  tableType = "gl", // "gl", "upload", "validate", "error"
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

  /* ---------------- COLUMNS ---------------- */
  const columns = useMemo(() => {
    switch (tableType) {
      case "upload":
        return AE_UPLOAD_EXCEL_COLUMNS;
      case "validate":
        return AE_VALIDATE_COLUMNS;
      case "error":
        return AE_ERROR_COLUMNS;
      default:
        return AE_GET_GL_COLUMNS;
    }
  }, [tableType]);

  /* ---------------- TRANSFORM DATA ---------------- */
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

  /* ---------------- SORT ---------------- */
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return transformedData;

    return [...transformedData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [transformedData, sortConfig]);

  if (loading) return <LedgerLoading />;

  if (!transformedData || transformedData.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "#6b7280" }}>
        No data available
      </Box>
    );
  }

  return (
    <Box sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: "auto" }}>
        <Table stickyHeader size="small">
          <GLTableHead
            columns={columns}
            sortConfig={sortConfig}
            onSort={(key) =>
              setSortConfig({
                key,
                direction:
                  sortConfig.key === key && sortConfig.direction === "asc"
                    ? "desc"
                    : "asc",
              })
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

export default GLTable
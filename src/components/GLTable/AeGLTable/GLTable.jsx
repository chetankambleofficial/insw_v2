import React, { useMemo, useState } from "react";
import { Box, Table, TableContainer, Paper, Pagination } from "@mui/material";
import GLTableHead from "./GLTableHead";
import GLTableBody from "./GLTableBody";
import LedgerLoading from "./LedgerLoading";

const GLTable = ({
  data = [],
  columns = [],
  loading = false,
  currentPage = 1,
  totalPages = 0,
  onPageChange,
  rowTextColor = "default",
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  /* ---------------- COLUMNS ---------------- */
  const finalColumns = useMemo(() => {
    if (columns.length > 0) return columns;
    if (!data.length) return [];

    const keys = new Set();
    data.forEach((row) =>
      Object.keys(row).forEach((key) => keys.add(key))
    );

    return Array.from(keys).map((key) => ({
      key,
      label:
        key.charAt(0).toUpperCase() +
        key.slice(1).replace(/([A-Z])/g, " $1"),
    }));
  }, [data, columns]);

  /* ---------------- SORT ---------------- */
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  if (loading) return <LedgerLoading />;

  if (!data || data.length === 0) {
    return <div>No data provided</div>;
  }

  return (
    <Box sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <TableContainer component={Paper} sx={{ flex: 1, overflow: "auto" }}>
        <Table stickyHeader size="small">
          <GLTableHead
            columns={finalColumns}
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
            columns={finalColumns}
            rowTextColor={rowTextColor}
          />
        </Table>
      </TableContainer>

      {totalPages >= 1 && data.length > 10 && (
        <Box sx={{ display: "flex", justifyContent: "end", alignItems:"center", gap:2, p: 3,pt:1,mt:0 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            disabled={loading}
            color="primary"
            showFirstButton={totalPages > 5}
            showLastButton={totalPages > 5}
          />
        </Box>
      )}
      
       
   
    </Box>
  );
};

export default GLTable
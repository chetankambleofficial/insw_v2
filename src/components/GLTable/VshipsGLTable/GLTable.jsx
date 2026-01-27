// GLTable.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableContainer,
  Paper,
  Pagination,
} from "@mui/material";

import GLTableHead from "./GLTableHead";
import GLTableBody from "./GLTableBody";
import LedgerLoading from "./LedgerLoading";
import { COLUMN_SETS, DEFAULT_COLUMNS } from "./columnConfig";

const GLTable = ({
  data = [],
  columnSet = "ALL",
  loading = false,
  currentPage = 1,
  totalPages = 0,
  onPageChange = () => {},
  rowTextColor = "default",
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const columns = useMemo(() => {
    return COLUMN_SETS[columnSet] || DEFAULT_COLUMNS;
  }, [columnSet]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
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
  }, [data, sortConfig]);

  if (loading) return <LedgerLoading />;

  if (!data.length) return <Box p={2}>No data available</Box>;

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

      {totalPages > 1 && (
        <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default GLTable;

import React, { useEffect, useRef } from "react";
import { TableBody, TableRow, TableCell, CircularProgress, } from "@mui/material";
import GLTableRow from "./GLTableRow";
const VirtualizedGLTableBody = ({ rows, columns, loadingMore, hasMore, onLoadMore, rowTextColor = "default", }) => {
  const loadingRef = useRef(null);
  useEffect(() => {
    if (!hasMore || loadingMore || !onLoadMore) {
      console.log('Scroll observer not set:', { hasMore, loadingMore, onLoadMore: !!onLoadMore });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          console.log('Loading row visible, calling onLoadMore');
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
      console.log('Observer attached to loading row');
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);
  return (
    <TableBody>
      {rows.map((row, index) => (
        <GLTableRow key={index} row={row} columns={columns} rowTextColor={rowTextColor} />
      ))}
      {(loadingMore || hasMore) && (
        <TableRow ref={loadingRef}>
          <TableCell colSpan={columns.length} align="center">
            {loadingMore && <CircularProgress size={20} />}
          </TableCell>
        </TableRow>)}
    </TableBody>
  );
}; export default VirtualizedGLTableBody;
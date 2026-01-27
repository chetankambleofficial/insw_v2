import React from "react";
import { TableBody, TableRow, TableCell, CircularProgress } from "@mui/material";
import GLTableRow from "./GLTableRow";

const GLTableBody = ({ rows, columns, rowTextColor = "default" }) => (
  <TableBody>
    {rows.map((row, idx) => (
      <GLTableRow key={idx} row={row} columns={columns} rowTextColor={rowTextColor} />
    ))}
  </TableBody>
);

export default GLTableBody;

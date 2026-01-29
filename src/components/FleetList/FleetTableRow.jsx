import React from "react";
import { TableCell, TableRow, TextField, IconButton, Chip } from "@mui/material";
import { Edit, Save } from "@mui/icons-material";

export const FleetTableRow = ({
  vessel,
  columns,
  editingRow,
  editValues,
  onEdit,
  onSave,
  onChange,
  renderStatus,
}) => {
  const isEditing = editingRow === vessel.vesselImo;

  return (
    <TableRow key={vessel.vesselImo}>
      {columns.map(col => {
        if (col.key === "edit") {
          return (
            <TableCell key={col.key} align="center">
              <IconButton onClick={() => (isEditing ? onSave(vessel) : onEdit(vessel))}>
                {isEditing ? <Save /> : <Edit />}
              </IconButton>
            </TableCell>
          );
        }

        const value = vessel[col.key];
        const editable = isEditing && col.editable;

        if (col.key === "status") {
          return <TableCell key={col.key} align="center">{renderStatus(value)}</TableCell>;
        }

        if (col.isDate) {
          return <TableCell key={col.key}>{value}</TableCell>; // formatDate can be applied
        }

        if (editable) {
          return (
            <TableCell key={col.key}>
              <TextField
                size="small"
                value={editValues[col.key === "inswShipId" ? "shipNumber" : 
                                col.key === "inswAcctCompanyId" ? "acctCompanyId" : 
                                col.key === "aetmsVshipShipCode" ? "aetmsVshipShipId" : col.key] || ""}
                onChange={e => onChange(
                  col.key === "inswShipId" ? "shipNumber" : 
                  col.key === "inswAcctCompanyId" ? "acctCompanyId" : 
                  col.key === "aetmsVshipShipCode" ? "aetmsVshipShipId" : col.key, 
                  e.target.value
                )}
              />
            </TableCell>
          );
        }

        return <TableCell key={col.key}>{value || "-"}</TableCell>;
      })}
    </TableRow>
  );
};

import React, { useState, useMemo, useEffect } from "react";
import { Box, Table, TableBody, TableContainer, Paper } from "@mui/material";

import { FleetTableRow } from "./FleetTableRow";
import { FleetTableHead } from "./FleetTableHead";
import { FleetViewModal } from "./FleetViewModal";
import FleetMainContentSection from "./FleetMainContentSection";
import { getVessels, updateVesselDirect } from "./vesselsApi";
import { VESSELS_COLUMNS } from "./columnConfig";
import LoadingScreen from "../common/LoadingScreen";

export const FleetListTable = () => {
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // const columns = [
  //   { label: "Ship IMO", key: "vesselImo", sortable: true },
  //   { label: "Ship Name", key: "vesselName", sortable: true },
  //   { label: "INSW Ship Id", key: "shipNumber", editable: true },
  //   { label: "INSW Acct Company Id", key: "acctCompanyId", editable: true },
  //   { label: "Manager", key: "manager", sortable: true },
  //   {label: "Base Currency", key:"baseCurrency",sortable:true},
  //   { label: "Status", key: "activeStatus", sortable: true },
  //   { label: "Edit", key: "edit" },
  // ];

  const columns = [
    { label: "Ship IMO", key: "shipImo", sortable: true, sticky: "left", width: 140 },
    { label: "Ship Name", key: "shipName", sortable: true, minWidth: 220 },
    { label: "INSW Ship Id", key: "inswShipId", sortable: true, minWidth: 140, editable: true },
    { label: "INSW Acct Company Id", key: "inswAcctCompanyId", sortable: true, minWidth: 170, editable: true },
    { label: "INSW Acct Company Name", key: "inswAcctCompanyName", sortable: true, minWidth: 200 },
    { label: "Manager", key: "manager", sortable: true, minWidth: 160 },
    { label: "AETMS/VShip Ship Code", key: "aetmsVshipShipCode", sortable: true, minWidth: 180, editable: true },
    { label: "Fleet Entered Date", key: "fleetEnteredDate", sortable: true, minWidth: 170 },
    { label: "Fleet Exited Date", key: "fleetExitedDate", sortable: true, minWidth: 170 },
    { label: "Ship Fleet", key: "shipFleet", sortable: true, minWidth: 140 },
    { label: "Status", key: "status", sortable: true, align: "center", width: 120 },
    { label: "Edit", key: "edit", sticky: "right", width: 100 }
  ];

  /* ---------------- EDIT HANDLERS ================= */
  const handleEdit = (vessel) => {
    setEditingRow(vessel.vesselImo);
    setEditValues({
      shipNumber: vessel.shipNumber || "",
      acctCompanyId: vessel.acctCompanyId || "", 
      aetmsVshipShipId: vessel.aetmsVshipShipId || ""
    });
  };

  const handleSave = async (vessel) => {
    setSaveLoading(true);
    try {
      const payload = {
        seqNo: vessel.seqNo,
        vesselImo: vessel.vesselImo,
        vesselName: vessel.vesselName,
        activeStatus: vessel.activeStatus,
        manager: vessel.manager,
        vesselSegment: vessel.vesselSegment,
        shipNumber: editValues.shipNumber || null,
        fleetEnteredDate: vessel.fleetEnteredDate === "-" ? null : vessel.fleetEnteredDate,
        fleetExitedDate: vessel.fleetExitedDate === "-" ? null : vessel.fleetExitedDate,
        acctCompanyId: editValues.acctCompanyId || null,
        acctCompanyName: vessel.acctCompanyName === "-" ? null : vessel.acctCompanyName,
        aetmsVshipShipId: editValues.aetmsVshipShipId || null
      };

      await updateVesselDirect(payload);
      setEditingRow(null);
      setEditValues({});
      window.location.reload();
    } catch (error) {
      console.error('Error updating vessel:', error);
    } finally {
      setSaveLoading(false);
    }
  };
  useEffect(() => {
    const loadVessels = async () => {
      setLoading(true);
      try {
        const data = await getVessels();
        const transformedData = data.map(vessel => {
          const transformed = {};
          VESSELS_COLUMNS.forEach(col => {
            const value = vessel[col.apiField];
            if (col.key === "status") {
              // Keep original numeric value for status logic
              transformed[col.key] = value;
            } else {
              transformed[col.key] = value === null || value === undefined ? "-" : value;
            }
          });
          return { ...vessel, ...transformed };
        });
        setVessels(transformedData);
      } catch (error) {
        console.error("Failed to load vessels:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVessels();
  }, []);


  const filteredVessels = useMemo(() => {
    if (!searchQuery) return vessels;

    const q = searchQuery.toLowerCase();

    return vessels.filter(
      (v) =>
        v.shipName?.toLowerCase().includes(q) ||
        v.shipImo?.includes(q) ||
        v.manager?.toLowerCase().includes(q)
    );
  }, [searchQuery, vessels]);

  /* ---------------- SORT ---------------- */
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedVessels = useMemo(() => {
    const data = [...filteredVessels];

    if (!sortConfig.key) return data;

    return data.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number") {
        return sortConfig.direction === "asc"
          ? aVal - bVal
          : bVal - aVal;
      }

      return 0;
    });
  }, [filteredVessels, sortConfig]);

  const renderStatus = (status) =>
    status === 1 ? (
      <span style={{ color: "green", fontWeight: 600 }}>Active</span>
    ) : (
      <span style={{ color: "red", fontWeight: 600 }}>Inactive</span>
    );

  /* ---------------- RENDER ---------------- */
  return (
    <Box>
      {/* HEADER / SEARCH */}
      <FleetMainContentSection
        recordCount={filteredVessels.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* TABLE */}
     <TableContainer
  component={Paper}
  sx={{
    maxHeight: "75vh",     // 🔥 REQUIRED
    overflowY: "auto",
  }}
>
        <Table stickyHeader>
          <FleetTableHead
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
          <TableBody>
            {sortedVessels.map((vessel) => (
              <FleetTableRow
                key={vessel.vesselImo}
                vessel={vessel}
                columns={columns}
                editingRow={editingRow}
                editValues={editValues}
                onEdit={() => handleEdit(vessel)}
                onSave={() => handleSave(vessel)}
                onChange={(k, v) =>
                  setEditValues((prev) => ({ ...prev, [k]: v }))
                }
                renderStatus={renderStatus}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* VIEW MODAL */}
      {selectedVessel && (
        <FleetViewModal
          vessel={selectedVessel}
          onClose={() => setSelectedVessel(null)}
          columns={columns}
          renderStatus={renderStatus}
        />
      )}

      {/* LOADING SCREENS */}
      <LoadingScreen open={loading} message="Loading vessels..." />
      <LoadingScreen open={saveLoading} message="Saving changes..." />
    </Box>
  );
};

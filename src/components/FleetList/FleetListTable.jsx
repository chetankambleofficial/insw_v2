import React, { useState, useMemo } from "react";
import { Box, Table, TableBody, TableContainer, Paper } from "@mui/material";

import { FleetTableRow } from "./FleetTableRow";
import { FleetTableHead } from "./FleetTableHead";
import { FleetViewModal } from "./FleetViewModal";
import FleetMainContentSection from "./FleetMainContentSection";

export const FleetListTable = () => {
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

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
  {
    label: "Ship IMO",
    key: "vesselImo",
    sortable: true,
    sticky: "left",        // 🔥 optional: make first column sticky
    width: 140,
  },
  {
    label: "Ship Name",
    key: "vesselName",
    sortable: true,
    minWidth: 200,
  },
  {
    label: "INSW Ship Id",
    key: "shipNumber",
    editable: true,
    minWidth: 160,
  },
  {
    label: "INSW Acct Company Id",
    key: "acctCompanyId",
    editable: true,
    minWidth: 200,
  },
  {
    label: "Manager",
    key: "manager",
    sortable: true,
    minWidth: 160,
  },
  {
    label: "Base Currency",
    key: "baseCurrency",
    sortable: true,
    align: "center",
    width: 130,
  },
  {
    label: "Status",
    key: "activeStatus",
    sortable: true,
    align: "center",
    width: 120,
  },
  {
    label: "Edit",
    key: "edit",
    sticky: "right",       // 🔥 optional: keep Edit always visible
    width: 100,
  },
];


  /* ---------------- STATIC DATA ---------------- */
 const vessels = [
  {
    vesselImo: "9392779",
    vesselName: "Seaways Polaris",
    accountingPeriod: "2024-06-01",
    documentNumber: "28648800",
    accountingNumber: "500704101",
    transactionDate: "2024-06-06T00:00:00",
    baseCurrency: "USD",
    baseAmount: 55,
    foreignCurrency: "USD",
    foreignAmount: 55,
    memo: "Fleet mail fee",
    transactionType: "Bill",
    referencePo: "SPR-APC-2024-2724",
    url: null,
    projectCode: "PRJ-001",
    analysisCode: "AN-01",
    vendorCode: "VEND-101",
    ownerAccountNumber: "72200010",
  },
  {
    vesselImo: "9401123",
    vesselName: "Oceanic Voyager",
    accountingPeriod: "2024-06-01",
    documentNumber: "28648801",
    accountingNumber: "500704102",
    transactionDate: "2024-06-07T00:00:00",
    baseCurrency: "EUR",
    baseAmount: 120,
    foreignCurrency: "EUR",
    foreignAmount: 120,
    memo: "Satellite communication charges",
    transactionType: "Invoice",
    referencePo: "SPR-APC-2024-2725",
    url: null,
    projectCode: "PRJ-002",
    analysisCode: "AN-02",
    vendorCode: "VEND-102",
    ownerAccountNumber: "72200011",
  },
  {
    vesselImo: "9413345",
    vesselName: "Blue Horizon",
    accountingPeriod: "2024-07-01",
    documentNumber: "28648802",
    accountingNumber: "500704103",
    transactionDate: "2024-07-01T00:00:00",
    baseCurrency: "USD",
    baseAmount: 340,
    foreignCurrency: "USD",
    foreignAmount: 340,
    memo: "Engine maintenance service",
    transactionType: "Bill",
    referencePo: "SPR-ENG-2024-1101",
    url: null,
    projectCode: "PRJ-003",
    analysisCode: "AN-03",
    vendorCode: "VEND-103",
    ownerAccountNumber: "72200012",
  },
  {
    vesselImo: "9425567",
    vesselName: "Northern Star",
    accountingPeriod: "2024-07-01",
    documentNumber: "28648803",
    accountingNumber: "500704104",
    transactionDate: "2024-07-03T00:00:00",
    baseCurrency: "GBP",
    baseAmount: 210,
    foreignCurrency: "GBP",
    foreignAmount: 210,
    memo: "Navigation system upgrade",
    transactionType: "Invoice",
    referencePo: "SPR-NAV-2024-3302",
    url: null,
    projectCode: "PRJ-004",
    analysisCode: "AN-04",
    vendorCode: "VEND-104",
    ownerAccountNumber: "72200013",
  },
  {
    vesselImo: "9437788",
    vesselName: "Sea Explorer",
    accountingPeriod: "2024-08-01",
    documentNumber: "28648804",
    accountingNumber: "500704105",
    transactionDate: "2024-08-05T00:00:00",
    baseCurrency: "USD",
    baseAmount: 980,
    foreignCurrency: "USD",
    foreignAmount: 980,
    memo: "Dry dock service charges",
    transactionType: "Bill",
    referencePo: "SPR-DD-2024-9901",
    url: null,
    projectCode: "PRJ-005",
    analysisCode: "AN-05",
    vendorCode: "VEND-105",
    ownerAccountNumber: "72200014",
  },
  {
    vesselImo: "9448899",
    vesselName: "Atlantic Pearl",
    accountingPeriod: "2024-08-01",
    documentNumber: "28648805",
    accountingNumber: "500704106",
    transactionDate: "2024-08-07T00:00:00",
    baseCurrency: "EUR",
    baseAmount: 430,
    foreignCurrency: "EUR",
    foreignAmount: 430,
    memo: "Port handling charges",
    transactionType: "Invoice",
    referencePo: "SPR-PORT-2024-2210",
    url: null,
    projectCode: "PRJ-006",
    analysisCode: "AN-06",
    vendorCode: "VEND-106",
    ownerAccountNumber: "72200015",
  },
  {
    vesselImo: "9459911",
    vesselName: "Pacific Runner",
    accountingPeriod: "2024-09-01",
    documentNumber: "28648806",
    accountingNumber: "500704107",
    transactionDate: "2024-09-02T00:00:00",
    baseCurrency: "USD",
    baseAmount: 75,
    foreignCurrency: "USD",
    foreignAmount: 75,
    memo: "Crew welfare expenses",
    transactionType: "Bill",
    referencePo: "SPR-CREW-2024-7712",
    url: null,
    projectCode: "PRJ-007",
    analysisCode: "AN-07",
    vendorCode: "VEND-107",
    ownerAccountNumber: "72200016",
  },
  {
    vesselImo: "9461122",
    vesselName: "Global Trader",
    accountingPeriod: "2024-09-01",
    documentNumber: "28648807",
    accountingNumber: "500704108",
    transactionDate: "2024-09-06T00:00:00",
    baseCurrency: "USD",
    baseAmount: 640,
    foreignCurrency: "USD",
    foreignAmount: 640,
    memo: "Fuel bunker charges",
    transactionType: "Invoice",
    referencePo: "SPR-FUEL-2024-8821",
    url: null,
    projectCode: "PRJ-008",
    analysisCode: "AN-08",
    vendorCode: "VEND-108",
    ownerAccountNumber: "72200017",
  },
  {
    vesselImo: "9472233",
    vesselName: "Silver Wave",
    accountingPeriod: "2024-10-01",
    documentNumber: "28648808",
    accountingNumber: "500704109",
    transactionDate: "2024-10-04T00:00:00",
    baseCurrency: "USD",
    baseAmount: 150,
    foreignCurrency: "USD",
    foreignAmount: 150,
    memo: "Safety equipment purchase",
    transactionType: "Bill",
    referencePo: "SPR-SAFE-2024-4489",
    url: null,
    projectCode: "PRJ-009",
    analysisCode: "AN-09",
    vendorCode: "VEND-109",
    ownerAccountNumber: "72200018",
  },
  {
    vesselImo: "9483344",
    vesselName: "Aurora Spirit",
    accountingPeriod: "2024-10-01",
    documentNumber: "28648809",
    accountingNumber: "500704110",
    transactionDate: "2024-10-09T00:00:00",
    baseCurrency: "GBP",
    baseAmount: 520,
    foreignCurrency: "GBP",
    foreignAmount: 520,
    memo: "Insurance premium",
    transactionType: "Invoice",
    referencePo: "SPR-INS-2024-6632",
    url: null,
    projectCode: "PRJ-010",
    analysisCode: "AN-10",
    vendorCode: "VEND-110",
    ownerAccountNumber: "72200019",
  },
];


  /* ---------------- SEARCH ---------------- */
  const filteredVessels = useMemo(() => {
    if (!searchQuery) return vessels;

    const q = searchQuery.toLowerCase();

    return vessels.filter(
      (v) =>
        v.vesselName.toLowerCase().includes(q) ||
        v.vesselImo.includes(q) ||
        v.manager.toLowerCase().includes(q)
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
                onEdit={() => setEditingRow(vessel.vesselImo)}
                onSave={() => setEditingRow(null)}
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
    </Box>
  );
};

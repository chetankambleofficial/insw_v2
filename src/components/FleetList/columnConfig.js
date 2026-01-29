// Vessels Column Configuration
export const VESSELS_COLUMNS = [
  { key: "shipImo", label: "Ship IMO", apiField: "vesselImo" },
  { key: "shipName", label: "Ship Name", apiField: "vesselName" },
  { key: "inswShipId", label: "INSW Ship Id", apiField: "shipNumber" },
  { key: "inswAcctCompanyId", label: "INSW Acct Company Id", apiField: "acctCompanyId" },
  { key: "inswAcctCompanyName", label: "INSW Acct Company Name", apiField: "acctCompanyName" },
  { key: "manager", label: "Manager", apiField: "manager" },
  { key: "aetmsVshipShipCode", label: "AETMS/VShip Ship Code", apiField: "aetmsVshipShipId" },
  { key: "fleetEnteredDate", label: "Fleet Entered Date", apiField: "fleetEnteredDate" },
  { key: "fleetExitedDate", label: "Fleet Exited Date", apiField: "fleetExitedDate" },
  { key: "shipFleet", label: "Ship Fleet", apiField: "vesselSegment" },
  { key: "status", label: "Status", apiField: "activeStatus" }
];
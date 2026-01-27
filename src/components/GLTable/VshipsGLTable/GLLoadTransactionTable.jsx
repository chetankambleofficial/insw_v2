import GLTable from "./GLTable.jsx";
import React, { useState, useMemo } from "react";
const GLLoadTransactionTable = ({ data }) => {
  return <GLTable data={Array.isArray(data) ? data : []} loading={false} />;
};

export default GLLoadTransactionTable;

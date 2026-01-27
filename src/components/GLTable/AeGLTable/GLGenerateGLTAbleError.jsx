import React, { useMemo } from "react";
import GLTable from "./GLTable.jsx";

const GLGenerateGLTableError = ({ data }) => {
  const columns = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return Object.keys(data[0]).map((key) => ({
      key,
      label: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase()),
    }));
  }, [data]);

  return (
    <GLTable
      data={Array.isArray(data) ? data : []}
      columns={columns}
      loading={false}
      rowTextColor="error"
    />
  );
};

export default GLGenerateGLTableError;

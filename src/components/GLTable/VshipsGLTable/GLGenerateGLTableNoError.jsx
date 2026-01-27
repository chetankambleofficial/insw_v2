import GLTable from "./GLTable.jsx";
import React, { useState, useMemo } from "react";
const GLGenerateGLTableNoError = ({ data }) => {
  return <GLTable data={data} loading={false} />;
};

export default GLGenerateGLTableNoError;

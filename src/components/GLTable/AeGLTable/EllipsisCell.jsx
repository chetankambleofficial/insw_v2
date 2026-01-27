import React, { useEffect, useRef, useState } from "react";
import { Box, Tooltip } from "@mui/material";

const EllipsisCell = ({ children, maxWidth = 150 }) => {
  const ref = useRef(null);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    if (ref.current) {
      setOverflow(ref.current.scrollWidth > ref.current.clientWidth);
    }
  }, [children]);

  const content = (
    <Box
      ref={ref}
      sx={{
        maxWidth,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </Box>
  );

  return overflow ? (
    <Tooltip title={children} arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
};

export default EllipsisCell;

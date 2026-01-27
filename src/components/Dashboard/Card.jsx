import React from "react";
import { Card, CardMedia, Typography, Box } from "@mui/material";

export default function CardComponent({
  manager,
  image,
  wheelClass,
  onClick,
}) {
  return (
    <Card
      className={`card-animate ${wheelClass}`}
      onClick={onClick}
      sx={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        border: "2px solid white",
      }}
    >
      <CardMedia component="img" height="225" image={image} />

      <Box className="hover-overlay" />

      <Typography className="card-title">
        {manager}
      </Typography>

      <Box className="card-description">
        Fleet operational overview and analytics.
      </Box>
    </Card>
  );
}

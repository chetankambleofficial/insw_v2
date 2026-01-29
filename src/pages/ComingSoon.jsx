import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";

const ComingSoon = ({
  title = "Coming Soon",
  subtitle = "This feature is under development",
  description = "We’re working hard to bring this feature to you. Stay tuned!",
  onBack,
}) => {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Box>
        <ConstructionIcon
          sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
        />

        <Typography variant="h4" fontWeight={600} gutterBottom>
          {title}
        </Typography>

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 420, mx: "auto", mb: 3 }}
        >
          {description}
        </Typography>

        {onBack && (
          <Button
            variant="contained"
            color="primary"
            onClick={onBack}
          >
            Go Back
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ComingSoon;

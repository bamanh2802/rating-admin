"use client";

import React from "react";
import { Card, CardContent, Typography, Box, alpha } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface SimplifiedStatCardProps {
  icon: React.ReactElement;
  title: string;
  mainValue: string | number;
  growthRate?: string;
  growthDirection?: "increase" | "decrease";
  color: string;
}

const SimplifiedStatCard: React.FC<SimplifiedStatCardProps> = ({
  icon,
  title,
  mainValue,
  growthRate,
  growthDirection,
  color,
}) => {
  const renderGrowthIndicator = () => {
    if (!growthRate) return null;

    const isIncrease = growthDirection === "increase";
    const growthColor = isIncrease ? "#10B981" : "#EF4444";
    const GrowthIcon = isIncrease ? TrendingUp : TrendingDown;

    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <GrowthIcon sx={{ fontSize: 16, color: growthColor }} />
        <Typography
          variant="caption"
          sx={{ color: growthColor, fontWeight: 500 }}
        >
          {growthRate}
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(color, 0.05)} 0%, ${alpha(
          color,
          0.02
        )} 100%)`,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        {/* Icon Left */}
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            backgroundColor: alpha(color, 0.15),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {React.cloneElement(icon as React.ReactElement<any>, {
            sx: { fontSize: 24, color: color },
          })}
        </Box>

        {/* Info Right */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            textAlign: "right",
            flex: 1,
            ml: 2,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              fontSize: "0.9rem",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {mainValue}
          </Typography>

          {renderGrowthIndicator()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimplifiedStatCard;

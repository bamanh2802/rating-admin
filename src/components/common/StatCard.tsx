import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "increase" | "decrease";
  icon: React.ReactElement;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color = "primary",
}) => (
  <Card elevation={2} sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {change && (
            <Box display="flex" alignItems="center" mt={1}>
              {changeType === "increase" ? (
                <TrendingUp color="success" fontSize="small" />
              ) : (
                <TrendingDown color="error" fontSize="small" />
              )}
              <Typography
                variant="caption"
                sx={{ ml: 0.5 }}
                color={
                  changeType === "increase" ? "success.main" : "error.main"
                }
              >
                {change}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;

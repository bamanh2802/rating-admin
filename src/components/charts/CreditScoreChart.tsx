import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
} from "@mui/material";

export interface CreditScoreDistribution {
  level: string;
  count: number;
  percentage: number;
  color: string;
}

const CreditScoreChart: React.FC<{ data: CreditScoreDistribution[] }> = ({
  data,
}) => (
  <Card elevation={2}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Phân phối người dùng theo cấp độ tín nhiệm
      </Typography>
      <Box mt={2}>
        {data.map((item, idx) => (
          <Box key={idx} mb={2}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">{item.level}</Typography>
              <Box display="flex" gap={1}>
                <Typography variant="body2" fontWeight="bold">
                  {item.count.toLocaleString()}
                </Typography>
                <Chip
                  label={`${item.percentage}%`}
                  size="small"
                  sx={{ bgcolor: item.color, color: "white" }}
                />
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                mt: 1,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  bgcolor: item.color,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

export default CreditScoreChart;

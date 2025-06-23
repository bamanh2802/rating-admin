import React, { useState, useEffect, useCallback } from "react";
import { getCashFlow } from "../../service/data";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// MUI Components
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

interface FlowDataPoint {
  label: string;
  credit: number;
  debit: number;
}

type TimeMode = "day" | "month" | "year";

const CashFlowChart: React.FC = () => {
  const [data, setData] = useState<FlowDataPoint[]>([]);
  const [mode, setMode] = useState<TimeMode>("day");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async (currentMode: TimeMode) => {
    try {
      setIsLoading(true);
      const response = await getCashFlow(currentMode); // Gọi API với mode hiện tại
      if (response && response.result && Array.isArray(response.result)) {
        const formattedData = response.result.map((item: any) => ({
          ...item,
          debit: Math.abs(item.debit),
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error(
        `Failed to fetch cash flow data for mode: ${currentMode}`,
        error
      );
      setData([]); // Xóa dữ liệu cũ nếu có lỗi
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useEffect để gọi API khi mode thay đổi
  useEffect(() => {
    fetchData(mode);
  }, [mode, fetchData]);

  const handleModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: TimeMode | null
  ) => {
    // Ngăn không cho bỏ chọn tất cả
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 1, backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {label}
          </Typography>
          <Typography variant="caption" sx={{ color: "success.main" }}>
            Credit: +{payload[0].value.toLocaleString()}
          </Typography>
          <br />
          <Typography variant="caption" sx={{ color: "error.main" }}>
            Debit: -{payload[1].value.toLocaleString()}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title="Cash Flow"
        subheader="Credit vs Debit over time"
        action={
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            aria-label="Time range"
            size="small"
          >
            <ToggleButton value="day" aria-label="last 30 days">
              30 Days
            </ToggleButton>
            <ToggleButton value="month" aria-label="last 12 months">
              12 Months
            </ToggleButton>
            <ToggleButton value="year" aria-label="last 5 years">
              5 Years
            </ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : data.length === 0 ? (
          <Typography color="text.secondary">
            No data available for this period.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" fontSize={12} tickLine={false} />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value)
                }
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(206, 217, 224, 0.3)" }}
              />
              <Legend />
              <Bar dataKey="credit" fill="#4caf50" name="Credit" />
              <Bar dataKey="debit" fill="#f44336" name="Debit" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CashFlowChart;

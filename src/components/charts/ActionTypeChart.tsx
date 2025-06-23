import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  CircularProgress,
  Chip,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { AxiosResponse } from "axios";

import { actionTypeTimeLine } from "../../service/data";

interface Action {
  action_type: "FORWARD_REV" | "BACKWARD_REV" | "FORWARD_UPDATE";
  count: number;
}

interface TimelineItem {
  period: string;
  actions: Action[];
  total_period_count: number;
}

interface Summary {
  total_records: number;
  by_action_type: {
    FORWARD_REV: number;
    BACKWARD_REV: number;
    FORWARD_UPDATE: number;
  };
}

interface TimelinePayload {
  success: boolean;
  data: {
    period_type: "day" | "month" | "year";
    timeline: TimelineItem[];
    summary: Summary;
  };
}

interface FullApiResponse {
  status: string;
  message: string;
  result: TimelinePayload;
}

interface ChartData {
  period: string;
  FORWARD_REV: number;
  BACKWARD_REV: number;
  FORWARD_UPDATE: number;
}

const ActionTimelineChart: React.FC = () => {
  const [period, setPeriod] = useState<"day" | "month" | "year">("month");
  const [chartType, setChartType] = useState<"line" | "area">("area");
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<Summary>({
    total_records: 0,
    by_action_type: { FORWARD_REV: 0, BACKWARD_REV: 0, FORWARD_UPDATE: 0 },
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (selectedPeriod: "day" | "month" | "year") => {
      setLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<FullApiResponse> =
          await actionTypeTimeLine(selectedPeriod);

        if (response.data && response.data.status === "success") {
          const resultPayload = response.data.result;

          if (resultPayload && resultPayload.success) {
            const { timeline, summary } = resultPayload.data;

            const transformedData: ChartData[] = timeline.map((item) => ({
              period: item.period,
              FORWARD_REV:
                item.actions.find((a) => a.action_type === "FORWARD_REV")
                  ?.count || 0,
              BACKWARD_REV:
                item.actions.find((a) => a.action_type === "BACKWARD_REV")
                  ?.count || 0,
              FORWARD_UPDATE:
                item.actions.find((a) => a.action_type === "FORWARD_UPDATE")
                  ?.count || 0,
            }));

            setData(transformedData);
            setSummary(summary);
          } else {
            throw new Error(
              response.data.message || "API returned success: false"
            );
          }
        } else {
          throw new Error(response.data.message || "API request failed");
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Could not load data. Please try again.");
        // Clear old data on error
        setData([]);
        setSummary({
          total_records: 0,
          by_action_type: {
            FORWARD_REV: 0,
            BACKWARD_REV: 0,
            FORWARD_UPDATE: 0,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData(period);
  }, [period]);

  const handlePeriodChange = (event: SelectChangeEvent) => {
    setPeriod(event.target.value as "day" | "month" | "year");
  };

  const handleChartTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: "line" | "area" | null
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const colors = {
    FORWARD_REV: "#3f51b5",
    BACKWARD_REV: "#ff9800",
    FORWARD_UPDATE: "#4caf50",
  };

  const formatXAxisLabel = (value: string): string => {
    if (period === "day") {
      return new Date(value).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
      });
    }
    return value;
  };

  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: Array<{
      dataKey: string;
      value: number;
      color: string;
      name: string;
    }>;
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length && label) {
      return (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            border: "1px solid #ccc",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            {period === "day"
              ? `Date: ${formatXAxisLabel(label)}`
              : period === "month"
              ? `Month: ${label}`
              : `Year: ${label}`}
          </Typography>
          {payload.map((entry) => (
            <Typography
              key={entry.dataKey}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.value.toLocaleString()}
            </Typography>
          ))}
          <Typography variant="body2" sx={{ fontWeight: "bold", mt: 1 }}>
            Total:{" "}
            {payload
              .reduce((sum, entry) => sum + entry.value, 0)
              .toLocaleString()}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <CardContent sx={{ p: 0 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">Action Timeline</Typography>

          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="body2" fontWeight="bold">
                    {loading ? (
                      <CircularProgress size={12} />
                    ) : (
                      summary.total_records.toLocaleString()
                    )}
                  </Typography>
                  <Typography className="text-white" variant="caption">
                    Total
                  </Typography>
                </Box>
              }
              variant="outlined"
              size="small"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                "& .MuiChip-label": { px: 1.5 },
              }}
            />

            <Box sx={{ width: 1, height: 16, bgcolor: "divider", mx: 0.5 }} />

            {Object.entries(summary.by_action_type).map(([key, value]) => (
              <Chip
                key={key}
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: colors[key as keyof typeof colors] }}
                    >
                      {loading ? (
                        <CircularProgress size={10} />
                      ) : (
                        value.toLocaleString()
                      )}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {key.replace(/_/g, " ")}
                    </Typography>
                  </Box>
                }
                variant="outlined"
                size="small"
                sx={{
                  backgroundColor: `${colors[key as keyof typeof colors]}15`,
                  borderColor: colors[key as keyof typeof colors],
                  "& .MuiChip-label": { px: 1.5 },
                }}
              />
            ))}
          </Box>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="period-select-label">Period</InputLabel>
            <Select
              labelId="period-select-label"
              value={period}
              onChange={handlePeriodChange}
              label="Period"
            >
              <MenuItem value="day">Daily</MenuItem>
              <MenuItem value="month">Monthly</MenuItem>
              <MenuItem value="year">Yearly</MenuItem>
            </Select>
          </FormControl>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            size="small"
            aria-label="chart type"
          >
            <ToggleButton value="line" aria-label="line chart">
              Line
            </ToggleButton>
            <ToggleButton value="area" aria-label="area chart">
              Area
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
        >
          <Typography color="error" align="center">
            {error}
          </Typography>
        </Box>
      ) : data.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
        >
          <Typography align="center" color="text.secondary">
            No data available to display for this period.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tickFormatter={formatXAxisLabel}
                  interval="preserveStartEnd"
                  dy={10}
                />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="FORWARD_REV"
                  name="Forward Review"
                  stroke={colors.FORWARD_REV}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="BACKWARD_REV"
                  name="Backward Review"
                  stroke={colors.BACKWARD_REV}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="FORWARD_UPDATE"
                  name="Forward Update"
                  stroke={colors.FORWARD_UPDATE}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            ) : (
              <AreaChart
                data={data}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="colorForwardRev"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors.FORWARD_REV}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.FORWARD_REV}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorBackwardRev"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors.BACKWARD_REV}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.BACKWARD_REV}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorForwardUpdate"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors.FORWARD_UPDATE}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors.FORWARD_UPDATE}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tickFormatter={formatXAxisLabel}
                  interval="preserveStartEnd"
                  dy={10}
                />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="FORWARD_REV"
                  name="Forward Review"
                  stroke={colors.FORWARD_REV}
                  fillOpacity={1}
                  fill="url(#colorForwardRev)"
                />
                <Area
                  type="monotone"
                  dataKey="BACKWARD_REV"
                  name="Backward Review"
                  stroke={colors.BACKWARD_REV}
                  fillOpacity={1}
                  fill="url(#colorBackwardRev)"
                />
                <Area
                  type="monotone"
                  dataKey="FORWARD_UPDATE"
                  name="Forward Update"
                  stroke={colors.FORWARD_UPDATE}
                  fillOpacity={1}
                  fill="url(#colorForwardUpdate)"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </Box>
      )}
    </CardContent>
  );
};

export default ActionTimelineChart;

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Container,
  CircularProgress,
  useTheme, // Import useTheme
} from "@mui/material";
import {
  People,
  StarRate,
  CheckCircleOutline,
  AccountBalanceWallet,
} from "@mui/icons-material";
import RealTimeDashboard from "../../components/users/RealTimeDashboard";

import ActionTimelineChart from "../../components/charts/ActionTypeChart";
import DetailedStatCard from "../../components/common/DetailedStatCard";
import { cardAnalyst } from "../../service/data";
import CashFlowChart from "../../components/charts/CashFlowChart";

interface DashboardCardData {
  icon: React.ReactElement;
  title: string;
  mainValue: string | number;
  growthRate?: string;
  growthDirection?: "increase" | "decrease"; // Sử dụng đúng kiểu ở đây
  details: Array<{ label: string; value: string | number }>;
  color: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const AdminDashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await cardAnalyst();
        if (response) {
          setDashboardStats(response.data.result);
        } else {
          console.error("Failed to fetch dashboard data:");
        }
      } catch (e) {
        console.error("An error occurred while fetching dashboard data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardData: DashboardCardData[] = dashboardStats
    ? [
        {
          icon: <People />,
          title: "Total Users",
          mainValue: dashboardStats.userCard.totalUsers,
          growthRate: dashboardStats.userCard.growthRate,
          growthDirection: "increase",
          details: [
            {
              label: "New users this month",
              value: dashboardStats.userCard.newUsersThisMonth,
            },
          ],
          color: theme.palette.primary.main,
        },
        {
          icon: <StarRate />,
          title: "Total Ratings",
          mainValue: dashboardStats.ratingCard.totalRatings,
          growthRate: dashboardStats.ratingCard.growthRate,
          growthDirection: "increase",
          details: [
            {
              label: "New ratings this month",
              value: dashboardStats.ratingCard.newRatingsThisMonth,
            },
            {
              label: "Average rating",
              value: dashboardStats.ratingCard.averageRating.toFixed(2),
            },
          ],
          color: theme.palette.warning.main,
        },
        {
          icon: <CheckCircleOutline />,
          title: "Submission Analysis",
          mainValue: dashboardStats.reviewSubmission.totalSubmissions,
          growthRate: dashboardStats.reviewSubmission.growthRate,
          growthDirection: "increase",
          details: [
            {
              label: "Successful",
              value:
                dashboardStats.reviewSubmission.submissionsByStatus.find(
                  (s: any) => s._id === "success"
                )?.count || 0,
            },
            {
              label: "Pending",
              value:
                dashboardStats.reviewSubmission.submissionsByStatus.find(
                  (s: any) => s._id === "pending"
                )?.count || 0,
            },
            {
              label: "Success rate",
              value: `${dashboardStats.reviewSubmission.successRate.toFixed(
                2
              )}%`,
            },
          ],
          color: theme.palette.success.main,
        },
        {
          icon: <AccountBalanceWallet />,
          title: "Financial Analysis",
          mainValue: formatCurrency(dashboardStats.balanceCard.finalBalance),
          details: [
            {
              label: "Total credit",
              value: formatCurrency(dashboardStats.balanceCard.totalCredit),
            },
            {
              label: "Total debit",
              value: formatCurrency(dashboardStats.balanceCard.totalDebit),
            },
          ],
          color: theme.palette.info.main,
        },
      ]
    : [];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", overflow: "auto" }}>
      <Container maxWidth="xl" sx={{ mt: 1, mb: 4 }}>
        <Grid container spacing={3}>
          {cardData.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DetailedStatCard {...item} />
            </Grid>
          ))}

          <Grid item xs={12} lg={9}>
            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ mt: 2 }}>
                  <ActionTimelineChart />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={3}>
            <RealTimeDashboard />
          </Grid>
          <Grid item xs={12}>
            <CashFlowChart />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

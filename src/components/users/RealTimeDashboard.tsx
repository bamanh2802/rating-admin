import React, { useState, useEffect } from "react";
import { adminSocketService } from "../../service/socketService"; // <-- THAY ĐỔI ĐƯỜNG DẪN NÀY
import { getRecentActivities } from "../../service/data"; // <-- THAY ĐỔI ĐƯỜNG DẪN NÀY

// MUI Components
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  List,
  Avatar,
  Slide,
  Tooltip,
  CircularProgress,
} from "@mui/material";

// MUI Icons
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  RateReview as RateReviewIcon,
  MonetizationOn as MonetizationOnIcon,
  Settings as SettingsIcon,
  Update as UpdateIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material";

// Định nghĩa kiểu dữ liệu cho một hoạt động được lưu trong state
interface Activity {
  _id?: string;
  type: string;
  message: string;
  created_at: number;
  user_id?: string;
}

// Định nghĩa kiểu cho payload nhận từ socket (created_at có thể không có)
interface ActivityPayloadFromServer {
  _id?: string;
  type: string;
  message: string;
  created_at?: number;
  user_id?: string;
}

// Định nghĩa kiểu cho payload chung từ các sự kiện của admin
interface AdminEventPayload {
  onlineCount?: number;
  activity?: ActivityPayloadFromServer;
}

const RealTimeDashboard: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // State để quản lý trạng thái loading ban đầu

  useEffect(() => {
    // Hàm để tải dữ liệu hoạt động ban đầu từ API
    const fetchInitialActivities = async () => {
      try {
        setIsLoading(true);
        const response = await getRecentActivities();

        // Kiểm tra cẩn thận cấu trúc dữ liệu trả về trước khi cập nhật state
        if (
          response &&
          response.result &&
          Array.isArray(response.result.activities)
        ) {
          setActivities(response.result.activities);
        }
      } catch (error) {
        console.error("Failed to fetch recent activities:", error);
        // Có thể thêm state để hiển thị thông báo lỗi trên UI
      } finally {
        setIsLoading(false);
      }
    };

    // 1. Tải dữ liệu ban đầu
    fetchInitialActivities();

    // 2. Kết nối tới Socket Server
    adminSocketService.connect();

    // --- Đăng ký các trình xử lý sự kiện ---
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);

    adminSocketService.on("connected", handleConnected);
    adminSocketService.on("disconnected", handleDisconnected);

    const handleInitialData = (payload: AdminEventPayload) => {
      if (payload.onlineCount !== undefined) {
        setOnlineCount(payload.onlineCount);
      }
    };

    const handleUserUpdate = (payload: AdminEventPayload) => {
      if (payload.onlineCount !== undefined) {
        setOnlineCount(payload.onlineCount);
      }
    };

    const handleNewActivity = (payload: AdminEventPayload) => {
      if (payload.activity) {
        const newActivity: Activity = {
          ...payload.activity,
          created_at: payload.activity.created_at || Date.now(),
        };

        // Thêm vào đầu danh sách và kiểm tra trùng lặp để tránh hiển thị 2 lần
        setActivities((prevActivities) => {
          if (prevActivities.some((act) => act._id === newActivity._id)) {
            return prevActivities;
          }
          return [newActivity, ...prevActivities].slice(0, 50); // Giới hạn 50 item
        });
      }
      if (payload.onlineCount !== undefined) {
        setOnlineCount(payload.onlineCount);
      }
    };

    adminSocketService.on("admin:initial-data", handleInitialData);
    adminSocketService.on("user:online", handleUserUpdate);
    adminSocketService.on("user:offline", handleUserUpdate);
    adminSocketService.on("activity:new", handleNewActivity);

    // --- Dọn dẹp khi component unmount ---
    return () => {
      adminSocketService.off("connected", handleConnected);
      adminSocketService.off("disconnected", handleDisconnected);
      adminSocketService.off("admin:initial-data", handleInitialData);
      adminSocketService.off("user:online", handleUserUpdate);
      adminSocketService.off("user:offline", handleUserUpdate);
      adminSocketService.off("activity:new", handleNewActivity);
      adminSocketService.disconnect();
    };
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần khi component mount

  // --- Các hàm render phụ ---
  const renderActivityIcon = (type: string) => {
    const iconStyle = { color: "#fff" };
    switch (type) {
      case "login":
        return <LoginIcon sx={iconStyle} />;
      case "register":
        return <PersonAddIcon sx={iconStyle} />;
      case "review":
        return <RateReviewIcon sx={iconStyle} />;
      case "financial":
        return <MonetizationOnIcon sx={iconStyle} />;
      case "system":
        return <SettingsIcon sx={iconStyle} />;
      case "update":
        return <UpdateIcon sx={iconStyle} />;
      default:
        return <HelpOutlineIcon sx={iconStyle} />;
    }
  };

  const getAvatarColor = (type: string) => {
    switch (type) {
      case "login":
        return { bgcolor: "primary.main" };
      case "register":
        return { bgcolor: "success.main" };
      case "review":
        return { bgcolor: "info.main" };
      case "financial":
        return { bgcolor: "warning.main" };
      case "system":
        return { bgcolor: "secondary.main" };
      case "update":
        return { bgcolor: "error.main" };
      default:
        return { bgcolor: "grey.500" };
    }
  };

  // --- Render component ---
  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title="Activities"
        titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
        action={
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              Online: <strong>{onlineCount}</strong>
            </Typography>
            <Chip
              icon={<FiberManualRecordIcon sx={{ fontSize: 12 }} />}
              label={isConnected ? "Live" : "Disconnected"}
              color={isConnected ? "success" : "error"}
              variant="outlined"
              size="small"
              sx={{ fontWeight: "medium" }}
            />
          </Box>
        }
        sx={{ borderBottom: "1px solid", borderColor: "divider", pb: 1 }}
      />

      <CardContent sx={{ p: 1 }}>
        <Box sx={{ maxHeight: 500, overflowY: "auto", borderRadius: 2 }}>
          {isLoading ? (
            <Box py={6} textAlign="center">
              <CircularProgress />
              <Typography color="text.secondary" mt={2}>
                Loading recent activities...
              </Typography>
            </Box>
          ) : activities.length === 0 ? (
            <Box py={6} textAlign="center">
              <Typography color="text.secondary" fontStyle="italic">
                No activities found.
              </Typography>
            </Box>
          ) : (
            <List disablePadding dense>
              {activities.map((activity, index) => (
                <Slide
                  direction="down"
                  in={true}
                  mountOnEnter
                  unmountOnExit
                  timeout={300 + index * 20}
                  key={`${activity._id || index}`}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2,
                      py: 1,
                      mb: 1,
                      boxShadow: 0,
                      borderRadius: 1,
                      backgroundColor: "#fff",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <Avatar
                      sx={{
                        ...getAvatarColor(activity.type),
                        width: 36,
                        height: 36,
                        fontSize: 20,
                      }}
                    >
                      {renderActivityIcon(activity.type)}
                    </Avatar>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexGrow: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Tooltip title={activity.message}>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "75%",
                          }}
                        >
                          {activity.message}
                        </Typography>
                      </Tooltip>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          whiteSpace: "nowrap",
                          ml: 1,
                          minWidth: 60,
                          textAlign: "right",
                        }}
                      >
                        {new Date(activity.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  </Card>
                </Slide>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RealTimeDashboard;

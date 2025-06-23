import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Chip,
  Box,
} from "@mui/material";
import { RateReview, VerifiedUser, MonetizationOn } from "@mui/icons-material";

export interface RecentActivity {
  id: number;
  type: "review" | "verification" | "reward";
  user: string;
  description: string;
  time: string;
  amount?: number;
}

const RecentActivityList: React.FC<{ activities: RecentActivity[] }> = ({
  activities,
}) => (
  <Card elevation={2}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Hoạt động gần đây
      </Typography>
      <List>
        {activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor:
                      activity.type === "review"
                        ? "primary.main"
                        : activity.type === "verification"
                        ? "success.main"
                        : "warning.main",
                  }}
                >
                  {activity.type === "review" ? (
                    <RateReview />
                  ) : activity.type === "verification" ? (
                    <VerifiedUser />
                  ) : (
                    <MonetizationOn />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle2">{activity.user}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    {activity.amount && (
                      <Chip
                        label={`+${activity.amount.toLocaleString()} VND`}
                        color="success"
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </>
                }
              />
            </ListItem>
            {index < activities.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default RecentActivityList;

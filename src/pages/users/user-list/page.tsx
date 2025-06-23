import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import { UserManager } from "../../../type/types";
import UserTable from "../../../components/users/UserTable";
import UserDetailDrawer from "../../../components/users/UserDetailDrawer";
import { getAllUser } from "../../../service/data";
import {
  updateUserInformation,
  updateBalanceScore,
} from "../../../service/update";
import { toast } from "react-toastify";

interface IFilters {
  searchTerm: string;
  role: "all" | "admin" | "user";
  status: "all" | "active" | "inactive";
}

const UserManagementPage: React.FC = () => {
  // Toàn bộ state không đổi
  const [users, setUsers] = useState<UserManager[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserManager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserManager | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<IFilters>({
    searchTerm: "",
    role: "all",
    status: "all",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUser();
        setUsers(response.data.result.result || []);
      } catch (err) {
        setPageError("Could not load user data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);
  useEffect(() => {
    let dataToFilter = [...users];
    if (filters.searchTerm) {
      const lowercasedFilter = filters.searchTerm.toLowerCase();
      dataToFilter = dataToFilter.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercasedFilter) ||
          user.email.toLowerCase().includes(lowercasedFilter)
      );
    }
    if (filters.role !== "all") {
      dataToFilter = dataToFilter.filter((user) => user.role === filters.role);
    }
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      dataToFilter = dataToFilter.filter((user) => user.isActive === isActive);
    }
    setFilteredUsers(dataToFilter);
    setPage(0);
  }, [filters, users]);
  const handleFilterChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSelectUser = (user: UserManager) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSaveUser = async (updatedUser: UserManager, password: string) => {
    if (!selectedUser) return;

    const apiCalls: Promise<any>[] = [];

    const hasBasicInfoChanged =
      updatedUser.name !== selectedUser.name ||
      updatedUser.role !== selectedUser.role;

    if (hasBasicInfoChanged) {
      apiCalls.push(
        updateUserInformation(
          updatedUser.name,
          updatedUser.role as string,
          updatedUser._id
        )
      );
    }

    const hasFinancialInfoChanged =
      updatedUser.balance !== selectedUser.balance ||
      updatedUser.credit_score !== selectedUser.credit_score;

    if (hasFinancialInfoChanged) {
      apiCalls.push(
        updateBalanceScore(
          updatedUser._id,
          updatedUser.balance,
          updatedUser.credit_score,
          password
        )
      );
    }

    if (apiCalls.length === 0) {
      handleCloseDrawer();
      return;
    }

    try {
      await Promise.all(apiCalls);

      const updatedUsersList = users.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      );
      setUsers(updatedUsersList);

      toast.success("User details updated successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Failed to update user details:", error);
      toast.error("Something went wrong!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      handleCloseDrawer();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mb: 4 }}>
      {/* Phần JSX không đổi */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              name="searchTerm"
              placeholder="Search by name or email..."
              value={filters.searchTerm}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={filters.role}
                label="Role"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Not Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : pageError ? (
        <Alert severity="error">{pageError}</Alert>
      ) : (
        <UserTable
          users={filteredUsers}
          onSelectUser={handleSelectUser}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}
      <UserDetailDrawer
        user={selectedUser}
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveUser}
      />
    </Container>
  );
};

export default UserManagementPage;

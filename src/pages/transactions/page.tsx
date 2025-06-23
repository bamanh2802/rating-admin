import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Typography,
  TablePagination,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { SelectChangeEvent } from "@mui/material";

import { TransactionBalance } from "../../type/types";
import TransactionTable from "../../components/tables/TransactionTable";
import { getAllTransactions } from "../../service/data";
import { deleteTransaction, updateTransaction } from "../../service/update";
import { toast } from "react-toastify";

interface ITransactionFilters {
  searchTerm: string;
  type: "all" | "credit" | "debit";
  startDate: Date | null;
  endDate: Date | null;
}

// Interface cho props của Modal chỉnh sửa
interface EditTransactionModalProps {
  open: boolean;
  transaction: TransactionBalance | null;
  onClose: () => void;
  onSave: (updatedTransaction: TransactionBalance) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  open,
  transaction,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<TransactionBalance | null>(
    transaction
  );
  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);
  if (!formData) return null;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: name === "amount" ? parseFloat(value) || 0 : value,
      });
    }
  };
  const handleSelectChange = (e: SelectChangeEvent) => {
    if (formData)
      setFormData({ ...formData, type: e.target.value as "credit" | "debit" });
  };
  const handleSave = () => {
    if (formData) onSave(formData);
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Transaction</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="credit">Credit</MenuItem>
                <MenuItem value="debit">Debit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// COMPONENT TRANG CHÍNH
const TransactionHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionBalance[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionBalance[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ITransactionFilters>({
    searchTerm: "",
    type: "all",
    startDate: null,
    endDate: null,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionBalance | null>(null);
  const [transactionToEdit, setTransactionToEdit] =
    useState<TransactionBalance | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getAllTransactions();
        const fetchedData = response.data.result.result || [];
        setTransactions(fetchedData);
      } catch (err) {
        setError("Could not fetch transaction data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    let dataToFilter = [...transactions];
    if (filters.searchTerm) {
      const lowercasedFilter = filters.searchTerm.toLowerCase();
      dataToFilter = dataToFilter.filter(
        (t) =>
          t.user_id.toLowerCase().includes(lowercasedFilter) ||
          t.reason.toLowerCase().includes(lowercasedFilter)
      );
    }
    if (filters.type !== "all") {
      dataToFilter = dataToFilter.filter((t) => t.type === filters.type);
    }
    if (filters.startDate) {
      const startOfDay = new Date(filters.startDate);
      startOfDay.setHours(0, 0, 0, 0);
      dataToFilter = dataToFilter.filter(
        (t) => new Date(t.created_at) >= startOfDay
      );
    }
    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      dataToFilter = dataToFilter.filter(
        (t) => new Date(t.created_at) <= endOfDay
      );
    }
    setFilteredTransactions(dataToFilter);
    setPage(0);
  }, [filters, transactions]);

  const handleFilterChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleDateChange = (
    date: Date | null,
    field: "startDate" | "endDate"
  ) => {
    setFilters((prev) => ({ ...prev, [field]: date }));
  };
  const handleOpenDeleteDialog = (transaction: TransactionBalance) => {
    setTransactionToDelete(transaction);
  };
  const handleCloseDeleteDialog = () => {
    setTransactionToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction(transactionToDelete._id);
      setTransactions(
        transactions.filter((t) => t._id !== transactionToDelete._id)
      );
      toast.success("Transaction deleted successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      toast.error("Failed to delete transaction.", {
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
      handleCloseDeleteDialog();
    }
  };
  const handleOpenEditModal = (transaction: TransactionBalance) => {
    setTransactionToEdit(transaction);
  };
  const handleCloseEditModal = () => {
    setTransactionToEdit(null);
  };
  const handleSaveEdit = async (updatedTransaction: TransactionBalance) => {
    try {
      await updateTransaction(
        updatedTransaction.reason,
        updatedTransaction.amount,
        updatedTransaction.type,
        updatedTransaction._id
      );
      const updatedList = transactions.map((t) =>
        t._id === updatedTransaction._id ? updatedTransaction : t
      );
      setTransactions(updatedList);
      toast.success("Transaction updated successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      toast.error("Failed to update transaction.", {
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
      handleCloseEditModal();
    }
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

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                name="searchTerm"
                placeholder="Search by User ID or Reason..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  label="Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="credit">Credit</MenuItem>
                  <MenuItem value="debit">Debit</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              {/* SỬA LỖI: Xóa prop 'slots' */}
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleDateChange(date, "startDate")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    variant: "outlined",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              {/* SỬA LỖI: Xóa prop 'slots' */}
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleDateChange(date, "endDate")}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    variant: "outlined",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                noWrap
              >
                Found: <strong>{filteredTransactions.length}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
            <TransactionTable
              transactions={filteredTransactions}
              page={page}
              rowsPerPage={rowsPerPage}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Paper>
        )}

        <Dialog open={!!transactionToDelete} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <EditTransactionModal
          open={!!transactionToEdit}
          transaction={transactionToEdit}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default TransactionHistoryPage;

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { TransactionBalance } from "../../type/types";

interface TransactionTableProps {
  transactions: TransactionBalance[];
  page: number;
  rowsPerPage: number;
  onEdit: (transaction: TransactionBalance) => void;
  onDelete: (transaction: TransactionBalance) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  page,
  rowsPerPage,
  onEdit,
  onDelete,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table stickyHeader aria-label="transaction table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", width: "5%" }}>No.</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
              Amount
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
            <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography color="text.secondary" sx={{ p: 4 }}>
                  No transactions found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            transactions
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Áp dụng phân trang ở đây
              .map((transaction, index) => (
                <TableRow
                  hover
                  key={transaction._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{transaction.reason}</TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color={
                        transaction.type === "credit"
                          ? "success.main"
                          : "error.main"
                      }
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.type.toUpperCase()}
                      color={
                        transaction.type === "credit" ? "success" : "error"
                      }
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(transaction.created_at)}</TableCell>
                  <TableCell align="center">
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(transaction)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(transaction)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;

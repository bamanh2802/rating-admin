import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/dashboard/page";
import AdminLoginPage from "./pages/login/page";
import { AuthProvider, useAuth } from "./context/AuthContext";
import CustomThemeProvider from "./CustomThemeProvider";
import Layout from "./Layout";
import UserManagementPage from "./pages/users/user-list/page";
import TransactionHistoryPage from "./pages/transactions/page";
import AddUserPage from "./pages/users/add-user/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <AdminLoginPage />
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/users/list" element={<UserManagementPage />} />
              <Route path="/users/add" element={<AddUserPage />} />
              <Route
                path="/transactions"
                element={<TransactionHistoryPage />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <ToastContainer />
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;

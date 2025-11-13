import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoutes";
import HomePage from "./pages/HomePage";
import OrderList from "./pages/OrderList";
import RestaurantList from "./pages/RestaurantList";
import MenuList from "./pages/MenuList";
import UserList from "./pages/UserList";
import LoginPage from "./pages/LoginPage";
import "./App.css";

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrderList />
            </ProtectedRoute>
          } />
          <Route path="/restaurants" element={
            <ProtectedRoute>
              <RestaurantList />
            </ProtectedRoute>
          } />
          <Route path="/menus" element={
            <ProtectedRoute>
              <MenuList />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          } />

          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
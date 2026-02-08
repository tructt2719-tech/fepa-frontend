import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Budgets from "./pages/Budgets";
import Debts from "./pages/Debts";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Analytics from "./pages/Analytics";

import Profile from "./components/Profile";

import Login from "./pages/Login";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import PaymentPage from "./pages/PaymentPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import CreateSubscription from "./pages/admin/CreateSubscription";

export default function App() {
  // 🔥 QUAN TRỌNG: BẮT LOGIN LẠI MỖI LẦN VÀO WEB
  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <Routes>
        {/* 🔐 AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* 🏠 MAIN */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/debts" element={<Debts />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/payment"
            element={<PaymentPage onBack={() => {}} onSuccess={() => {}} />}
          />
        </Route>

        {/* 👑 ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="subscriptions/create" element={<CreateSubscription />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

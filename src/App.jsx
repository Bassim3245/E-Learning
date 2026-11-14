import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import RoleRedirect from "./components/RoleRedirect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import "./App.css";

export default function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Default entry point: redirects to dashboard (which sends to /login if unauthenticated) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Central redirect: directs user to /admin, /teacher, or /student based on their role */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />

          {/* Role-Specific Protected Pages with Dedicated Sidebars */}
          <Route
            path="/admin/*"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/teacher/*"
            element={
              <RoleRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/student/*"
            element={
              <RoleRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </RoleRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

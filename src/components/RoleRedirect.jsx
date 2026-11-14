import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRedirect() {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  if (role === "teacher") {
    return <Navigate to="/teacher" replace />;
  }
  return <Navigate to="/student" replace />;
}


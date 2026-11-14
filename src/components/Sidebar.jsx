import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ items, activeItem, onSelect, title = "Navigation" }) {
  const { currentUser, userProfile, role, switchMyRole, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const displayName =
    userProfile?.firstName
      ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
      : userProfile?.username || currentUser?.email?.split("@")[0] || "User";

  // const getRoleBadge = (r) => {
  //   switch (r) {
  //     case "admin":
  //       return <span className="badge role-badge-admin rounded-pill">Admin</span>;
  //     case "teacher":
  //       return <span className="badge role-badge-teacher rounded-pill">Teacher</span>;
  //     case "student":
  //     default:
  //       return <span className="badge role-badge-student rounded-pill">Student</span>;
  //   }
  // };

  return (
    <div
      className="card card-custom border-0 shadow-sm p-3 h-100 d-flex flex-column"
      style={{
        minHeight: "calc(100vh - 120px)",
        backgroundColor: "#ffffff",
        borderRadius: "1rem"
      }}
    >
      {/* User Info Header */}
      <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${
            role === "admin"
              ? "bg-purple"
              : role === "teacher"
              ? "bg-success"
              : "bg-primary"
          }`}
          style={{
            width: "48px",
            height: "48px",
            backgroundColor:
              role === "admin" ? "#7e22ce" : role === "teacher" ? "#059669" : "#4f46e5"
          }}
        >
          {userProfile?.firstName?.charAt(0) || displayName?.charAt(0) || "U"}
        </div>
        <div className="overflow-hidden">
          <div className="fw-bold text-dark text-truncate" style={{ maxWidth: "160px" }}>
            {displayName}
          </div>
          <div className="d-flex align-items-center gap-1 mt-1">
            {/* {getRoleBadge(role)} */}
          </div>
        </div>
      </div>

      {/* Navigation Title */}
      <div
        className="text-uppercase text-muted fw-bold px-2 mb-2"
        style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
      >
        {title}
      </div>

      {/* Nav Items */}
      <div className="nav flex-column nav-pills gap-1 flex-grow-1">
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded-3 transition-all ${
                isActive
                  ? "active shadow-sm fw-semibold"
                  : "text-secondary hover-bg-light"
              }`}
              onClick={() => onSelect(item.id)}
              style={{
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease-in-out"
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge !== null && (
                <span
                  className={`badge rounded-pill ${
                    isActive ? "bg-white text-dark" : "bg-light text-secondary border"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Role Switcher (Convenient for Pair-Programming & Live Testing) */}
      <div className="pt-3 mt-3 border-top">
        {/* <div
          className="text-uppercase text-muted fw-bold px-2 mb-2"
          style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
        >
          Quick Role Switch (للتجربة السريعة):
        </div>
        <div className="btn-group w-100 mb-3" role="group">
          <button
            type="button"
            className={`btn btn-sm ${role === "student" ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => {
              switchMyRole("student");
              navigate("/student");
            }}
            title="Switch to Student view"
          >
            Student
          </button>
          <button
            type="button"
            className={`btn btn-sm ${role === "teacher" ? "btn-success" : "btn-outline-secondary"}`}
            onClick={() => {
              switchMyRole("teacher");
              navigate("/teacher");
            }}
            title="Switch to Teacher view"
          >
            Teacher
          </button>
          <button
            type="button"
            className={`btn btn-sm ${role === "admin" ? "btn-dark" : "btn-outline-secondary"}`}
            onClick={() => {
              switchMyRole("admin");
              navigate("/admin");
            }}
            title="Switch to Admin view"
          >
            Admin
          </button>
        </div> */}

        <button
          type="button"
          className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}


import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  const displayName =
    userProfile?.username ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark py-3 shadow-sm sticky-top"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
          <i className="bi bi-camera-video-fill text-primary"></i>
          <span>
            Adaptive <span style={{ color: "#818cf8" }}>E-Learning</span>
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto ms-lg-3">
            <li className="nav-item">
              <Link className="nav-link text-white-50" to="/">
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            {currentUser && (
              <li className="nav-item">
                <Link className="nav-link text-white" to="/dashboard">
                  <i className="bi bi-grid me-1"></i> Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {currentUser ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 px-3 py-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle fs-5"></i>
                  <span>{displayName}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow">
                  <li className="dropdown-header">
                    <strong>{userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : displayName}</strong>
                    <br />
                    <small className="text-muted">{currentUser.email}</small>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="bi bi-person-badge me-2"></i> My Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      type="button"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light px-3">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Log In
                </Link>
                <Link to="/register" className="btn btn-primary px-3 shadow-sm">
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


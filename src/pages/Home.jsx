import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { currentUser, role } = useAuth();

  const getDashboardLink = () => {
    if (role === "admin") return "/admin";
    if (role === "teacher") return "/teacher";
    return "/student";
  };

  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="row align-items-center g-5 py-4">
        <div className="col-lg-7">
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
            <i className="bi bi-stars me-1"></i> AI-Powered Adaptive Learning
          </span>
          <h1 className="display-5 fw-bold text-dark lh-sm mb-3">
            Adaptive E-Learning Platform using Student Facial Expressions and Feedback
          </h1>
          <p className="lead text-secondary mb-4">
            An intelligent educational environment that monitors student comprehension in real time using webcam emotion analysis and feedback, dynamically adapting lesson difficulty, pacing, and explanations.
          </p>
          <div className="d-flex flex-wrap gap-3">
            {currentUser ? (
              <Link to={getDashboardLink()} className="btn btn-primary btn-lg px-4 shadow-sm">
                <i className="bi bi-grid-fill me-2"></i> Go to My Dashboard ({role.toUpperCase()})
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg px-4 shadow-sm">
                  <i className="bi bi-person-plus-fill me-2"></i> Get Started / Register
                </Link>
                <Link to="/login" className="btn btn-outline-dark btn-lg px-4">
                  <i className="bi bi-box-arrow-in-right me-2"></i> Log In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Roles Cards */}
        <div className="col-lg-5">
          <div className="card card-custom p-4 border-0 shadow">
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-people-fill text-primary me-2"></i>Platform Roles &amp; Portals
              </h5>
              <span className="badge bg-success-subtle text-success">Dedicated Sidebars</span>
            </div>

            <div className="list-group list-group-flush gap-2">
              <div className="list-group-item border rounded-3 p-3 bg-light">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-mortarboard-fill text-primary me-2"></i>Student Portal
                  </h6>
                  <span className="badge role-badge-student">Student</span>
                </div>
                <p className="small text-muted mb-0">
                  Attend adaptive lessons, receive real-time comprehension-based interventions, and monitor learning scores.
                </p>
              </div>

              <div className="list-group-item border rounded-3 p-3 bg-light">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-person-video3 text-success me-2"></i>Teacher Portal
                  </h6>
                  <span className="badge role-badge-teacher">Teacher</span>
                </div>
                <p className="small text-muted mb-0">
                  Manage assigned curriculum, publish adaptive lessons, and track student facial expression analytics.
                </p>
              </div>

              <div className="list-group-item border rounded-3 p-3 bg-light">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-shield-lock-fill text-purple me-2" style={{ color: "#7e22ce" }}></i>Admin Portal
                  </h6>
                  <span className="badge role-badge-admin">Admin</span>
                </div>
                <p className="small text-muted mb-0">
                  Add and connect faculty teachers, manage lessons, configure user roles, and seed demo platform data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Pillars */}
      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <div className="card card-custom h-100 p-4">
            <div className="text-primary fs-1 mb-3">
              <i className="bi bi-emoji-smile"></i>
            </div>
            <h5 className="fw-bold text-dark">Facial Expression Detection</h5>
            <p className="text-secondary small mb-0">
              Detects real-time states like <em>confused</em>, <em>bored</em>, <em>focused</em>, or <em>happy</em> to measure student cognitive engagement.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-custom h-100 p-4">
            <div className="text-primary fs-1 mb-3">
              <i className="bi bi-cpu"></i>
            </div>
            <h5 className="fw-bold text-dark">Dynamic Lesson Adaptation</h5>
            <p className="text-secondary small mb-0">
              If the student looks confused or bored, the lesson automatically offers simplified analogies, interactive examples, or pacing adjustments.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-custom h-100 p-4">
            <div className="text-primary fs-1 mb-3">
              <i className="bi bi-link-45deg"></i>
            </div>
            <h5 className="fw-bold text-dark">Teacher-Lesson Connections</h5>
            <p className="text-secondary small mb-0">
              Lessons are seamlessly assigned to faculty teachers in Firestore, with clear ownership and curriculum tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

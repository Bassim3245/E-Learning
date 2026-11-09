import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();

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
              <Link to="/dashboard" className="btn btn-primary btn-lg px-4 shadow-sm">
                <i className="bi bi-grid-fill me-2"></i> Go to My Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg px-4 shadow-sm">
                  <i className="bi bi-person-plus-fill me-2"></i> Create Account
                </Link>
                <Link to="/login" className="btn btn-outline-dark btn-lg px-4">
                  <i className="bi bi-box-arrow-in-right me-2"></i> Log In
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card card-custom p-4 border-0 shadow">
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-shield-check text-primary me-2"></i>Firebase Cloud Stack
              </h5>
              <span className="badge bg-success-subtle text-success">React + Vite</span>
            </div>

            <div className="list-group list-group-flush gap-2">
              <div className="list-group-item border rounded-3 p-3 bg-light">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-key-fill text-warning me-2"></i>Firebase Authentication
                  </h6>
                  <span className="badge bg-primary-subtle text-primary">Secure Auth</span>
                </div>
                <p className="small text-muted mb-0">
                  Instant, secure authentication with encrypted passwords and session state persistence.
                </p>
              </div>

              <div className="list-group-item border rounded-3 p-3 bg-light">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-database-fill text-info me-2"></i>Cloud Firestore Database
                  </h6>
                  <span className="badge bg-info-subtle text-info">Real-time DB</span>
                </div>
                <p className="small text-muted mb-0">
                  Real-time storage for user profiles, emotion metrics, quiz scores, and personalized feedback.
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
              <i className="bi bi-chat-square-quote"></i>
            </div>
            <h5 className="fw-bold text-dark">Feedback & Assessment</h5>
            <p className="text-secondary small mb-0">
              Pairs facial metrics with direct student feedback and quiz scores to ensure optimal pedagogical retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


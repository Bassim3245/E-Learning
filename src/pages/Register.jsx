import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "student",
    specialization: "",
    phoneNumber: "",
    academicYear: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, firstName, lastName, password, confirmPassword } = formData;

    if (!username.trim() || !email.trim() || !firstName.trim() || !lastName.trim() || !password) {
      setError("Please fill in all required fields marked with an asterisk (*).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      if (formData.role === "admin") {
        navigate("/admin");
      } else if (formData.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email address already exists.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(err.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <div className="card card-custom shadow-lg p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-3">
                <i className="bi bi-person-plus-fill fs-1"></i>
              </div>
              <h3 className="fw-bold text-dark">Create Your Account</h3>
              <p className="text-muted small">Join as a Student, Teacher, or Administrator</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center mb-3">
                <i className="bi bi-exclamation-circle-fill me-2 fs-6"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Account Role Selector */}
              <div className="p-3 mb-4 rounded-3 border bg-light">
                <label className="form-label fw-bold text-dark mb-2" htmlFor="role">
                  <i className="bi bi-shield-shaded me-1 text-primary"></i> Account Role
                </label>
                <div className="row g-2">
                  <div className="col-4">
                    <button
                      type="button"
                      className={`btn w-100 py-2 ${formData.role === "student" ? "btn-primary shadow-sm" : "btn-outline-secondary bg-white"}`}
                      onClick={() => setFormData((p) => ({ ...p, role: "student" }))}
                    >
                      <i className="bi bi-mortarboard me-1 d-block fs-5"></i>
                      <span className="small fw-semibold">Student</span>
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      type="button"
                      className={`btn w-100 py-2 ${formData.role === "teacher" ? "btn-success shadow-sm" : "btn-outline-secondary bg-white"}`}
                      onClick={() => setFormData((p) => ({ ...p, role: "teacher" }))}
                    >
                      <i className="bi bi-person-video3 me-1 d-block fs-5"></i>
                      <span className="small fw-semibold">Teacher</span>
                    </button>
                  </div>
                  <div className="col-4">
                    <button
                      type="button"
                      className={`btn w-100 py-2 ${formData.role === "admin" ? "btn-dark shadow-sm" : "btn-outline-secondary bg-white"}`}
                      onClick={() => setFormData((p) => ({ ...p, role: "admin" }))}
                    >
                      <i className="bi bi-shield-lock me-1 d-block fs-5"></i>
                      <span className="small fw-semibold">Admin</span>
                    </button>
                  </div>
                </div>
                <div className="form-text mt-2 small text-muted">
                  {formData.role === "admin" && "Administrators can add/edit lessons, manage teachers, and oversee the platform."}
                  {formData.role === "teacher" && "Teachers can manage assigned lessons, view student comprehension and emotion feedback."}
                  {formData.role === "student" && "Students participate in interactive lessons with real-time facial expression adaptation."}
                </div>
              </div>

              {/* Username & Email */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small" htmlFor="username">
                    <i className="bi bi-person me-1 text-primary"></i> Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small" htmlFor="email">
                    <i className="bi bi-envelope me-1 text-primary"></i> Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Personal Names */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small" htmlFor="firstName">
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small" htmlFor="lastName">
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Contact & Academic / Specialization */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small" htmlFor="phoneNumber">
                    <i className="bi bi-telephone me-1 text-primary"></i> Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    className="form-control"
                    placeholder="+1 234 567 8900"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  {formData.role === "teacher" ? (
                    <>
                      <label className="form-label fw-semibold text-dark small" htmlFor="specialization">
                        <i className="bi bi-award me-1 text-success"></i> Specialization / Subject
                      </label>
                      <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        className="form-control"
                        placeholder="e.g. Computer Science, AI, Mathematics"
                        value={formData.specialization}
                        onChange={handleChange}
                      />
                    </>
                  ) : (
                    <>
                      <label className="form-label fw-semibold text-dark small" htmlFor="academicYear">
                        <i className="bi bi-mortarboard me-1 text-primary"></i> Academic Year / Level
                      </label>
                      <input
                        type="text"
                        id="academicYear"
                        name="academicYear"
                        className="form-control"
                        placeholder="e.g. 3rd Year / Computer Science"
                        value={formData.academicYear}
                        onChange={handleChange}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Passwords */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small" htmlFor="password">
                    <i className="bi bi-lock me-1 text-primary"></i> Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text small">Minimum 6 characters.</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small" htmlFor="confirmPassword">
                    <i className="bi bi-check2-circle me-1 text-primary"></i> Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text small">Re-type to match password.</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fs-6 fw-semibold shadow-sm mb-3"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-1"></i> Register as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-3 border-top">
              <p className="small text-muted mb-0">
                Already have an account?{" "}
                <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, role, login } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect directly to user's role page
  useEffect(() => {
    if (currentUser) {
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "teacher") navigate("/teacher", { replace: true });
      else navigate("/student", { replace: true });
    }
  }, [currentUser, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!usernameOrEmail.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const user = await login(usernameOrEmail, password);

      // Fetch user's role from Firestore for instant role-based redirect
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userRole = userDoc.exists() ? userDoc.data().role : "student";

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error(err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid username/email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to log in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card card-custom shadow-lg p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-3">
                <i className="bi bi-person-lock fs-1"></i>
              </div>
              <h3 className="fw-bold text-dark">Welcome</h3>
              <p className="text-muted small">Sign in to your account</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center mb-3">
                <i className="bi bi-exclamation-circle-fill me-2 fs-6"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small" htmlFor="usernameOrEmail">
                  <i className="bi bi-person me-1 text-primary"></i> Username or Email
                </label>
                <input
                  type="text"
                  id="usernameOrEmail"
                  className="form-control form-control-lg"
                  placeholder="Enter username or email"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark small mb-1" htmlFor="password">
                  <i className="bi bi-key me-1 text-primary"></i> Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
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
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-1"></i> Log In
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-3 border-top">
              <p className="small text-muted mb-0">
                Don't have an account?{" "}
                <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

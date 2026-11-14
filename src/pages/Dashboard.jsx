import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    academicYear: "",
    bio: ""
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        phoneNumber: userProfile.phoneNumber || "",
        academicYear: userProfile.academicYear || "",
        bio: userProfile.bio || ""
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      setSaving(true);
      await updateUserProfile(editForm);
      setSuccessMsg("Your profile information has been updated successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update profile: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  const fullName =
    userProfile?.firstName && userProfile?.lastName
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : userProfile?.username || currentUser?.email?.split("@")[0] || "User";

  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
    : "Recently";

  return (
    <div className="container py-4">
      {/* Welcome Banner */}
      <h1>Dashboard</h1>
      <div
        className="card card-custom p-4 p-md-5 mb-4 text-white"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "65px", height: "65px" }}
          >
            <i className="bi bi-person-fill fs-2 text-white"></i>
          </div>
          <div>
            <h3 className="fw-bold mb-1">Hello, {fullName}!</h3>
            <p className="text-white-50 mb-0 small">
              Welcome to your Adaptive E-Learning Dashboard &bull; Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {successMsg}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMsg("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMsg}
          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMsg("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card card-custom p-4 mb-4">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-person-badge text-primary me-2"></i> My Information
            </h6>
            <ul className="list-group list-group-flush small">
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Username</span>
                <strong>{userProfile?.username || "—"}</strong>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Full Name</span>
                <span>{fullName}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Email</span>
                <span>{currentUser?.email}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Phone</span>
                <span>{userProfile?.phoneNumber || "Not provided"}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Academic Level</span>
                <span>{userProfile?.academicYear || "Not specified"}</span>
              </li>
              <li className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted">Database</span>
                <span className="badge bg-success-subtle text-success">Cloud Firestore</span>
              </li>
            </ul>
          </div>

          <div className="card card-custom p-4">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-pencil-square text-primary me-2"></i> Edit Profile
            </h6>
            <form onSubmit={handleProfileUpdate}>
              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={editForm.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={editForm.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  className="form-control"
                  value={editForm.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Academic Level</label>
                <input
                  type="text"
                  name="academicYear"
                  className="form-control"
                  value={editForm.academicYear}
                  onChange={handleChange}
                  placeholder="e.g. 3rd Year / Computer Science"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Bio / Notes</label>
                <textarea
                  name="bio"
                  rows="3"
                  className="form-control"
                  value={editForm.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>

              <button type="submit" disabled={saving} className="btn btn-primary btn-sm w-100">
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status"></span> Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-1"></i> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card card-custom p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold text-dark mb-0">
                <i className="bi bi-camera-video text-primary me-2"></i> Emotion-Based Learning Engine
              </h6>
              <span className="badge bg-primary bg-opacity-10 text-primary border">Coming Soon</span>
            </div>
            <p className="text-secondary small mb-3">
              During video lessons, the platform reads student facial expressions in-browser (privacy-first: video frames never leave your device) and automatically adapts the learning pace:
            </p>
            <div className="row g-2 text-center">
              <div className="col-3">
                <div className="border rounded-3 p-2 bg-light">
                  <div className="fs-3">🤔</div>
                  <div className="small fw-semibold">Confused</div>
                  <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Simpler example shown
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="border rounded-3 p-2 bg-light">
                  <div className="fs-3">🥱</div>
                  <div className="small fw-semibold">Bored</div>
                  <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Quiz or skip triggered
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="border rounded-3 p-2 bg-light">
                  <div className="fs-3">🎯</div>
                  <div className="small fw-semibold">Focused</div>
                  <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Normal pace maintained
                  </div>
                </div>
              </div>
              <div className="col-3">
                <div className="border rounded-3 p-2 bg-light">
                  <div className="fs-3">😊</div>
                  <div className="small fw-semibold">Happy</div>
                  <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                    Progress rewarded
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-custom p-4">
            <h6 className="fw-bold text-dark mb-3">
              <i className="bi bi-journal-bookmark text-primary me-2"></i> Learning Modules
            </h6>
            <div className="d-flex flex-column gap-3">
              <div className="border rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="fw-bold mb-0">Introduction to Python Programming</h6>
                  <span className="badge bg-success bg-opacity-10 text-success border">Beginner</span>
                </div>
                <p className="small text-muted mb-2">
                  Variables, Loops, Functions &bull; with adaptive content based on your emotion state.
                </p>
                <div className="progress" style={{ height: "5px" }}>
                  <div className="progress-bar" style={{ width: "25%" }}></div>
                </div>
              </div>
              <div className="border rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="fw-bold mb-0">Data Structures &amp; Algorithms</h6>
                  <span className="badge bg-warning bg-opacity-10 text-warning border">Intermediate</span>
                </div>
                <p className="small text-muted mb-2">
                  Arrays, Stacks, Trees &bull; with real-time quiz adjustment based on your comprehension.
                </p>
                <div className="progress" style={{ height: "5px" }}>
                  <div className="progress-bar bg-warning" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


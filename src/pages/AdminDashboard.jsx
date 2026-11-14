import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import AdminLessonsManager from "../components/AdminLessonsManager";
import AdminTeachersManager from "../components/AdminTeachersManager";
import AdminUsersManager from "../components/AdminUsersManager";
import { subscribeToLessons, subscribeToTeachers, subscribeToUsers } from "../services/lessonService";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { currentUser, userProfile, updateUserProfile, seedDataTrigger } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [lessons, setLessons] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);

  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    bio: ""
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    const unsubLessons = subscribeToLessons(setLessons);
    const unsubTeachers = subscribeToTeachers(setTeachers);
    const unsubUsers = subscribeToUsers(setUsers);

    return () => {
      unsubLessons();
      unsubTeachers();
      unsubUsers();
    };
  }, []);

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        phoneNumber: userProfile.phoneNumber || "",
        bio: userProfile.bio || ""
      });
    }
  }, [userProfile]);

  const handleSeed = async (force = false) => {
    setSeedLoading(true);
    setSeedMessage("");
    try {
      const res = await seedDataTrigger(force);
      setSeedMessage(res.message);
    } catch (err) {
      setSeedMessage("Seeding error: " + err.message);
    } finally {
      setSeedLoading(false);
      setTimeout(() => setSeedMessage(""), 5000);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    try {
      await updateUserProfile(profileForm);
      setProfileMsg("Admin profile updated successfully.");
    } catch (err) {
      setProfileMsg("Update failed: " + err.message);
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(""), 4000);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Dashboard Overview", icon: "bi-speedometer2" },
    { id: "lessons", label: "Lessons (الدروس)", icon: "bi-journal-bookmark-fill", badge: lessons.length },
    { id: "teachers", label: "Teachers (المعلمين)", icon: "bi-person-video3", badge: teachers.length },
    // { id: "users", label: "Users & Roles", icon: "bi-people", badge: users.length },
    // { id: "seed", label: "Seed Demo Data", icon: "bi-database-fill-gear" },
    // { id: "profile", label: "Admin Profile", icon: "bi-person-gear" }
  ];

  const studentsCount = users.filter((u) => u.role === "student" || !u.role).length;

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="row g-4">
        {/* Left Sidebar */}
        <div className="col-lg-3 col-xl-2">
          <Sidebar
            items={sidebarItems}
            activeItem={activeTab}
            onSelect={setActiveTab}
            title="Admin Portal"
          />
        </div>

        {/* Main Content Area */}
        <div className="col-lg-9 col-xl-10">
          <h1>Admin Dashboard</h1>
          {/* <div
            className="card card-custom p-4 p-md-4 mb-4 text-white"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
              borderRadius: "1rem"
            }}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge role-badge-admin px-3 py-1 rounded-pill">
                    Administrator Workspace
                  </span>
                  <span className="text-white-50 small">&bull; Full System Control</span>
                </div>
                <h3 className="fw-bold mb-0">
                  Welcome, {userProfile?.firstName || userProfile?.username || "Admin"}!
                </h3>
                <p className="text-white-50 small mb-0 mt-1">
                  Manage teachers, create and connect adaptive lessons, and monitor user enrollment.
                </p>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-2"
                  onClick={() => handleSeed(true)}
                  disabled={seedLoading}
                >
                  <i className="bi bi-arrow-repeat"></i>
                  <span>{seedLoading ? "Seeding..." : "Reset Demo Data"}</span>
                </button>
              </div>
            </div>
          </div> */}

          {/* {seedMessage && (
            <div className="alert alert-info py-2 px-3 small d-flex align-items-center mb-4">
              <i className="bi bi-info-circle-fill me-2 fs-6"></i>
              <div>{seedMessage}</div>
            </div>
          )} */}

          {/* TAB 1: OVERVIEW */}
          {/* {activeTab === "overview" && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-xl-3">
                  <div
                    className="card card-custom p-3 cursor-pointer"
                    onClick={() => setActiveTab("lessons")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Total Lessons</div>
                        <h2 className="fw-bold text-dark mb-0">{lessons.length}</h2>
                        <small className="text-primary fw-semibold">View &amp; Edit &rarr;</small>
                      </div>
                      <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                        <i className="bi bi-journal-code fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-xl-3">
                  <div
                    className="card card-custom p-3"
                    onClick={() => setActiveTab("teachers")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Active Teachers</div>
                        <h2 className="fw-bold text-success mb-0">{teachers.length}</h2>
                        <small className="text-success fw-semibold">Manage Faculty &rarr;</small>
                      </div>
                      <div className="bg-success-subtle text-success p-3 rounded-circle">
                        <i className="bi bi-person-video3 fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-xl-3">
                  <div
                    className="card card-custom p-3"
                    onClick={() => setActiveTab("users")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Registered Students</div>
                        <h2 className="fw-bold text-info mb-0">{studentsCount}</h2>
                        <small className="text-info fw-semibold">View Accounts &rarr;</small>
                      </div>
                      <div className="bg-info-subtle text-info p-3 rounded-circle">
                        <i className="bi bi-mortarboard fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-xl-3">
                  <div className="card card-custom p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Facial Engine</div>
                        <h5 className="fw-bold text-dark mb-0 mt-2">face-api.js</h5>
                        <span className="badge bg-success-subtle text-success mt-1">Ready</span>
                      </div>
                      <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                        <i className="bi bi-camera-video fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-lg-7">
                  <div className="card card-custom p-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold text-dark mb-0">
                        <i className="bi bi-journal-text text-primary me-2"></i>
                        Recent Lessons (أحدث الدروس)
                      </h5>
                      <button
                        className="btn btn-sm btn-link text-decoration-none"
                        onClick={() => setActiveTab("lessons")}
                      >
                        Manage All
                      </button>
                    </div>
                    {lessons.length === 0 ? (
                      <div className="text-center py-4 text-muted">
                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                        No lessons created yet. Click "Seed Demo Data" or "Lessons" to add.
                      </div>
                    ) : (
                      <div className="list-group list-group-flush gap-2">
                        {lessons.slice(0, 4).map((l) => (
                          <div
                            key={l.id}
                            className="list-group-item border rounded-3 p-3 bg-light d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <div className="fw-bold text-dark">{l.title}</div>
                              <small className="text-muted">
                                Subject: {l.subject} &bull; Instructor:{" "}
                                <strong>{l.teacherName || "Unassigned"}</strong>
                              </small>
                            </div>
                            <span className="badge bg-primary-subtle text-primary">
                              {l.difficulty}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-lg-5">
                  <div className="card card-custom p-4 h-100">
                    <h5 className="fw-bold text-dark mb-3">
                      <i className="bi bi-lightning-charge text-warning me-2"></i>
                      Quick Admin Actions
                    </h5>
                    <div className="d-flex flex-column gap-2">
                      <button
                        className="btn btn-outline-primary text-start p-3 rounded-3 d-flex align-items-center justify-content-between"
                        onClick={() => setActiveTab("lessons")}
                      >
                        <div>
                          <div className="fw-bold">
                            <i className="bi bi-plus-circle me-2"></i>Add New Lesson
                          </div>
                          <small className="text-muted">
                            Create lesson content and link to a teacher
                          </small>
                        </div>
                        <i className="bi bi-chevron-right text-muted"></i>
                      </button>

                      <button
                        className="btn btn-outline-success text-start p-3 rounded-3 d-flex align-items-center justify-content-between"
                        onClick={() => setActiveTab("teachers")}
                      >
                        <div>
                          <div className="fw-bold">
                            <i className="bi bi-person-plus me-2"></i>Add Faculty Teacher
                          </div>
                          <small className="text-muted">
                            Register new teacher &amp; assign specialization
                          </small>
                        </div>
                        <i className="bi bi-chevron-right text-muted"></i>
                      </button>

                      <button
                        className="btn btn-outline-dark text-start p-3 rounded-3 d-flex align-items-center justify-content-between"
                        onClick={() => setActiveTab("seed")}
                      >
                        <div>
                          <div className="fw-bold">
                            <i className="bi bi-database-fill-gear me-2"></i>Demo Data &amp; Connections
                          </div>
                          <small className="text-muted">
                            Verify or re-seed teacher-lesson mappings
                          </small>
                        </div>
                        <i className="bi bi-chevron-right text-muted"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* TAB 2: LESSONS MANAGEMENT */}
          {/* {activeTab === "lessons" && (
            <AdminLessonsManager
              lessons={lessons}
              teachers={teachers}
              onRefresh={() => {}}
            />
          )} */}

          {/* TAB 3: TEACHERS MANAGEMENT */}
          {/* {activeTab === "teachers" && (
            <AdminTeachersManager
              teachers={teachers}
              lessons={lessons}
              onRefresh={() => {}}
            />
          )} */}

          {/* TAB 4: USERS & ROLES */}
          {/* {activeTab === "users" && (
            <AdminUsersManager
              users={users}
              currentUserId={currentUser?.uid}
              onRefresh={() => {}}
            />
          )} */}

          {/* TAB 5: SEED DATA */}
          {/* {activeTab === "seed" && (
            <div className="card card-custom p-4">
              <h5 className="fw-bold text-dark mb-2">
                <i className="bi bi-database-fill-gear text-primary me-2"></i>
                Database Seed &amp; Relations Center
              </h5>
              <p className="text-muted small mb-4">
                Seed initial demo faculty teachers (Dr. Sarah Ahmed, Prof. Omar Hassan, Eng. Mona Ali)
                and assign adaptive lessons connected to each teacher in the <code>teacher_lessons</code> collection.
              </p>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 bg-light">
                    <h6 className="fw-bold text-dark mb-2">
                      <i className="bi bi-check2-circle text-success me-2"></i>
                      Demo Seed Data Included:
                    </h6>
                    <ul className="small text-muted mb-0">
                      <li>3 Verified Teachers with AI, Python &amp; Web specializations.</li>
                      <li>4 Connected Adaptive Lessons mapped to specific teachers.</li>
                      <li>Relationship mapping populated in <code>teacher_lessons</code>.</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded-3 bg-light">
                    <h6 className="fw-bold text-dark mb-2">
                      <i className="bi bi-shield-check text-primary me-2"></i>
                      Current Firestore Status:
                    </h6>
                    <div className="small text-dark">
                      Lessons in DB: <strong>{lessons.length}</strong>
                    </div>
                    <div className="small text-dark">
                      Teachers in DB: <strong>{teachers.length}</strong>
                    </div>
                    <div className="small text-dark">
                      Total Registered Users: <strong>{users.length}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary px-4 shadow-sm"
                  onClick={() => handleSeed(true)}
                  disabled={seedLoading}
                >
                  <i className="bi bi-play-circle me-1"></i>
                  {seedLoading ? "Populating Firestore..." : "Seed / Reset All Demo Data"}
                </button>
              </div>
            </div>
          )} */}

          {/* TAB 6: ADMIN PROFILE */}
          {/* {activeTab === "profile" && (
            <div className="card card-custom p-4" style={{ maxWidth: "600px" }}>
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-person-gear text-primary me-2"></i>
                Administrator Profile
              </h5>

              {profileMsg && (
                <div className="alert alert-info py-2 small mb-3">{profileMsg}</div>
              )}

              <form onSubmit={handleProfileSave}>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-muted">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, lastName: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentUser?.email || ""}
                    disabled
                  />
                  <div className="form-text small">Email cannot be changed directly.</div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.phoneNumber}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phoneNumber: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Bio / Notes</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="btn btn-primary btn-sm px-4"
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}


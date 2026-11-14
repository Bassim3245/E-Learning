import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { subscribeToLessons, addLesson, updateLesson, deleteLesson } from "../services/lessonService";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [allLessons, setAllLessons] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    subject: userProfile?.specialization || "Computer Science",
    difficulty: "Beginner",
    durationMinutes: 35,
    videoUrl: ""
  });

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    phoneNumber: "",
    bio: ""
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    const unsub = subscribeToLessons(setAllLessons);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        specialization: userProfile.specialization || "Computer Science & AI",
        phoneNumber: userProfile.phoneNumber || "",
        bio: userProfile.bio || ""
      });
    }
  }, [userProfile]);

  // Filter lessons assigned to this teacher (matches uid or teacherId or email)
  const myLessons = allLessons.filter(
    (l) =>
      l.teacherId === currentUser?.uid ||
      l.teacherId === userProfile?.uid ||
      l.teacherEmail === currentUser?.email
  );

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;

    setLoading(true);
    setAlertMsg("");

    const teacherFullName = `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim() || userProfile?.username || "Teacher";

    try {
      const payload = {
        ...lessonForm,
        teacherId: currentUser.uid,
        teacherName: teacherFullName,
        teacherEmail: currentUser.email,
        status: "published"
      };

      if (editingLesson) {
        await updateLesson(editingLesson.id, payload);
        setAlertMsg(`Lesson "${lessonForm.title}" updated.`);
      } else {
        await addLesson(payload);
        setAlertMsg(`New lesson "${lessonForm.title}" published!`);
      }

      setShowAddModal(false);
      setEditingLesson(null);
      setLessonForm({
        title: "",
        description: "",
        subject: userProfile?.specialization || "Computer Science",
        difficulty: "Beginner",
        durationMinutes: 35,
        videoUrl: ""
      });
    } catch (err) {
      setAlertMsg("Error: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMsg(""), 4000);
    }
  };

  const handleDelete = async (lesson) => {
    if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;
    try {
      await deleteLesson(lesson.id);
      setAlertMsg(`Lesson deleted.`);
    } catch (err) {
      setAlertMsg("Delete failed: " + err.message);
    } finally {
      setTimeout(() => setAlertMsg(""), 4000);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    try {
      await updateUserProfile(profileForm);
      setProfileMsg("Teacher profile updated successfully.");
    } catch (err) {
      setProfileMsg("Update failed: " + err.message);
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(""), 4000);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: "bi-speedometer2" },
    { id: "my_lessons", label: "My Lessons (دروسي)", icon: "bi-journal-bookmark-fill", badge: myLessons.length },
    // { id: "analytics", label: "Student Emotion Insights", icon: "bi-graph-up-arrow" },
    // { id: "profile", label: "Teacher Profile", icon: "bi-person-badge" }
  ];

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="row g-4">
        {/* Left Sidebar */}
        <div className="col-lg-3 col-xl-2">
          <Sidebar
            items={sidebarItems}
            activeItem={activeTab}
            onSelect={setActiveTab}
            title="Teacher Portal"
          />
        </div>

        {/* Main Content Area */}
        <div className="col-lg-9 col-xl-10">


          {alertMsg && (
            <div className="alert alert-info py-2 px-3 small d-flex align-items-center mb-4">
              <i className="bi bi-info-circle-fill me-2 fs-6"></i>
              <div>{alertMsg}</div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-xl-4">
                  <div className="card card-custom p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">My Active Lessons</div>
                        <h2 className="fw-bold text-success mb-0">{myLessons.length}</h2>
                        <small className="text-muted">Assigned directly to you</small>
                      </div>
                      <div className="bg-success-subtle text-success p-3 rounded-circle">
                        <i className="bi bi-journal-check fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-xl-4">
                  <div className="card card-custom p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Average Student Focus</div>
                        <h2 className="fw-bold text-primary mb-0">82%</h2>
                        <small className="text-success fw-semibold">
                          <i className="bi bi-arrow-up-short"></i> +5% from last week
                        </small>
                      </div>
                      <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                        <i className="bi bi-bullseye fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-xl-4">
                  <div className="card card-custom p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Confusion Rate</div>
                        <h2 className="fw-bold text-warning mb-0">14%</h2>
                        <small className="text-muted">Auto-triggers simplified analogies</small>
                      </div>
                      <div className="bg-warning-subtle text-warning p-3 rounded-circle">
                        <i className="bi bi-question-circle fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card card-custom p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">
                    <i className="bi bi-journal-bookmark text-success me-2"></i>
                    My Assigned Curriculum
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => {
                      setEditingLesson(null);
                      setShowAddModal(true);
                    }}
                  >
                    <i className="bi bi-plus-lg me-1"></i> Add Lesson
                  </button>
                </div>

                {myLessons.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-journal-x fs-1 d-block mb-2"></i>
                    You don't have any lessons assigned yet. Click "Add New Lesson" above to create one.
                  </div>
                ) : (
                  <div className="row g-3">
                    {myLessons.map((lesson) => (
                      <div key={lesson.id} className="col-md-6">
                        <div className="border rounded-3 p-3 bg-light h-100 d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge bg-success-subtle text-success">
                              {lesson.subject}
                            </span>
                            <span className="badge bg-secondary-subtle text-secondary">
                              {lesson.difficulty}
                            </span>
                          </div>
                          <h6 className="fw-bold text-dark">{lesson.title}</h6>
                          <p className="small text-muted mb-3 flex-grow-1">
                            {lesson.description || "Adaptive lesson content."}
                          </p>
                          <div className="d-flex justify-content-between align-items-center border-top pt-2">
                            <span className="small text-muted">
                              <i className="bi bi-clock me-1"></i> {lesson.durationMinutes || 30} mins
                            </span>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                  setEditingLesson(lesson);
                                  setLessonForm({
                                    title: lesson.title,
                                    description: lesson.description || "",
                                    subject: lesson.subject || "Computer Science",
                                    difficulty: lesson.difficulty || "Beginner",
                                    durationMinutes: lesson.durationMinutes || 35,
                                    videoUrl: lesson.videoUrl || ""
                                  });
                                  setShowAddModal(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(lesson)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY LESSONS FULL VIEW */}
          {activeTab === "my_lessons" && (
            <div className="card card-custom p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark mb-0">
                  <i className="bi bi-collection text-success me-2"></i>
                  Manage All My Lessons ({myLessons.length})
                </h5>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    setEditingLesson(null);
                    setShowAddModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i> Add Lesson
                </button>
              </div>

              {myLessons.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <i className="bi bi-folder-x fs-1 mb-2"></i>
                  <p>No lessons assigned yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light small">
                      <tr>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Difficulty</th>
                        <th>Duration</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myLessons.map((l) => (
                        <tr key={l.id}>
                          <td className="fw-bold text-dark">{l.title}</td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              {l.subject}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-primary-subtle text-primary">
                              {l.difficulty}
                            </span>
                          </td>
                          <td className="small text-muted">{l.durationMinutes || 30} mins</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => {
                                setEditingLesson(l);
                                setLessonForm(l);
                                setShowAddModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(l)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EMOTION ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="card card-custom p-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-camera-video text-success me-2"></i>
                Student Facial Expression Analytics
              </h5>
              <p className="text-muted small mb-4">
                Real-time breakdown of aggregated emotional states registered by students during active video lectures.
              </p>

              <div className="row g-4 mb-4">
                <div className="col-md-3">
                  <div className="p-3 border rounded text-center bg-light">
                    <div className="fs-1">🎯</div>
                    <h4 className="fw-bold text-primary mb-0">58%</h4>
                    <div className="small fw-semibold mt-1">Focused</div>
                    <small className="text-muted">Student is engaged</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="p-3 border rounded text-center bg-light">
                    <div className="fs-1">🤔</div>
                    <h4 className="fw-bold text-warning mb-0">21%</h4>
                    <div className="small fw-semibold mt-1">Confused</div>
                    <small className="text-muted">Adaptive trigger: simpler analogies</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="p-3 border rounded text-center bg-light">
                    <div className="fs-1">😊</div>
                    <h4 className="fw-bold text-success mb-0">15%</h4>
                    <div className="small fw-semibold mt-1">Happy / Receptive</div>
                    <small className="text-muted">Comprehending easily</small>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="p-3 border rounded text-center bg-light">
                    <div className="fs-1">🥱</div>
                    <h4 className="fw-bold text-danger mb-0">6%</h4>
                    <div className="small fw-semibold mt-1">Bored</div>
                    <small className="text-muted">Adaptive trigger: short quiz</small>
                  </div>
                </div>
              </div>

              <div className="alert alert-info py-3 px-3 small d-flex align-items-center">
                <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                <div>
                  <strong>Pedagogical Insight:</strong> Lessons with short interactive checkpoints (every 8-10 minutes) showed a 42% decrease in student confusion metrics.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEACHER PROFILE */}
          {activeTab === "profile" && (
            <div className="card card-custom p-4" style={{ maxWidth: "600px" }}>
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-person-badge text-success me-2"></i>
                Teacher Profile &amp; Credentials
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
                  <label className="form-label small fw-semibold text-muted">
                    Specialization / Academic Field
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.specialization}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, specialization: e.target.value })
                    }
                    placeholder="e.g. AI & Computer Vision"
                  />
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
                  <label className="form-label small fw-semibold text-muted">Bio</label>
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
                  className="btn btn-success btn-sm px-4"
                >
                  {profileSaving ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Lesson Modal for Teacher */}
      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "1rem" }}>
              <div className="modal-header border-bottom py-3">
                <h5 className="modal-title fw-bold text-dark">
                  {editingLesson ? "Edit Lesson" : "Create New Lesson"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleLessonSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Lesson Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={lessonForm.title}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        value={lessonForm.subject}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, subject: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold text-dark">Difficulty</label>
                      <select
                        className="form-select"
                        value={lessonForm.difficulty}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, difficulty: e.target.value })
                        }
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small fw-semibold text-dark">Duration (mins)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={lessonForm.durationMinutes}
                        onChange={(e) =>
                          setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Video / Content URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={lessonForm.videoUrl}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, videoUrl: e.target.value })
                      }
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-dark">Description</label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={lessonForm.description}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top py-3">
                  <button
                    type="button"
                    className="btn btn-light border btn-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-success btn-sm px-4">
                    {loading ? "Saving..." : editingLesson ? "Save Changes" : "Publish Lesson"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


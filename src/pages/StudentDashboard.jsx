import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StudentLessonsView from "../components/StudentLessonsView";
import { subscribeToLessons } from "../services/lessonService";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [lessons, setLessons] = useState([]);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    academicYear: "",
    bio: ""
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    const unsub = subscribeToLessons(setLessons);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        phoneNumber: userProfile.phoneNumber || "",
        academicYear: userProfile.academicYear || "",
        bio: userProfile.bio || ""
      });
    }
  }, [userProfile]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    try {
      await updateUserProfile(profileForm);
      setProfileMsg("Profile updated successfully.");
    } catch (err) {
      setProfileMsg("Failed: " + err.message);
    } finally {
      setProfileSaving(false);
      setTimeout(() => setProfileMsg(""), 4000);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "My Learning", icon: "bi-speedometer2" },
    { id: "lessons", label: "Browse Lessons (الدروس)", icon: "bi-journal-bookmark-fill", badge: lessons.length },
    // { id: "emotion", label: "Facial Emotion Engine", icon: "bi-camera-video-fill" },
    // { id: "profile", label: "My Profile", icon: "bi-person-badge" }
  ];

  const displayName =
    userProfile?.firstName
      ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
      : userProfile?.username || "Student";

  return (
    <div className="container-fluid py-4 px-lg-4">
      <div className="row g-4">
        {/* Left Sidebar */}
        <div className="col-lg-3 col-xl-2">
          <Sidebar
            items={sidebarItems}
            activeItem={activeTab}
            onSelect={setActiveTab}
            title="Student Portal"
          />
        </div>

        {/* Main Content Area */}
        <div className="col-lg-9 col-xl-10">
       

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-sm-6 col-xl-4">
                  <div className="card card-custom p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Available Lessons</div>
                        <h2 className="fw-bold text-dark mb-0">{lessons.length}</h2>
                        <small className="text-primary fw-semibold cursor-pointer" onClick={() => setActiveTab("lessons")}>
                          Browse Catalog &rarr;
                        </small>
                      </div>
                      <div className="bg-primary-subtle text-primary p-3 rounded-circle">
                        <i className="bi bi-journal-code fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-xl-4">
                  <div className="card card-custom p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Adaptive Learning Status</div>
                        <h5 className="fw-bold text-success mb-0 mt-2">Webcam Sync Ready</h5>
                        <small className="text-muted">In-browser emotion detection</small>
                      </div>
                      <div className="bg-success-subtle text-success p-3 rounded-circle">
                        <i className="bi bi-camera-video fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-6 col-xl-4">
                  <div className="card card-custom p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small fw-semibold">Academic Level</div>
                        <h5 className="fw-bold text-dark mb-0 mt-2">
                          {userProfile?.academicYear || "Undergraduate"}
                        </h5>
                        <small className="text-muted">Personalized difficulty</small>
                      </div>
                      <div className="bg-info-subtle text-info p-3 rounded-circle">
                        <i className="bi bi-mortarboard fs-3"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card card-custom p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">
                    <i className="bi bi-emoji-smile text-primary me-2"></i>
                    How Your Facial Expressions Adapt Your Lessons
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setActiveTab("emotion")}
                  >
                    View Details
                  </button>
                </div>
                <div className="row g-2 text-center">
                  <div className="col-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <div className="fs-2">🤔</div>
                      <div className="fw-bold small text-dark mt-1">Confused</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Triggers simplified analogies
                      </div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <div className="fs-2">🥱</div>
                      <div className="fw-bold small text-dark mt-1">Bored</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Triggers quick interactive quiz
                      </div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <div className="fs-2">🎯</div>
                      <div className="fw-bold small text-dark mt-1">Focused</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Maintains regular pace
                      </div>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-3 border rounded-3 bg-light">
                      <div className="fs-2">😊</div>
                      <div className="fw-bold small text-dark mt-1">Happy</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Unlocks advanced topics
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card card-custom p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">
                    <i className="bi bi-journal-check text-primary me-2"></i>
                    Recommended Lessons for You
                  </h5>
                  <button
                    className="btn btn-sm btn-link text-decoration-none"
                    onClick={() => setActiveTab("lessons")}
                  >
                    View All ({lessons.length})
                  </button>
                </div>
                <div className="row g-3">
                  {lessons.slice(0, 2).map((lesson) => (
                    <div key={lesson.id} className="col-md-6">
                      <div className="border rounded-3 p-3 bg-light h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge bg-primary-subtle text-primary">
                            {lesson.subject}
                          </span>
                          <span className="badge bg-secondary-subtle text-secondary">
                            {lesson.difficulty}
                          </span>
                        </div>
                        <h6 className="fw-bold text-dark">{lesson.title}</h6>
                        <p className="small text-muted mb-3 flex-grow-1">
                          {lesson.description}
                        </p>
                        <div className="border-top pt-2 d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            <i className="bi bi-person-video3 me-1"></i>
                            {lesson.teacherName}
                          </small>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => setActiveTab("lessons")}
                          >
                            Start &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BROWSE LESSONS */}
          {activeTab === "lessons" && <StudentLessonsView lessons={lessons} />}

          {/* TAB 3: EMOTION ENGINE */}
          {activeTab === "emotion" && (
            <div className="card card-custom p-4">
              <h5 className="fw-bold text-dark mb-2">
                <i className="bi bi-camera-video text-primary me-2"></i>
                Adaptive Facial Emotion Analysis Pipeline
              </h5>
              <p className="text-muted small mb-4">
                Powered by in-browser face-api.js neural networks. Privacy-First: No camera images are ever uploaded to any server.
              </p>

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="border rounded-3 p-3 bg-light h-100">
                    <h6 className="fw-bold text-dark mb-2">
                      <i className="bi bi-diagram-3 text-primary me-2"></i>
                      Adaptation Logic Flow:
                    </h6>
                    <ol className="small text-secondary ps-3 mb-0">
                      <li className="mb-2">
                        <strong>Webcam Stream:</strong> Captures video locally at 5-second intervals.
                      </li>
                      <li className="mb-2">
                        <strong>Landmark Analysis:</strong> Calculates eyebrow furrows, gaze vector, and lip curvature.
                      </li>
                      <li className="mb-2">
                        <strong>Emotion Classification:</strong> Categorized into Confused, Bored, Focused, or Happy.
                      </li>
                      <li className="mb-2">
                        <strong>Dynamic Action:</strong> If confusion stays &gt; 30s, the platform halts and injects a 30-second animated summary or micro-quiz.
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded-3 p-3 bg-light h-100">
                    <h6 className="fw-bold text-dark mb-2">
                      <i className="bi bi-shield-check text-success me-2"></i>
                      Privacy &amp; Security Guarantee:
                    </h6>
                    <ul className="small text-secondary ps-3 mb-0">
                      <li className="mb-2">Video frames stay entirely inside your browser's RAM memory.</li>
                      <li className="mb-2">Only anonymized numeric engagement timestamps are synchronized.</li>
                      <li className="mb-2">You can pause or disable the webcam at any point during lessons.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button className="btn btn-primary px-4" onClick={() => setActiveTab("lessons")}>
                  <i className="bi bi-mortarboard me-2"></i> Browse Adaptive Lessons Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === "profile" && (
            <div className="card card-custom p-4" style={{ maxWidth: "600px" }}>
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-person-badge text-primary me-2"></i>
                Student Information &amp; Grade Level
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
                  <label className="form-label small fw-semibold text-muted">Academic Level / Year</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profileForm.academicYear}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, academicYear: e.target.value })
                    }
                    placeholder="e.g. 3rd Year / Computer Science"
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
                  <label className="form-label small fw-semibold text-muted">Bio / Learning Goals</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    placeholder="What are you hoping to learn?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className="btn btn-primary btn-sm px-4"
                >
                  {profileSaving ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


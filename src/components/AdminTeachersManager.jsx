import React, { useState } from "react";
import { addTeacher } from "../services/lessonService";

export default function AdminTeachersManager({ teachers, lessons, onRefresh, onSelectTeacherForLesson }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    specialization: "Computer Science & AI",
    phoneNumber: "",
    bio: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) return;

    setLoading(true);
    setAlertMsg("");

    try {
      await addTeacher(formData);
      setAlertMsg(`Teacher ${formData.firstName} ${formData.lastName} added successfully.`);
      setShowModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        specialization: "Computer Science & AI",
        phoneNumber: "",
        bio: ""
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setAlertMsg("Error adding teacher: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMsg(""), 4000);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold mb-1 text-dark">
            <i className="bi bi-people-fill text-success me-2"></i>
            Teachers Management (إدارة المعلمين)
          </h5>
          <p className="text-muted small mb-0">
            Add faculty members and monitor lessons assigned to each teacher.
          </p>
        </div>
        <button
          className="btn btn-success btn-sm px-3 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-person-plus-fill me-1"></i> Add New Teacher (إضافة معلم)
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-info py-2 px-3 small d-flex align-items-center mb-3">
          <i className="bi bi-info-circle-fill me-2 fs-6"></i>
          <div>{alertMsg}</div>
        </div>
      )}

      {/* Teachers Grid */}
      <div className="row g-3">
        {teachers.map((teacher) => {
          // Find all lessons linked to this teacher
          const teacherLessons = lessons.filter(
            (l) => l.teacherId === teacher.id || l.teacherId === teacher.uid
          );

          return (
            <div key={teacher.id || teacher.uid} className="col-md-6 col-xl-4">
              <div className="card card-custom h-100 p-4 border shadow-sm">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center fw-bold fs-4"
                    style={{ width: "55px", height: "55px" }}
                  >
                    {teacher.firstName?.charAt(0) || "T"}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark">
                      {teacher.firstName} {teacher.lastName}
                    </h6>
                    <span className="badge role-badge-teacher rounded-pill small mt-1">
                      {teacher.specialization || "Instructor"}
                    </span>
                  </div>
                </div>

                <div className="list-group list-group-flush small mb-3">
                  <div className="list-group-item px-0 d-flex justify-content-between">
                    <span className="text-muted">
                      <i className="bi bi-envelope me-1"></i> Email:
                    </span>
                    <span className="text-dark text-truncate" style={{ maxWidth: "180px" }}>
                      {teacher.email}
                    </span>
                  </div>
                  {teacher.phoneNumber && (
                    <div className="list-group-item px-0 d-flex justify-content-between">
                      <span className="text-muted">
                        <i className="bi bi-telephone me-1"></i> Phone:
                      </span>
                      <span className="text-dark">{teacher.phoneNumber}</span>
                    </div>
                  )}
                  <div className="list-group-item px-0 d-flex justify-content-between">
                    <span className="text-muted">
                      <i className="bi bi-journal-check me-1"></i> Connected Lessons:
                    </span>
                    <strong className="text-primary">{teacherLessons.length} lessons</strong>
                  </div>
                </div>

                {/* List of Connected Lessons */}
                <div className="mt-auto pt-2 border-top">
                  <div className="small fw-semibold text-dark mb-2">Assigned Lessons:</div>
                  {teacherLessons.length === 0 ? (
                    <p className="text-muted small fst-italic mb-0">No lessons assigned yet.</p>
                  ) : (
                    <ul className="list-unstyled small mb-0">
                      {teacherLessons.slice(0, 3).map((l) => (
                        <li key={l.id} className="text-truncate mb-1 text-secondary">
                          <i className="bi bi-arrow-right-short text-primary"></i> {l.title}
                        </li>
                      ))}
                      {teacherLessons.length > 3 && (
                        <li className="text-muted fst-italic" style={{ fontSize: "0.75rem" }}>
                          +{teacherLessons.length - 3} more lessons...
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "1rem" }}>
              <div className="modal-header border-bottom py-3">
                <h5 className="modal-title fw-bold text-dark">
                  <i className="bi bi-person-plus text-success me-2"></i>
                  Add New Teacher (إضافة معلم جديد)
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-dark">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Dr. Sarah"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-dark">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Ahmed"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="teacher@elearning.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Specialization / Academic Field
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Artificial Intelligence & Computer Vision"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+1 234 567 8900"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-dark">Bio / Qualifications</label>
                    <textarea
                      rows="2"
                      className="form-control"
                      placeholder="Short professional biography..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top py-3">
                  <button
                    type="button"
                    className="btn btn-light border btn-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-success btn-sm px-4">
                    {loading ? "Adding..." : "Save Teacher"}
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


import React, { useState } from "react";
import { addLesson, updateLesson, deleteLesson } from "../services/lessonService";

export default function AdminLessonsManager({ lessons, teachers, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [filterTeacher, setFilterTeacher] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const initialForm = {
    title: "",
    description: "",
    subject: "Computer Science",
    difficulty: "Beginner",
    durationMinutes: 30,
    videoUrl: "",
    teacherId: "",
    status: "published"
  };

  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingLesson(null);
    setFormData({
      ...initialForm,
      teacherId: teachers.length > 0 ? teachers[0].id : ""
    });
    setShowModal(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title || "",
      description: lesson.description || "",
      subject: lesson.subject || "Computer Science",
      difficulty: lesson.difficulty || "Beginner",
      durationMinutes: lesson.durationMinutes || 30,
      videoUrl: lesson.videoUrl || "",
      teacherId: lesson.teacherId || "",
      status: lesson.status || "published"
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLesson(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    setAlertMsg("");

    try {
      const selectedTeacher = teachers.find((t) => t.id === formData.teacherId);
      const teacherName = selectedTeacher
        ? `${selectedTeacher.firstName} ${selectedTeacher.lastName}`.trim() || selectedTeacher.username
        : "Unassigned";
      const teacherEmail = selectedTeacher ? selectedTeacher.email || "" : "";

      const payload = {
        ...formData,
        teacherName,
        teacherEmail
      };

      if (editingLesson) {
        await updateLesson(editingLesson.id, payload);
        setAlertMsg(`Lesson "${formData.title}" updated successfully.`);
      } else {
        await addLesson(payload);
        setAlertMsg(`New lesson "${formData.title}" added and linked to teacher ${teacherName}.`);
      }

      closeModal();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setAlertMsg("Error saving lesson: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMsg(""), 4000);
    }
  };

  const handleDelete = async (lesson) => {
    if (!window.confirm(`Are you sure you want to delete lesson "${lesson.title}"?`)) return;

    try {
      await deleteLesson(lesson.id);
      setAlertMsg(`Lesson "${lesson.title}" deleted.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      setAlertMsg("Failed to delete lesson: " + err.message);
    } finally {
      setTimeout(() => setAlertMsg(""), 4000);
    }
  };

  // Filter lessons
  const filteredLessons = lessons.filter((l) => {
    const matchesSearch =
      l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.teacherName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeacher = !filterTeacher || l.teacherId === filterTeacher;
    return matchesSearch && matchesTeacher;
  });

  return (
    <div>
      {/* Top Bar: Action & Filter */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold mb-1 text-dark">
            <i className="bi bi-journal-bookmark-fill text-primary me-2"></i>
            Lessons Management (الدروس)
          </h5>
          <p className="text-muted small mb-0">
            Create, edit, and connect lessons with assigned teachers.
          </p>
        </div>
        <button className="btn btn-primary btn-sm px-3 shadow-sm" onClick={openAddModal}>
          <i className="bi bi-plus-circle me-1"></i> Add New Lesson (إضافة درس)
        </button>
      </div>

      {alertMsg && (
        <div className="alert alert-info py-2 px-3 small d-flex align-items-center mb-3">
          <i className="bi bi-info-circle-fill me-2 fs-6"></i>
          <div>{alertMsg}</div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card card-custom p-3 mb-4 bg-light">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search lessons by title, subject, or teacher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select form-select-sm"
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
            >
              <option value="">All Teachers (جميع المعلمين)</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName} ({t.specialization || "Teacher"})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2 text-md-end text-muted small">
            Total: <strong>{filteredLessons.length}</strong>
          </div>
        </div>
      </div>

      {/* Lessons Table / Cards */}
      {filteredLessons.length === 0 ? (
        <div className="card card-custom p-5 text-center text-muted">
          <i className="bi bi-journal-x fs-1 mb-2 text-secondary"></i>
          <h6>No lessons found</h6>
          <p className="small mb-3">Get started by creating your first adaptive lesson!</p>
          <div>
            <button className="btn btn-primary btn-sm" onClick={openAddModal}>
              <i className="bi bi-plus-lg me-1"></i> Add Lesson
            </button>
          </div>
        </div>
      ) : (
        <div className="table-responsive card card-custom">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th>Lesson Title (عنوان الدرس)</th>
                <th>Subject</th>
                <th>Difficulty</th>
                <th>Duration</th>
                <th>Assigned Teacher (المعلم المرتبط)</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>
                    <div className="fw-bold text-dark">{lesson.title}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: "280px" }}>
                      {lesson.description || "No description"}
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary">
                      {lesson.subject || "General"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        lesson.difficulty === "Beginner"
                          ? "bg-success-subtle text-success"
                          : lesson.difficulty === "Intermediate"
                          ? "bg-warning-subtle text-warning"
                          : "bg-danger-subtle text-danger"
                      }`}
                    >
                      {lesson.difficulty}
                    </span>
                  </td>
                  <td className="small text-muted">{lesson.durationMinutes || 30} mins</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge role-badge-teacher rounded-pill">
                        <i className="bi bi-person-video3 me-1"></i>
                        {lesson.teacherName || "Unassigned"}
                      </span>
                    </div>
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => openEditModal(lesson)}
                      title="Edit Lesson"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(lesson)}
                      title="Delete Lesson"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Lesson Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "1rem" }}>
              <div className="modal-header border-bottom py-3">
                <h5 className="modal-title fw-bold text-dark">
                  <i className="bi bi-journal-plus text-primary me-2"></i>
                  {editingLesson ? "Edit Lesson (تعديل الدرس)" : "Add New Lesson (إضافة درس جديد)"}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {/* Title & Subject */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-semibold text-dark">
                        Lesson Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Facial Emotion Recognition Fundamentals"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-dark">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. AI & Computer Vision"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Connect Teacher Dropdown */}
                  <div className="p-3 mb-3 rounded-3 border bg-light">
                    <label className="form-label small fw-bold text-dark mb-1">
                      <i className="bi bi-link-45deg text-primary me-1 fs-5"></i>
                      Connect to Teacher (ربط الدرس بالمعلم)
                    </label>
                    <select
                      className="form-select"
                      value={formData.teacherId}
                      onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    >
                      <option value="">-- Select Teacher --</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.firstName} {t.lastName} ({t.specialization || "Teacher"}) - {t.email}
                        </option>
                      ))}
                    </select>
                    <div className="form-text small text-muted">
                      This lesson will be assigned to this teacher and saved in the <code>teacher_lessons</code> connection collection.
                    </div>
                  </div>

                  {/* Difficulty, Duration, Status */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-dark">Difficulty</label>
                      <select
                        className="form-select"
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      >
                        <option value="Beginner">Beginner (مبتدئ)</option>
                        <option value="Intermediate">Intermediate (متوسط)</option>
                        <option value="Advanced">Advanced (متقدم)</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-dark">Duration (Minutes)</label>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        className="form-control"
                        value={formData.durationMinutes}
                        onChange={(e) =>
                          setFormData({ ...formData, durationMinutes: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-dark">Status</label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Video URL */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-dark">
                      Lesson Video / Content URL
                    </label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-dark">
                      Lesson Content &amp; Adaptation Rules
                    </label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder="Explain the lesson objectives and what happens when the student is confused or bored..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top py-3">
                  <button type="button" className="btn btn-light border btn-sm" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-primary btn-sm px-4">
                    {loading ? "Saving..." : editingLesson ? "Save Changes" : "Create & Link Lesson"}
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


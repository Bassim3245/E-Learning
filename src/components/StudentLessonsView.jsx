import React, { useState } from "react";

export default function StudentLessonsView({ lessons, onSelectLesson }) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [activeLesson, setActiveLesson] = useState(null);

  const subjects = Array.from(new Set(lessons.map((l) => l.subject).filter(Boolean)));

  const filtered = lessons.filter((l) => {
    const matchSub = !selectedSubject || l.subject === selectedSubject;
    const matchDiff = !selectedDifficulty || l.difficulty === selectedDifficulty;
    return matchSub && matchDiff;
  });

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold mb-1 text-dark">
            <i className="bi bi-mortarboard text-primary me-2"></i>
            Available Adaptive Lessons (الدروس المتاحة)
          </h5>
          <p className="text-muted small mb-0">
            Lessons adapt to your facial comprehension signals in real-time.
          </p>
        </div>

        {/* Filters */}
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ width: "160px" }}
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{ width: "140px" }}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card card-custom p-5 text-center text-muted">
          <i className="bi bi-inbox fs-1 mb-2"></i>
          <p className="mb-0">No lessons available matching your filters.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((lesson) => (
            <div key={lesson.id} className="col-md-6">
              <div className="card card-custom h-100 p-4 border shadow-sm d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                    {lesson.subject || "General"}
                  </span>
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
                </div>

                <h5 className="fw-bold text-dark mb-2">{lesson.title}</h5>

                <p className="small text-secondary mb-3 flex-grow-1">
                  {lesson.description || "Interactive adaptive lesson with facial emotion feedback."}
                </p>

                {/* Connected Teacher Badge */}
                <div className="p-2 mb-3 rounded bg-light border d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2 small">
                    <i className="bi bi-person-video3 text-success fs-5"></i>
                    <div>
                      <div className="fw-semibold text-dark">{lesson.teacherName || "Faculty Instructor"}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Instructor / Teacher
                      </div>
                    </div>
                  </div>
                  <span className="small text-muted">
                    <i className="bi bi-clock me-1"></i>
                    {lesson.durationMinutes || 30} mins
                  </span>
                </div>

                <button
                  className="btn btn-outline-primary btn-sm w-100 fw-semibold"
                  onClick={() => setActiveLesson(lesson)}
                >
                  <i className="bi bi-play-circle me-1"></i> Start Adaptive Lesson
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lesson Player / Preview Modal */}
      {activeLesson && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "1rem" }}>
              <div className="modal-header border-bottom py-3">
                <div>
                  <span className="badge bg-primary-subtle text-primary me-2">
                    {activeLesson.subject}
                  </span>
                  <h5 className="modal-title fw-bold text-dark d-inline">
                    {activeLesson.title}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setActiveLesson(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div
                  className="p-3 mb-3 text-white rounded-3 d-flex align-items-center justify-content-between"
                  style={{ background: "#0f172a" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-camera-video-fill text-danger fs-4"></i>
                    <div>
                      <strong>Camera Emotion Detection: Active</strong>
                      <div className="text-white-50 small">
                        Reading facial expressions locally via face-api.js
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-success-subtle text-success">
                    <i className="bi bi-circle-fill me-1" style={{ fontSize: "0.5rem" }}></i>
                    Monitoring
                  </span>
                </div>

                <div className="border rounded-3 p-4 bg-light mb-3 text-center">
                  <i className="bi bi-display fs-1 text-primary mb-2 d-block"></i>
                  <h6>Lesson Interactive Stream</h6>
                  <p className="text-muted small mb-0">{activeLesson.description}</p>
                  {activeLesson.videoUrl && (
                    <div className="mt-2">
                      <a
                        href={activeLesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <i className="bi bi-box-arrow-up-right me-1"></i> Open Video Resource
                      </a>
                    </div>
                  )}
                </div>

                <div className="card p-3 border">
                  <div className="fw-semibold text-dark small mb-2">
                    Instructor: <strong>{activeLesson.teacherName}</strong>
                  </div>
                  <p className="small text-muted mb-0">
                    If your expression registers as <em>Confused</em>, the explanation will automatically break down into simpler visual analogies. If you appear <em>Bored</em>, interactive quizzes will trigger.
                  </p>
                </div>
              </div>
              <div className="modal-footer border-top py-3">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setActiveLesson(null)}
                >
                  Close Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


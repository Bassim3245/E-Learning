import React from "react";

export default function Footer() {
  return (
    <footer className="py-3 bg-white text-muted small mt-auto border-top">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <div>
          <strong>Adaptive E-Learning Platform</strong> &bull; Facial Expressions &amp; Real-time Feedback
        </div>
        <div>
          Powered by React &bull; Vite &bull; Firebase
        </div>
      </div>
    </footer>
  );
}


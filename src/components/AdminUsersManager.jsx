import React, { useState } from "react";
import { updateUserRole } from "../services/lessonService";

export default function AdminUsersManager({ users, currentUserId, onRefresh }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, newRole);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update user role", err);
      alert("Error updating role: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold mb-1 text-dark">
            <i className="bi bi-people text-primary me-2"></i>
            User Role Management (إدارة المستخدمين والأدوار)
          </h5>
          <p className="text-muted small mb-0">
            View all accounts and assign roles: Admin, Teacher, or Student.
          </p>
        </div>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "200px" }}
          />
          <select
            className="form-select form-select-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: "140px" }}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
      </div>

      <div className="table-responsive card card-custom">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light small text-uppercase">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Change Role</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id || u.uid}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle bg-light border d-flex align-items-center justify-content-center text-secondary fw-bold"
                      style={{ width: "36px", height: "36px" }}
                    >
                      {u.firstName?.charAt(0) || u.username?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="fw-bold text-dark">
                        {u.firstName ? `${u.firstName} ${u.lastName}` : u.username}
                        {(u.id === currentUserId || u.uid === currentUserId) && (
                          <span className="badge bg-secondary-subtle text-secondary ms-1">You</span>
                        )}
                      </div>
                      <small className="text-muted">@{u.username}</small>
                    </div>
                  </div>
                </td>
                <td className="small text-muted">{u.email}</td>
                <td>
                  <span
                    className={`badge rounded-pill ${
                      u.role === "admin"
                        ? "role-badge-admin"
                        : u.role === "teacher"
                        ? "role-badge-teacher"
                        : "role-badge-student"
                    }`}
                  >
                    {u.role ? u.role.toUpperCase() : "STUDENT"}
                  </span>
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={u.role || "student"}
                    disabled={updatingId === (u.id || u.uid)}
                    onChange={(e) => handleRoleChange(u.id || u.uid, e.target.value)}
                    style={{ width: "130px" }}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="small text-muted">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


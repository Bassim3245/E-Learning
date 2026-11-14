import React, { useState } from "react";
import { updateUserRole, addUser, updateUser, deleteUser } from "../services/lessonService";

export default function AdminUsersManager({ users = [], currentUserId, onRefresh }) {
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    role: "student",
    phoneNumber: ""
  };
  const [formData, setFormData] = useState(initialFormData);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormData(initialFormData);
    setModalMode("add");
    setSelectedUserId(null);
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    const id = user.id || user.uid;
    setSelectedUserId(id);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      username: user.username || "",
      role: user.role || "student",
      phoneNumber: user.phoneNumber || ""
    });
    setModalMode("edit");
    setShowModal(true);
  };

  // Submit Add or Edit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      showAlert("Email is required.", "danger");
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === "add") {
        await addUser(formData);
        showAlert(`User ${formData.firstName || formData.email} created successfully.`);
      } else {
        await updateUser(selectedUserId, formData);
        showAlert(`User updated successfully.`);
      }
      setShowModal(false);
      setFormData(initialFormData);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      showAlert(`Operation failed: ${err.message}`, "danger");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete User
  const handleDelete = async (user) => {
    const id = user.id || user.uid;
    if (id === currentUserId) {
      showAlert("You cannot delete your own active administrator account.", "danger");
      return;
    }

    const userName = user.firstName ? `${user.firstName} ${user.lastName}` : (user.username || user.email);
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }

    try {
      setUpdatingId(id);
      await deleteUser(id);
      showAlert(`User "${userName}" deleted successfully.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      showAlert(`Failed to delete user: ${err.message}`, "danger");
    } finally {
      setUpdatingId(null);
    }
  };

  // Quick Role Change
  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, newRole);
      showAlert("Role updated successfully.");
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update user role", err);
      showAlert("Error updating role: " + err.message, "danger");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const searchLower = search.toLowerCase();
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchLower) ||
      (u.username && u.username.toLowerCase().includes(searchLower)) ||
      (u.email && u.email.toLowerCase().includes(searchLower));
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Alert Notification */}
      {alert.message && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show py-2 px-3 small d-flex align-items-center mb-3`}
          role="alert"
        >
          <i
            className={`bi ${
              alert.type === "danger" ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"
            } me-2`}
          ></i>
          <div>{alert.message}</div>
          <button
            type="button"
            className="btn-close ms-auto p-2"
            onClick={() => setAlert({ message: "", type: "" })}
          ></button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h5 className="fw-bold mb-1 text-dark">
            <i className="bi bi-people text-primary me-2"></i>
            User Management (إدارة المستخدمين)
          </h5>
          <p className="text-muted small mb-0">
            Total users: {users.length} | Add, edit, assign roles, or delete users.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "180px" }}
          />
          <select
            className="form-select form-select-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: "130px" }}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <button
            className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-1 shadow-sm"
            onClick={handleOpenAdd}
          >
            <i className="bi bi-person-plus-fill"></i>
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="card card-custom border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th style={{ minWidth: "220px" }}>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Change Role</th>
                <th>Joined</th>
                <th className="text-end" style={{ minWidth: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted small">
                    <i className="bi bi-inbox fs-4 d-block mb-1 text-secondary"></i>
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const id = u.id || u.uid;
                  const isCurrent = id === currentUserId;
                  const displayName = u.firstName
                    ? `${u.firstName} ${u.lastName || ""}`.trim()
                    : u.username || u.email?.split("@")[0] || "User";

                  return (
                    <tr key={id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${
                              u.role === "admin"
                                ? "bg-purple"
                                : u.role === "teacher"
                                ? "bg-success"
                                : "bg-primary"
                            }`}
                            style={{
                              width: "36px",
                              height: "36px",
                              backgroundColor:
                                u.role === "admin"
                                  ? "#7e22ce"
                                  : u.role === "teacher"
                                  ? "#059669"
                                  : "#4f46e5",
                              fontSize: "0.85rem"
                            }}
                          >
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-bold text-dark">
                              {displayName}
                              {isCurrent && (
                                <span className="badge bg-secondary-subtle text-secondary ms-1">
                                  You
                                </span>
                              )}
                            </div>
                            <small className="text-muted">
                              {u.username ? `@${u.username}` : u.phoneNumber || "No username"}
                            </small>
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
                          disabled={updatingId === id}
                          onChange={(e) => handleRoleChange(id, e.target.value)}
                          style={{ width: "125px" }}
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="small text-muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>

                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            title="Edit User"
                            onClick={() => handleOpenEdit(u)}
                            disabled={updatingId === id}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete User"
                            onClick={() => handleDelete(u)}
                            disabled={updatingId === id || isCurrent}
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.55)", backdropFilter: "blur(2px)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "1rem" }}>
              <div className="modal-header border-bottom pb-3">
                <h6 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <i
                    className={`bi ${
                      modalMode === "add" ? "bi-person-plus text-primary" : "bi-pencil-square text-primary"
                    }`}
                  ></i>
                  {modalMode === "add" ? "Add New User" : "Edit User Details"}
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body py-3">
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">First Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Last Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Email Address *</label>
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Username</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-muted">Role</label>
                      <select
                        className="form-select form-select-sm"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-muted">Phone Number</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="+123456789"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer border-top pt-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-3"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary px-4 shadow-sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>Saving...</span>
                    ) : modalMode === "add" ? (
                      "Create User"
                    ) : (
                      "Save Changes"
                    )}
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

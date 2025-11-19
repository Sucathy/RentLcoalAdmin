import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AdminDetails.css"; // Reuse the same styles as user table

const AdminDetails = () => {
  const [admins, setAdmins] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Fetch all admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/alladmins`);
      const data = await res.json();
      setAdmins(data);
    } catch (err) {
      console.error("Failed to fetch admin details:", err);
    }
  };

  // Delete admin
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      await fetch(`${process.env.REACT_APP_API_BASE}/api/alladmins/${id}`, {
        method: "DELETE",
      });
      setAdmins(admins.filter((admin) => admin._id !== id));
    } catch (err) {
      console.error("Failed to delete admin:", err);
    }
  };

  // Open edit modal
  const handleEditClick = (admin) => {
    setEditingAdmin(admin._id);
    setFormData({
      email: admin.email || "",
      password: "", // leave password empty for security
    });
  };

  // Update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit form
  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/alladmins/${editingAdmin}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setAdmins(admins.map((a) => (a._id === editingAdmin ? data : a)));
      setEditingAdmin(null);
    } catch (err) {
      console.error("Failed to update admin:", err);
    }
  };

  return (
    <div className="user-details-container">
      <h2>All Admin Accounts</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin, index) => (
              <tr key={admin._id}>
                <td>{index + 1}</td>
                <td>{admin.email}</td>
                <td>
                  <FaEdit
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => handleEditClick(admin)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(admin._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No admins found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingAdmin && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Admin</h3>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New Password"
            />
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditingAdmin(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDetails;

import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./UserDetails.css";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    age: "",
    gender: "",
    phoneNumber: "",
    profileImage: "",
  });

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/allusers");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetch(`http://localhost:5000/api/allusers/${id}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  // Open edit modal
  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      username: user.username || "",
      fullName: user.fullName || "",
      email: user.email || "",
      age: user.age || "",
      gender: user.gender || "",
      phoneNumber: user.phoneNumber || "",
      profileImage: user.profileImage || "",
    });
  };

  // Update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edit form
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/allusers/${editingUser}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setUsers(users.map((u) => (u._id === editingUser ? data : u)));
      setEditingUser(null);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  return (
    <div className="user-details-container">
      <h2>All Registered Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User Name</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone Number</th>
            <th>Profile Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.username || "N/A"}</td>
                <td>{user.fullName || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{user.age || "N/A"}</td>
                <td>{user.gender || "N/A"}</td>
                <td>{user.phoneNumber || "N/A"}</td>
                <td>
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <FaEdit
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => handleEditClick(user)}
                  />
                  <FaTrash
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDelete(user._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
            <input name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
            <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
            <input name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="Profile Image URL" />
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;

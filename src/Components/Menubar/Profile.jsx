import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // ✅ Use sessionStorage to match AdminLogin
  const token = sessionStorage.getItem("adminToken");

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!token) {
        navigate("/adminlogin"); // redirect if not logged in
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/api/adminAuth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Invalid or expired token");

        const data = await res.json();
        setAdmin(data.admin);
        setFormData({
          email: data.admin.email || "",
          role: data.admin.role || "",
        });
      } catch (err) {
        console.error("Token verification failed:", err);
        sessionStorage.removeItem("adminToken"); // remove invalid token
        navigate("/adminlogin");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [token, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admins/${admin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const updatedAdmin = await res.json();
      if (!res.ok) throw new Error(updatedAdmin.message || "Failed to update");

      setAdmin(updatedAdmin.admin || updatedAdmin);
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile: " + err.message);
    }
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  if (!admin) return null; // redirect handled in useEffect

  return (
    <div className="profile-outer">
      <div className="profile-card">
        <div className="profile-card-header">
          <button onClick={() => navigate(-1)}>← Back</button>
        </div>

        <h2>Admin Profile</h2>

        <table className="profile-table">
          <tbody>
            <tr>
              <td>Email:</td>
              <td>{admin.email}</td>
            </tr>
            <tr>
              <td>Role:</td>
              <td>{admin.role}</td>
            </tr>
          </tbody>
        </table>

        {editMode ? (
          <div className="edit-section">
            <label>
              Change Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        )}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;

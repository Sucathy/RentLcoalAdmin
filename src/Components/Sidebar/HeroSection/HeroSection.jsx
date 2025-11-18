import axios from "axios";
import { useEffect, useState } from "react";
import "./HeroSection.css";

const API = "http://localhost:5000/api/hero"; // 🔁 Your backend URL

const HeroSection = () => {
  const [images, setImages] = useState([]);
  const [formUrl, setFormUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(API);
      setImages(res.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleAdd = async () => {
    if (!formUrl) return;
    try {
      const res = await axios.post(API, { url: formUrl });
      setImages([...images, res.data]);
      setFormUrl("");
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setImages(images.filter((img) => img._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (img) => {
    setEditingId(img._id);
    setFormUrl(img.url);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API}/${editingId}`, { url: formUrl });
      setImages(
        images.map((img) =>
          img._id === editingId ? res.data : img
        )
      );
      setEditingId(null);
      setFormUrl("");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="hero-admin">
      <h2>Hero Section Management</h2>

      <div className="form-row">
        <input
          type="text"
          value={formUrl}
          onChange={(e) => setFormUrl(e.target.value)}
          placeholder="Enter image URL"
        />
        <button onClick={editingId ? handleUpdate : handleAdd}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <table className="hero-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Preview</th>
            <th>Image URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((img, index) => (
            <tr key={img._id}>
              <td>{index + 1}</td>
              <td>
                <img src={img.url} alt="preview" className="preview-img" />
              </td>
              <td className="text-wrap">{img.url}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(img)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(img._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HeroSection;

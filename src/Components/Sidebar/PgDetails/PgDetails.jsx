import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PgDetails.css";

const API = `${process.env.REACT_APP_API_BASE}/api/pgdetails`,

// Property Type Cards
const propertyTypes = [
  { id: "Pg", name: "PG" },
  { id: "House", name: "House" },
  { id: "Flat / Apartment", name: "Flat / Apartment" },
  { id: "Guest House", name: "Guest House" },
  { id: "Farm", name: "Farm" },
];

const PgDetails = () => {
  const [pgList, setPgList] = useState([]);
  const [filteredType, setFilteredType] = useState("Pg");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      setError("You are not logged in as admin");
      setLoading(false);
      return;
    }
    fetchPGDetails(token);
  }, []);

  const fetchPGDetails = async (token) => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPgList(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch PG details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      setError("You are not logged in as admin");
      return;
    }

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPgList(pgList.filter((pg) => pg._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete PG");
    }
  };

  // Filter based on selected property type
  const filteredList = pgList.filter((pg) => pg.propertyType === filteredType);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="pgdetails-admin">
      <h2>Manager</h2>

      {/* Property Type Cards */}
      <div className="property-card-container">
        {propertyTypes.map((type) => (
          <div
            key={type.id}
            className={`property-card ${filteredType === type.id ? "active-card" : ""
              }`}
            onClick={() => setFilteredType(type.id)}
          >
            <h4>{type.name}</h4>
          </div>
        ))}
      </div>

      <div className="table-header">
        <h3>
          📋 Showing: <span>{filteredType}</span> Details
        </h3>
        <button onClick={() => navigate(`/pgdetails/add`)} className="add-btn">
          ➕ Add
        </button>
      </div>

      {/* Filtered PG Table */}
      <table className="pg-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Property Type</th>
            <th>Location</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length > 0 ? (
            filteredList.map((pg, index) => (
              <tr key={pg._id}>
                <td>{index + 1}</td>
                <td>{pg.title}</td>
                <td>{pg.propertyType}</td>
                <td>{pg.location}</td>
                <td>₹{pg.price}</td>
                <td>
                  <button
                    onClick={() => navigate(`/pgdetails/edit/${pg._id}`)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pg._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                No {filteredType} details found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PgDetails;

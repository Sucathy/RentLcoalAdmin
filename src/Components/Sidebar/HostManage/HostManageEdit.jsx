

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./HostManageEdit.css";

const BACKEND_URL = (`${process.env.REACT_APP_API_BASE}`)
const API = `${BACKEND_URL}/api/host`;

const HostManageEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = sessionStorage.getItem("adminToken");

    const [formData, setFormData] = useState({
        userId: "",
        propertyType: "",
        pgType: "",
        bhkType: "",
        roomType: "",
        location: {
            country: "",
            state: "",
            city: "",
            street: "",
            landmark: "",
            locality: "",
            pincode: "",
        },
        locationmap: {
            latitude: "",
            longitude: "",
        },
        details: { guests: 0, bedrooms: 0, beds: 0, bathrooms: 0 },

        price: {
            monthly: 0,
            serviceFee: 100,
            deposit: {
                pgDeposit: { advance: 50000 },
                houseDeposit: {
                    "1BHK": 50000,
                    "2BHK": 60000,
                    "3BHK": 80000,
                    "4BHK": 120000,
                },
                flatDeposit: {
                    "1BHK": 70000,
                    "2BHK": 80000,
                    "3BHK": 90000,
                    "4BHK": 150000,
                },
            },
        },

        hostDetails: { name: "", contact: "" },
        title: "",
        description: "",
        images: [],
        status: "",
    });

    const [newImage, setNewImage] = useState("");

    // ⬇ Fetch host
    useEffect(() => {
        const fetchHost = async () => {
            try {
                const res = await axios.get(`${API}/${id}`, {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                });

                if (res.data.host) {
                    setFormData(res.data.host);
                }
            } catch (err) {
                console.error("Error fetching host:", err);
                alert("Failed to load host");
            }
        };

        fetchHost();
    }, [id, token]);

    // ⬇ Basic input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ⬇ Nested object update: location, details, etc.
    const handleNestedChange = (section, key, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    // ⬇ Add image
    const handleAddImage = () => {
        if (!newImage.trim()) return;
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, newImage.trim()],
        }));
        setNewImage("");
    };

    // ⬇ Delete image
    const handleDeleteImage = (index) => {
        const updated = formData.images.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, images: updated }));
    };

    // ⬇ Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(`${API}/${id}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (res.data.success) {
                alert("Host updated successfully!");
                navigate("/admin/host-manage");
            }
        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.message || "Update failed");
        }
    };

    return (
        <div className="host-edit-container">
            <div className="host-edit-card">
                <h2>Edit Host Listing</h2>

                <form onSubmit={handleSubmit} className="host-edit-form">
                    {/* User ID */}
                    <div className="form-group">
                        <label>User ID</label>
                        <input name="userId" value={formData.userId} onChange={handleChange} />
                    </div>

                    {/* Property Type */}
                    <div className="form-group">
                        <label>Property Type</label>
                        <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
                            <option value="">Select Property Type</option>
                            <option value="Pg">Pg</option>
                            <option value="House">House</option>
                            <option value="Flat/Apartment">Flat/Apartment</option>
                            <option value="Guest House">Guest House</option>
                            <option value="Farm">Farm</option>
                        </select>
                    </div>

                    {/* Simple inputs */}
                    {["pgType", "bhkType", "roomType", "title", "description"].map((key) => (
                        <div className="form-group" key={key}>
                            <label>{key}</label>
                            <input name={key} value={formData[key]} onChange={handleChange} />
                        </div>
                    ))}

                    {/* Location */}
                    <div className="nested-section">
                        <h4>Location</h4>
                        <div className="nested-grid">
                            {Object.keys(formData.location).map((key) => (
                                <div className="form-group" key={key}>
                                    <label>{key}</label>
                                    <input
                                        value={formData.location[key]}
                                        onChange={(e) => handleNestedChange("location", key, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="nested-section">
                        <h4>Coordinates</h4>
                        {["latitude", "longitude"].map((key) => (
                            <div className="form-group" key={key}>
                                <label>{key}</label>
                                <input
                                    type="number"
                                    value={formData.locationmap[key]}
                                    onChange={(e) => handleNestedChange("locationmap", key, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Details */}
                    <div className="nested-section">
                        <h4>Details</h4>
                        <div className="nested-grid">
                            {Object.keys(formData.details).map((key) => (
                                <div className="form-group" key={key}>
                                    <label>{key}</label>
                                    <input
                                        type="number"
                                        value={formData.details[key]}
                                        onChange={(e) => handleNestedChange("details", key, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="nested-section">
                        <h4>Price</h4>
                        <div className="form-group">
                            <label>Monthly</label>
                            <input
                                type="number"
                                value={formData.price.monthly}
                                onChange={(e) => handleNestedChange("price", "monthly", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Host Details */}
                    <div className="nested-section">
                        <h4>Host Details</h4>
                        {Object.keys(formData.hostDetails).map((key) => (
                            <div className="form-group" key={key}>
                                <label>{key}</label>
                                <input
                                    value={formData.hostDetails[key]}
                                    onChange={(e) => handleNestedChange("hostDetails", key, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Images */}
                    <div className="images-section">
                        <h4>Images</h4>

                        <div className="image-preview-wrapper">
                            {formData.images.map((img, index) => (
                                <div className="image-box" key={index}>
                                    <img
                                        src={img.startsWith("http") ? img : `${BACKEND_URL}/${img}`}
                                        alt="preview"
                                        className="preview-img"
                                    />
                                    <button type="button" onClick={() => handleDeleteImage(index)}>
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="add-image">
                            <input
                                type="text"
                                placeholder="Add image URL"
                                value={newImage}
                                onChange={(e) => setNewImage(e.target.value)}
                            />
                            <button type="button" onClick={handleAddImage}>
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="form-actions">
                        <button type="submit" className="save-btn">Save Changes</button>
                        <button type="button" className="save-btn" onClick={() => navigate("/admin/host-manage")}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HostManageEdit;

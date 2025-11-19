
import axios from "axios";
import {
    AirVent,
    Bike,
    Coffee,
    Cpu,
    Heart,
    Home,
    Monitor,
    Table,
    Thermometer,
    Tv,
    Wifi,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPg.css";

const API = (`${process.env.REACT_APP_API_BASE}/api/pgdetails`),

// Amenity list (must match backend format)
const amenitiesList = [
    { name: "AC", type: "AirVent", icon: <AirVent size={18} /> },
    { name: "Washing Machine", type: "Cpu", icon: <Cpu size={18} /> },
    { name: "Kitchen", type: "Coffee", icon: <Coffee size={18} /> },
    { name: "Bike Parking", type: "Bike", icon: <Bike size={18} /> },
    { name: "Wifi", type: "Wifi", icon: <Wifi size={18} /> },
    { name: "TV", type: "Tv", icon: <Tv size={18} /> },
    { name: "Hot water", type: "Thermometer", icon: <Thermometer size={18} /> },
    { name: "Dedicated workspace", type: "Monitor", icon: <Monitor size={18} /> },
    { name: "Dining table", type: "Table", icon: <Table size={18} /> },
    { name: "Private patio or balcony", type: "Home", icon: <Home size={18} /> },
    { name: "Pets allowed", type: "Heart", icon: <Heart size={18} /> }, // FIXED
];

const propertyTypes = ["Pg", "House", "Flat / Apartment", "Guest House", "Farm"];
const bhkOptions = ["1BHK", "2BHK", "3BHK", "4BHK"];

const AddPg = () => {
    const [form, setForm] = useState({
        title: "",
        location: "",
        latitude: "",
        longitude: "",
        price: "",
        description: "",
        propertyType: "",
        bhkType: "",
        images: [],
        amenities: [],
        details: {
            guests: 0,
            bedrooms: 0,
            beds: 0,
            bathrooms: 0,
        },
    });

    const [newImage, setNewImage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            details: { ...form.details, [name]: Number(value) },
        });
    };

    const handleAmenityToggle = (item) => {
        const exists = form.amenities.find((a) => a.type === item.type);
        const updated = exists
            ? form.amenities.filter((a) => a.type !== item.type)
            : [...form.amenities, { name: item.name, type: item.type }];
        setForm({ ...form, amenities: updated });
    };

    const handleAddImage = () => {
        if (newImage.trim()) {
            setForm({ ...form, images: [...form.images, newImage.trim()] });
            setNewImage("");
        }
    };

    const handleDeleteImage = (index) => {
        const updated = form.images.filter((_, i) => i !== index);
        setForm({ ...form, images: updated });
    };

    // =============================
    //      SUBMIT FORM
    // =============================
    const handleSubmit = async () => {
        if (!form.title || !form.location || !form.price || !form.propertyType) {
            alert("Please fill all required fields!");
            return;
        }

        if (
            (form.propertyType === "House" ||
                form.propertyType === "Flat / Apartment") &&
            !form.bhkType
        ) {
            alert("Please select BHK Type for House or Flat!");
            return;
        }

        try {
            const formData = new FormData();

            // Basic fields
            formData.append("title", form.title);
            formData.append("location", form.location);
            formData.append("latitude", form.latitude);
            formData.append("longitude", form.longitude);
            formData.append("price", form.price);
            formData.append("description", form.description);
            formData.append("propertyType", form.propertyType);
            formData.append("bhkType", form.bhkType);

            // Convert nested data to JSON
            formData.append("details", JSON.stringify(form.details));
            formData.append("amenities", JSON.stringify(form.amenities));

            // Split image URLs vs files
            const imageUrls = form.images.filter((img) => typeof img === "string");
            formData.append("existingImages", JSON.stringify(imageUrls));

            const imageFiles = form.images.filter((img) => typeof img !== "string");
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            await axios.post(API, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("Property added successfully!");
            navigate("/");
        } catch (err) {
            console.error("Add error:", err.response?.data || err.message);
            alert("Failed to add property. Check console for details.");
        }
    };

    return (
        <div className="addpg-container">
            <div className="addpg-card">
                <h2 className="form-title">🏠 Add New Property</h2>

                {/* Title */}
                <div className="form-group">
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Property Title"
                        required
                    />
                </div>

                {/* Location */}
                <div className="form-group">
                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Location"
                        required
                    />
                </div>

                {/* Coordinates */}
                <div className="form-group">
                    <input
                        type="number"
                        name="latitude"
                        value={form.latitude}
                        onChange={handleChange}
                        placeholder="Latitude"
                    />
                </div>

                <div className="form-group">
                    <input
                        type="number"
                        name="longitude"
                        value={form.longitude}
                        onChange={handleChange}
                        placeholder="Longitude"
                    />
                </div>

                {/* Price */}
                <div className="form-group">
                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price (per month)"
                        required
                    />
                </div>

                {/* Details */}
                <div className="details-section">
                    <h4>Property Details</h4>
                    <div className="details-grid">
                        {["guests", "bedrooms", "beds", "bathrooms"].map((key) => (
                            <div key={key} className="detail-item">
                                <label>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <input
                                    type="number"
                                    name={key}
                                    value={form.details[key]}
                                    onChange={handleDetailChange}
                                    min="0"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="form-group">
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                </div>

                {/* Property Type */}
                <div className="form-group">
                    <select
                        name="propertyType"
                        value={form.propertyType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Property Type</option>
                        {propertyTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* BHK Type */}
                {(form.propertyType === "House" ||
                    form.propertyType === "Flat / Apartment") && (
                        <div className="form-group">
                            <select
                                name="bhkType"
                                value={form.bhkType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select BHK Type</option>
                                {bhkOptions.map((bhk) => (
                                    <option key={bhk} value={bhk}>
                                        {bhk}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                {/* Images */}
                <div className="images-section">
                    <h4>Images:</h4>
                    <div className="image-preview-wrapper">
                        {form.images.map((img, index) => (
                            <div key={index} className="image-box">
                                <img
                                    src={
                                        typeof img === "string"
                                            ? img
                                            : URL.createObjectURL(img)
                                    }
                                    alt={`img-${ index } `}
                                    className="preview-img"
                                />
                                <button
                                    className="delete-img-btn"
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="add-image">
                        <input
                            type="text"
                            value={newImage}
                            placeholder="Add image URL"
                            onChange={(e) => setNewImage(e.target.value)}
                        />
                        <button onClick={handleAddImage}>Add</button>
                    </div>

                    <div className="upload-image">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    setForm({
                                        ...form,
                                        images: [...form.images, e.target.files[0]],
                                    });
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Amenities */}
                <div className="amenities-section">
                    <h4>Amenities</h4>
                    <div className="amenities-list">
                        {amenitiesList.map((item) => (
                            <label key={item.type} className="amenity-item">
                                <input
                                    type="checkbox"
                                    checked={form.amenities.some(
                                        (a) => a.type === item.type
                                    )}
                                    onChange={() => handleAmenityToggle(item)}
                                />
                                <span className="amenity-icon">{item.icon}</span>
                                {item.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="form-actions">
                    <button className="form-action-btn" onClick={handleSubmit}>
                        Save
                    </button>
                    <button
                        className="form-action-btn"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPg;

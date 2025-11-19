
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddPg.css";

const API = `${process.env.REACT_APP_API_BASE}/api/pgdetails`,

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
    { name: "Pets allowed", type: "Paw", icon: <Heart size={18} /> },
];

const propertyTypes = ["Pg", "House", "Flat / Apartment", "Guest House", "Farm"];

const EditPg = () => {
    const [form, setForm] = useState(null);
    const [newImage, setNewImage] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPG = async () => {
            try {
                const res = await axios.get(`${API}/${id}`);
                setForm(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchPG();
    }, [id]);

    if (!form) return <div className="loading-text">Loading...</div>;

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            details: { ...form.details, [name]: Number(value) || 0 },
        });
    };

    const handleAmenityToggle = (item) => {
        const exists = form.amenities.find((a) => a.type === item.type);
        const updated = exists
            ? form.amenities.filter((a) => a.type !== item.type)
            : [...form.amenities, { name: item.name, type: item.type }];
        setForm({ ...form, amenities: updated });
    };

    const handleDeleteImage = (index) => {
        const updated = form.images.filter((_, i) => i !== index);
        setForm({ ...form, images: updated });
    };

    const handleAddImage = () => {
        if (newImage.trim()) {
            setForm({ ...form, images: [...form.images, newImage.trim()] });
            setNewImage("");
        }
    };

    const handleFileUpload = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setForm({ ...form, images: [...form.images, url] });
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                title: form.title,
                location: form.location,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude),
                price: Number(form.price),
                description: form.description,
                propertyType: form.propertyType,
                pgType: form.pgType || null,
                bhkType: form.bhkType || null,

                // string URLs only
                images: form.images.map((img) =>
                    typeof img === "string" ? img : null
                ).filter(Boolean),

                // object array
                amenities: form.amenities,

                // deposit (if you are editing deposit)
                deposit: form.deposit || {},

                // property details
                details: {
                    guests: Number(form.details?.guests) || 0,
                    bedrooms: Number(form.details?.bedrooms) || 0,
                    beds: Number(form.details?.beds) || 0,
                    bathrooms: Number(form.details?.bathrooms) || 0,
                },
            };

            await axios.put(`${API}/${id}`, payload);

            alert("PG updated successfully!");
            navigate("/");
        } catch (err) {
            console.error("Update error:", err.response?.data || err.message);
            alert("Update failed! Check console.");
        }
    };


    return (
        <div className="addpg-container">
            <div className="addpg-card">
                <h2 className="form-title">✏️ Edit PG</h2>

                {/* Basic Details */}
                <div className="form-group">
                    <input name="title" value={form.title} onChange={handleChange} placeholder="PG Title" />
                </div>
                <div className="form-group">
                    <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
                </div>
                <div className="form-group">
                    <input type="number" name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" />
                </div>
                <div className="form-group">
                    <input type="number" name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" />
                </div>
                <div className="form-group">
                    <input name="price" value={form.price} onChange={handleChange} placeholder="Price (₹)" />
                </div>
                <div className="form-group">
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                </div>
                <div className="form-group">
                    <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                        <option value="">Select Property Type</option>
                        {propertyTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Property Details */}
                <div className="details-section">
                    <h4>Property Details</h4>
                    <div className="details-grid">
                        {["guests", "bedrooms", "beds", "bathrooms"].map((key) => (
                            <div key={key} className="detail-item">
                                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <input type="number" name={key} value={form.details?.[key] ?? 0} onChange={handleDetailChange} min="0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Images */}
                <div className="images-section">
                    <h4>Images:</h4>
                    <div className="image-preview-wrapper">
                        {form.images.map((img, index) => (
                            <div key={index} className="image-box">
                                <img src={typeof img === "string" ? img : URL.createObjectURL(img)} alt={`PG ${index}`} className="preview-img" />
                                <button onClick={() => handleDeleteImage(index)} className="delete-img-btn">X</button>
                            </div>
                        ))}
                    </div>
                    <div className="add-image">
                        <input type="text" placeholder="Add image URL" value={newImage} onChange={(e) => setNewImage(e.target.value)} />
                        <button onClick={handleAddImage}>Add Image</button>
                    </div>
                    <div className="upload-image">
                        <input type="file" accept="image/*" onChange={handleFileUpload} />
                    </div>
                </div>

                {/* Amenities */}
                <div className="amenities-section">
                    <h4>Select Amenities:</h4>
                    <div className="amenities-list">
                        {amenitiesList.map((item) => (
                            <label key={item.type} className="amenity-item">
                                <input type="checkbox" checked={form.amenities.some((a) => a.type === item.type)} onChange={() => handleAmenityToggle(item)} />
                                <span className="amenity-icon">{item.icon}</span>
                                {item.name}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="form-actions">
                    <button onClick={handleSave} className="form-action-btn">Save</button>
                    <button onClick={() => navigate("/")} className="form-action-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditPg;

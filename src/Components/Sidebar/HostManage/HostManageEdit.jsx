
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./HostManageEdit.css";

// const BACKEND_URL = `${process.env.REACT_APP_API_BASE}";
// const API = `${BACKEND_URL}/api/host`;

// const HostManageEdit = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         userId: "",
//         propertyType: "",
//         pgType: "",
//         bhkType: "",
//         roomType: "",
//         location: {
//             country: "",
//             state: "",
//             city: "",
//             street: "",
//             landmark: "",
//             locality: "",
//             pincode: "",
//         },
//         locationmap: {
//             latitude: "",
//             longitude: "",
//         },
//         details: { guests: 0, bedrooms: 0, beds: 0, bathrooms: 0 },
//         price: { weekday: 0, weekend: 0, weekendPremium: 0 },
//         hostDetails: { name: "", contact: "" },
//         title: "",
//         description: "",
//         images: [],
//     });

//     const [newImage, setNewImage] = useState("");
//     const token = sessionStorage.getItem("adminToken");

//     // ✅ Memoize axios config so it doesn’t change each render
//     const axiosConfig = { headers: { Authorization: token ? `Bearer ${token}` : "" } };

//     // ✅ Fetch host data (warning fixed)
//     useEffect(() => {
//         const fetchHost = async () => {
//             try {
//                 const res = await axios.get(`${API}/${id}`, axiosConfig);
//                 if (res.data.host) {
//                     const host = res.data.host;
//                     setFormData((prev) => ({
//                         ...prev,
//                         ...host,
//                         locationmap: host.locationmap || { latitude: "", longitude: "" },
//                     }));
//                 }
//             } catch (err) {
//                 console.error("Error fetching host:", err);
//                 alert(err.response?.data?.message || "Failed to fetch host details");
//             }
//         };

//         fetchHost();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [id]); // ✅ we ignore axiosConfig since it's constant

//     // ✅ Input handlers
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleNestedChange = (section, field, value) => {
//         setFormData((prev) => ({
//             ...prev,
//             [section]: { ...prev[section], [field]: value },
//         }));
//     };

//     const handleAddImage = () => {
//         if (newImage.trim()) {
//             setFormData((prev) => ({
//                 ...prev,
//                 images: [...prev.images, newImage.trim()],
//             }));
//             setNewImage("");
//         }
//     };

//     const handleDeleteImage = (index) => {
//         const updated = formData.images.filter((_, i) => i !== index);
//         setFormData((prev) => ({ ...prev, images: updated }));
//     };

//     // ✅ Submit handler
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.put(`${API}/${id}`, formData, axiosConfig);
//             if (res.data.success) {
//                 alert("Host updated successfully!");
//                 navigate("/admin/host-manage");
//             }
//         } catch (err) {
//             console.error("Update error:", err);
//             alert(err.response?.data?.message || "Failed to update host");
//         }
//     };

//     return (
//         <div className="host-edit-container">
//             <div className="host-edit-card">
//                 <h2>Edit Host Listing</h2>
//                 <form onSubmit={handleSubmit} className="host-edit-form">
//                     {/* User ID */}
//                     <div className="form-group">
//                         <label>User ID</label>
//                         <input
//                             name="userId"
//                             value={formData.userId}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>

//                     {/* Property Type */}
//                     <div className="form-group">
//                         <label>Property Type</label>
//                         <select
//                             name="propertyType"
//                             value={formData.propertyType}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="">Select Property Type</option>
//                             <option value="Pg">Pg</option>
//                             <option value="House">House</option>
//                             <option value="Flat/Apartment">Flat / Apartment</option>
//                             <option value="Guest House">Guest House</option>
//                             <option value="Farm">Farm</option>
//                         </select>
//                     </div>

//                     {/* Basic Fields */}
//                     <div className="form-group">
//                         <label>PG Type</label>
//                         <input
//                             name="pgType"
//                             value={formData.pgType}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label>BHK Type</label>
//                         <input
//                             name="bhkType"
//                             value={formData.bhkType}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label>Room Type</label>
//                         <input
//                             name="roomType"
//                             value={formData.roomType}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     {/* Location section */}
//                     <div className="nested-section">
//                         <h4>Location</h4>
//                         <div className="nested-grid">
//                             {Object.keys(formData.location).map((key) => (
//                                 <div className="form-group" key={key}>
//                                     <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//                                     <input
//                                         value={formData.location[key]}
//                                         onChange={(e) =>
//                                             handleNestedChange("location", key, e.target.value)
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* ✅ Latitude & Longitude */}
//                     <div className="nested-section">
//                         <h4>Location Map (Coordinates)</h4>
//                         <div className="nested-grid">
//                             <div className="form-group">
//                                 <label>Latitude</label>
//                                 <input
//                                     type="number"
//                                     step="any"
//                                     value={formData.locationmap.latitude}
//                                     onChange={(e) =>
//                                         handleNestedChange(
//                                             "locationmap",
//                                             "latitude",
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Enter latitude"
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>Longitude</label>
//                                 <input
//                                     type="number"
//                                     step="any"
//                                     value={formData.locationmap.longitude}
//                                     onChange={(e) =>
//                                         handleNestedChange(
//                                             "locationmap",
//                                             "longitude",
//                                             e.target.value
//                                         )
//                                     }
//                                     placeholder="Enter longitude"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Details */}
//                     <div className="nested-section">
//                         <h4>Details</h4>
//                         <div className="nested-grid">
//                             {Object.keys(formData.details).map((key) => (
//                                 <div className="form-group" key={key}>
//                                     <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//                                     <input
//                                         type="number"
//                                         value={formData.details[key]}
//                                         onChange={(e) =>
//                                             handleNestedChange("details", key, e.target.value)
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Price */}
//                     <div className="nested-section">
//                         <h4>Price</h4>
//                         <div className="nested-grid">
//                             {Object.keys(formData.price).map((key) => (
//                                 <div className="form-group" key={key}>
//                                     <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//                                     <input
//                                         type="number"
//                                         value={formData.price[key]}
//                                         onChange={(e) =>
//                                             handleNestedChange("price", key, e.target.value)
//                                         }
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Host Details */}
//                     <div className="nested-section">
//                         <h4>Host Details</h4>
//                         <div className="nested-grid">
//                             <div className="form-group">
//                                 <label>Name</label>
//                                 <input
//                                     value={formData.hostDetails.name}
//                                     onChange={(e) =>
//                                         handleNestedChange("hostDetails", "name", e.target.value)
//                                     }
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label>Contact</label>
//                                 <input
//                                     value={formData.hostDetails.contact}
//                                     onChange={(e) =>
//                                         handleNestedChange("hostDetails", "contact", e.target.value)
//                                     }
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Title & Description */}
//                     <div className="form-group">
//                         <label>Title</label>
//                         <input
//                             name="title"
//                             value={formData.title}
//                             onChange={handleChange}
//                         />
//                     </div>
//                     <div className="form-group">
//                         <label>Description</label>
//                         <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleChange}
//                             rows={3}
//                         />
//                     </div>

//                     {/* Images */}
//                     <div className="images-section">
//                         <h4>Images</h4>
//                         <div className="image-preview-wrapper">
//                             {formData.images.map((img, index) => (
//                                 <div key={index} className="image-box">
//                                     <img
//                                         src={
//                                             img.startsWith("http") ? img : `${BACKEND_URL}/${img}`
//                                         }
//                                         alt={`Host ${index}`}
//                                         className="preview-img"
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={() => handleDeleteImage(index)}
//                                         className="delete-img-btn"
//                                     >
//                                         X
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="add-image">
//                             <input
//                                 type="text"
//                                 placeholder="Add new image URL"
//                                 value={newImage}
//                                 onChange={(e) => setNewImage(e.target.value)}
//                             />
//                             <button type="button" onClick={handleAddImage}>
//                                 Add Image
//                             </button>
//                         </div>
//                     </div>

//                     {/* Buttons */}
//                     <div className="form-actions">
//                         <button type="submit" className="save-btn">
//                             Save Changes
//                         </button>
//                         <button
//                             type="button"
//                             className="save-btn"
//                             onClick={() => navigate("/admin/host-manage")}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default HostManageEdit;



// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import "./HostManageEdit.css";

// const BACKEND_URL = `${process.env.REACT_APP_API_BASE}";
// const API = `${BACKEND_URL}/api/host`;

// const HostManageEdit = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const token = sessionStorage.getItem("adminToken");

//     const [formData, setFormData] = useState({
//         userId: "",
//         propertyType: "",
//         pgType: "",
//         bhkType: "",
//         roomType: "",
//         location: {
//             country: "",
//             state: "",
//             city: "",
//             street: "",
//             landmark: "",
//             locality: "",
//             pincode: "",
//         },
//         locationmap: {
//             latitude: "",
//             longitude: "",
//         },
//         details: { guests: 0, bedrooms: 0, beds: 0, bathrooms: 0 },
//         price: { weekday: 0, weekend: 0, weekendPremium: 0 },
//         hostDetails: { name: "", contact: "" },
//         title: "",
//         description: "",
//         images: [],
//     });

//     const [newImage, setNewImage] = useState("");

//     // ✅ Fetch host data
//     useEffect(() => {
//         const fetchHost = async () => {
//             const axiosConfig = {
//                 headers: { Authorization: token ? `Bearer ${token}` : "" },
//             };

//             try {
//                 const res = await axios.get(`${API}/${id}`, axiosConfig);
//                 if (res.data.host) {
//                     const host = res.data.host;
//                     setFormData((prev) => ({
//                         ...prev,
//                         ...host,
//                         locationmap: host.locationmap || { latitude: "", longitude: "" },
//                     }));
//                 }
//             } catch (err) {
//                 console.error("Error fetching host:", err);
//                 alert(err.response?.data?.message || "Failed to fetch host details");
//             }
//         };

//         fetchHost();
//         // ✅ no dependency warning now
//     }, [id, token]);

//     // ✅ Input handlers
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleNestedChange = (section, field, value) => {
//         setFormData((prev) => ({
//             ...prev,
//             [section]: { ...prev[section], [field]: value },
//         }));
//     };

//     const handleAddImage = () => {
//         if (newImage.trim()) {
//             setFormData((prev) => ({
//                 ...prev,
//                 images: [...prev.images, newImage.trim()],
//             }));
//             setNewImage("");
//         }
//     };

//     const handleDeleteImage = (index) => {
//         const updated = formData.images.filter((_, i) => i !== index);
//         setFormData((prev) => ({ ...prev, images: updated }));
//     };

//     // ✅ Submit handler
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const data = new FormData();

//             // Basic fields
//             ["userId", "propertyType", "pgType", "bhkType", "roomType", "title", "description"].forEach(
//                 (key) => data.append(key, formData[key])
//             );


//             // Complex fields (JSON)
//             ["location", "locationmap", "details", "price", "hostDetails"].forEach((key) =>
//                 data.append(key, JSON.stringify(formData[key]))
//             );


//             // Images
//             formData.images.forEach((img) => data.append("images", img));

//             const res = await axios.put(`${API}/${id}`, data, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (res.data.success) {
//                 alert("✅ Host updated successfully!");
//                 navigate("/admin/host-manage");
//             }
//         } catch (err) {
//             console.error("⚠️ Update error:", err);
//             alert(err.response?.data?.message || "Failed to update host");
//         }
//     };

//     return (
//         <div className="host-edit-container">
//             <div className="host-edit-card">
//                 <h2>Edit Host Listing</h2>
//                 <form onSubmit={handleSubmit} className="host-edit-form">
//                     {/* User ID */}
//                     <div className="form-group">
//                         <label>User ID</label>
//                         <input name="userId" value={formData.userId} onChange={handleChange} required />
//                     </div>

//                     {/* Property Type */}
//                     <div className="form-group">
//                         <label>Property Type</label>
//                         <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
//                             <option value="">Select Property Type</option>
//                             <option value="Pg">Pg</option>
//                             <option value="House">House</option>
//                             <option value="Flat/Apartment">Flat / Apartment</option>
//                             <option value="Guest House">Guest House</option>
//                             <option value="Farm">Farm</option>
//                         </select>
//                     </div>

//                     {/* Basic Fields */}
//                     {["pgType", "bhkType", "roomType"].map((key) => (
//                         <div className="form-group" key={key}>
//                             <label>{key}</label>
//                             <input name={key} value={formData[key]} onChange={handleChange} />
//                         </div>
//                     ))}

//                     {/* Location */}
//                     <div className="nested-section">
//                         <h4>Location</h4>
//                         <div className="nested-grid">
//                             {Object.keys(formData.location).map((key) => (
//                                 <div className="form-group" key={key}>
//                                     <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//                                     <input
//                                         value={formData.location[key]}
//                                         onChange={(e) => handleNestedChange("location", key, e.target.value)}
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Location Map */}
//                     <div className="nested-section">
//                         <h4>Coordinates</h4>
//                         {["latitude", "longitude"].map((key) => (
//                             <div className="form-group" key={key}>
//                                 <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//                                 <input
//                                     type="number"
//                                     step="any"
//                                     value={formData.locationmap[key]}
//                                     onChange={(e) => handleNestedChange("locationmap", key, e.target.value)}
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {/* Details, Price, Host Details */}
//                     {["details", "price", "hostDetails"].map((section) => (
//                         <div className="nested-section" key={section}>
//                             <h4>{section.charAt(0).toUpperCase() + section.slice(1)}</h4>
//                             <div className="nested-grid">
//                                 {Object.keys(formData[section]).map((key) => (
//                                     <div className="form-group" key={key}>
//                                         <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//                                         <input
//                                             type={section === "hostDetails" ? "text" : "number"}
//                                             value={formData[section][key]}
//                                             onChange={(e) => handleNestedChange(section, key, e.target.value)}
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}

//                     {/* Title & Description */}
//                     <div className="form-group">
//                         <label>Title</label>
//                         <input name="title" value={formData.title} onChange={handleChange} />
//                     </div>
//                     <div className="form-group">
//                         <label>Description</label>
//                         <textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
//                     </div>

//                     {/* Images */}
//                     <div className="images-section">
//                         <h4>Images</h4>
//                         <div className="image-preview-wrapper">
//                             {formData.images.map((img, index) => (
//                                 <div key={index} className="image-box">
//                                     <img
//                                         src={img.startsWith("http") ? img : `${BACKEND_URL}/${img}`}
//                                         alt={`Host ${index}`}
//                                         className="preview-img"
//                                     />
//                                     <button type="button" className="delete-img-btn" onClick={() => handleDeleteImage(index)}>
//                                         X
//                                     </button>
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="add-image">
//                             <input
//                                 type="text"
//                                 placeholder="Add new image URL"
//                                 value={newImage}
//                                 onChange={(e) => setNewImage(e.target.value)}
//                             />
//                             <button type="button" onClick={handleAddImage}>
//                                 Add Image
//                             </button>
//                         </div>
//                     </div>

//                     {/* Buttons */}
//                     <div className="form-actions">
//                         <button type="submit" className="save-btn">Save Changes</button>
//                         <button type="button" className="save-btn" onClick={() => navigate("/admin/host-manage")}>Cancel</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default HostManageEdit;


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

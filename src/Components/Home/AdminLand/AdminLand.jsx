// import axios from "axios";
// import { useEffect, useState } from "react";
// import { FaHome, FaHotel, FaUsers, FaUserShield } from "react-icons/fa";
// import "./AdminLand.css";

// export default function AdminDashboard() {
//     const [stats, setStats] = useState({
//         users: 0,
//         hosts: 0,
//         pgs: 0,
//         admins: 0,
//     });

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchStats = async () => {
//             // ✅ Get the token from sessionStorage instead of localStorage
//             const token = sessionStorage.getItem("adminToken");
//             if (!token) {
//                 setError("You are not logged in as admin");
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/admin/stats`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`, // Send JWT in header
//                     },
//                 });

//                 if (res.status === 200) {
//                     setStats(res.data);
//                 } else {
//                     setError("Failed to fetch stats");
//                 }
//             } catch (err) {
//                 console.error("Error fetching admin stats:", err.response?.data || err.message);
//                 if (err.response?.status === 401 || err.response?.status === 403) {
//                     setError("Unauthorized. Please login again.");
//                 } else {
//                     setError("Failed to fetch stats");
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchStats();
//     }, []);

//     if (loading) return <div className="admin-loading">Loading dashboard...</div>;
//     if (error)
//         return (
//             <div className="admin-loading">
//                 <p>{error}</p>
//             </div>
//         );

//     return (
//         <div className="admin-dashboard">
//             <h1 className="admin-heading">Admin Dashboard</h1>
//             <p className="admin-subheading">
//                 Overview of platform statistics — users, hosts, PGs, and admins.
//             </p>

//             <div className="stats-grid">
//                 <div className="stat-card">
//                     <FaUsers className="stat-icon users" />
//                     <h3>{stats.users}</h3>
//                     <p>Total Users</p>
//                 </div>

//                 <div className="stat-card">
//                     <FaUserShield className="stat-icon hosts" />
//                     <h3>{stats.hosts}</h3>
//                     <p>Total Hosts</p>
//                 </div>

//                 <div className="stat-card">
//                     <FaHotel className="stat-icon pgs" />
//                     <h3>{stats.pgs}</h3>
//                     <p>Total PGs</p>
//                 </div>

//                 <div className="stat-card">
//                     <FaHome className="stat-icon admins" />
//                     <h3>{stats.admins}</h3>
//                     <p>Total Admins</p>
//                 </div>

//                 <div className="stat-card">
//                     <FaUsers className="stat-icon bookings" />
//                     {/* <h3>{stats.bookings}</h3> */}
//                     <p>Total Bookings pending</p>
//                 </div>
//             </div>
//         </div>
//     );
// }

import axios from "axios";
import { useEffect, useState } from "react";
import { FaHome, FaHotel, FaUsers, FaUserShield, FaClipboardList } from "react-icons/fa";
import "./AdminLand.css";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        hosts: 0,
        pgs: 0,
        admins: 0,
        bookings: 0, // added bookings
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            const token = sessionStorage.getItem("adminToken");
            if (!token) {
                setError("You are not logged in as admin");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${process.env.REACT_APP_API_BASE}/api/admin/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 200) {
                    setStats(res.data); // Make sure res.data has users, hosts, pgs, admins, bookings
                } else {
                    setError("Failed to fetch stats");
                }
            } catch (err) {
                console.error("Error fetching admin stats:", err.response?.data || err.message);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setError("Unauthorized. Please login again.");
                } else {
                    setError("Failed to fetch stats");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="admin-loading">Loading dashboard...</div>;
    if (error)
        return (
            <div className="admin-loading">
                <p>{error}</p>
            </div>
        );

    return (
        <div className="admin-dashboard">
            <h1 className="admin-heading">Admin Dashboard</h1>
            <p className="admin-subheading">
                Overview of platform statistics — users, hosts, PGs, and admins.
            </p>

            <div className="stats-grid">
                <div className="stat-card">
                    <FaUsers className="stat-icon users" />
                    <h3>{stats.users}</h3>
                    <p>Total Users</p>
                </div>

                <div className="stat-card">
                    <FaUserShield className="stat-icon hosts" />
                    <h3>{stats.hosts}</h3>
                    <p>Total Hosts</p>
                </div>

                <div className="stat-card">
                    <FaHotel className="stat-icon pgs" />
                    <h3>{stats.pgs}</h3>
                    <p>Total PGs</p>
                </div>

                <div className="stat-card">
                    <FaHome className="stat-icon admins" />
                    <h3>{stats.admins}</h3>
                    <p>Total Admins</p>
                </div>

                <div className="stat-card">
                    <FaClipboardList className="stat-icon bookings" />
                    <h3>{stats.bookings}</h3>
                    <p>Total Bookings Pending</p>
                </div>
            </div>
        </div>
    );
}

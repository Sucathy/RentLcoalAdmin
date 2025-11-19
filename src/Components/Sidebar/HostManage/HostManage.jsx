// import axios from "axios";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import "./HostManage.css";

// const BACKEND_URL = `${process.env.REACT_APP_API_BASE}";
// const API = `${BACKEND_URL}/api/host`;

// const HostManage = () => {
//   const [hosts, setHosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage] = useState(20);
//   const [filter, setFilter] = useState("all"); // filter state
//   const navigate = useNavigate();

//   const token = sessionStorage.getItem("adminToken");
//   const axiosConfig = useMemo(
//     () => ({ headers: { Authorization: token ? `Bearer ${token}` : "" } }),
//     [token]
//   );

//   // Normalize image URLs
//   const getImageUrl = (img) => {
//     if (!img) return `${BACKEND_URL}/uploads/default.jpg`;
//     return img.startsWith("http") ? img : `${BACKEND_URL}${img.startsWith("/") ? "" : "/"}${img}`;
//   };

//   /** Fetch hosts */
//   const fetchHosts = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(API, axiosConfig);
//       setHosts(res.data.hosts || []);
//     } catch (err) {
//       console.error("Error fetching hosts:", err);
//       alert(err.response?.data?.message || "Failed to fetch hosts");
//     } finally {
//       setLoading(false);
//     }
//   }, [axiosConfig]);

//   useEffect(() => {
//     fetchHosts();
//   }, [fetchHosts]);

//   /** Delete host */
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this host?")) return;
//     try {
//       await axios.delete(`${API}/${id}`, axiosConfig);
//       setHosts((prev) => prev.filter((h) => h._id !== id));
//       alert("Host deleted successfully");
//     } catch (err) {
//       console.error("Error deleting host:", err);
//       alert(err.response?.data?.message || "Failed to delete host");
//     }
//   };

//   /** Update host status */
//   const handleStatusChange = async (hostId, newStatus) => {
//     try {
//       const res = await axios.put(`${API}/${hostId}/status`, { status: newStatus }, axiosConfig);
//       if (!res.data.success) return;
//       const updatedHost = res.data.host;

//       if (newStatus === "listed") {
//         await axios.post(`${BACKEND_URL}/api/pgdetails/host-sync`, { hostId });
//         alert("PG created / synced successfully!");
//       }

//       if (newStatus === "pending") {
//         const deleteRes = await axios.delete(`${BACKEND_URL}/api/pgdetails/host/${hostId}`);
//         alert(deleteRes.data.message);
//       }

//       setHosts((prev) => prev.map((h) => (h._id === hostId ? updatedHost : h)));
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   /** Pagination */
//   const handleNext = () => { if ((page + 1) * rowsPerPage < filteredData.length) setPage(page + 1); };
//   const handlePrev = () => { if (page > 0) setPage(page - 1); };

//   /** Filter hosts */
//   const filteredHosts = hosts.filter(h => filter !== "all" && filter !== "users" ? h.status === filter : true);

//   /** Users table: compute unique users and host counts */
//   const usersData = useMemo(() => {
//     const map = {};
//     hosts.forEach(h => {
//       if (!map[h.userId]) map[h.userId] = 0;
//       map[h.userId]++;
//     });
//     return Object.entries(map).map(([userId, hostCount]) => ({ userId, hostCount }));
//   }, [hosts]);

//   /** Data to display in table based on filter */
//   const filteredData = filter === "users" ? usersData : filteredHosts;
//   const paginatedData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

//   /** Counts for dashboard cards */
//   const counts = {
//     all: hosts.length,
//     pending: hosts.filter((h) => h.status === "pending").length,
//     listed: hosts.filter((h) => h.status === "listed").length,
//     wrong: hosts.filter((h) => h.status === "wrong").length,
//     users: usersData.length,
//   };

//   return (
//     <div className="host-manage">
//       <h1>Host Management</h1>

//       {/* Dashboard Cards */}
//       <div className="dashboard-cards">
//         <div className={`dashboard-card ${filter === "users" ? "active" : ""}`} onClick={() => { setFilter("users"); setPage(0); }}>
//           <h3>Users</h3>
//           <p>{counts.users}</p>
//         </div>
//         <div className={`dashboard-card ${filter === "all" ? "active" : ""}`} onClick={() => { setFilter("all"); setPage(0); }}>
//           <h3>All</h3>
//           <p>{counts.all}</p>
//         </div>
//         <div className={`dashboard-card ${filter === "pending" ? "active" : ""}`} onClick={() => { setFilter("pending"); setPage(0); }}>
//           <h3>Pending</h3>
//           <p>{counts.pending}</p>
//         </div>
//         <div className={`dashboard-card ${filter === "listed" ? "active" : ""}`} onClick={() => { setFilter("listed"); setPage(0); }}>
//           <h3>Listed</h3>
//           <p>{counts.listed}</p>
//         </div>
//         <div className={`dashboard-card ${filter === "wrong" ? "active" : ""}`} onClick={() => { setFilter("wrong"); setPage(0); }}>
//           <h3>Wrong</h3>
//           <p>{counts.wrong}</p>
//         </div>

//       </div>

//       {/* Table */}
//       {loading ? <p>Loading...</p> : (
//         <>
//           <table className="host-table">
//             <thead>
//               {filter === "users" ? (
//                 <tr>
//                   <th>No</th>
//                   <th>User ID</th>
//                   <th>Host Count</th>
//                 </tr>
//               ) : (
//                 <tr>
//                   <th>No</th>
//                   <th>User ID</th>
//                   <th>Property Type</th>
//                   <th>Host Info</th>
//                   <th>Image</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               )}
//             </thead>
//             <tbody>
//               {paginatedData.length ? paginatedData.map((item, idx) => (
//                 filter === "users" ? (
//                   <tr key={item.userId} className="user-row">
//                     <td>{page * rowsPerPage + idx + 1}</td>
//                     <td>{item.userId}</td>
//                     <td>{item.hostCount}</td>
//                   </tr>
//                 ) : (
//                   <tr key={item._id} className={`host-row ${item.status}`}>
//                     <td>{page * rowsPerPage + idx + 1}</td>
//                     <td>{item.userId}</td>
//                     <td>{item.propertyType}</td>
//                     <td>{item.hostDetails?.name} ({item.hostDetails?.contact})</td>
//                     <td><img src={getImageUrl(item.images?.[0])} alt="Host" className="host-img" /></td>
//                     <td>
//                       <div className="status-buttons">
//                         <button className={`status-btn ${item.status === "pending" ? "active pending" : ""}`} onClick={() => handleStatusChange(item._id, "pending")}>Pending</button>
//                         <button className={`status-btn ${item.status === "listed" ? "active listed" : ""}`} onClick={() => handleStatusChange(item._id, "listed")}>Listed</button>
//                         <button className={`status-btn ${item.status === "wrong" ? "active wrong" : ""}`} onClick={() => handleStatusChange(item._id, "wrong")}>Wrong</button>
//                       </div>
//                     </td>
//                     <td>
//                       <FaEdit className="icon-btn edit" onClick={() => navigate(`/admin/host-manage/edit/${item._id}`)} />
//                       <FaTrash className="icon-btn delete" onClick={() => handleDelete(item._id)} />
//                     </td>
//                   </tr>
//                 )
//               )) : (
//                 <tr><td colSpan={filter === "users" ? 3 : 7}>No data found</td></tr>
//               )}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           {paginatedData.length > 0 && (
//             <div className="pagination">
//               <button onClick={handlePrev} disabled={page === 0} className="page-btn">◀ Prev</button>
//               <span>Page {page + 1} of {Math.ceil(filteredData.length / rowsPerPage)}</span>
//               <button onClick={handleNext} disabled={(page + 1) * rowsPerPage >= filteredData.length} className="page-btn">Next ▶</button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default HostManage;


import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./HostManage.css";

const BACKEND_URL = (`${process.env.REACT_APP_API_BASE}`)
const API = `${ BACKEND_URL }/api/host`;

const HostManage = () => {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(20);
  const [filter, setFilter] = useState("all"); // filter state
  const [searchTerm, setSearchTerm] = useState(""); // search term
  const navigate = useNavigate();

  const token = sessionStorage.getItem("adminToken");
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: token ? `Bearer ${ token } ` : "" } }),
    [token]
  );

  const getImageUrl = (img) => {
    if (!img) return `${ BACKEND_URL } /uploads/default.jpg`;
    return img.startsWith("http") ? img : `${ BACKEND_URL }${ img.startsWith("/") ? "" : "/" }${ img } `;
  };

  /** Fetch hosts */
  const fetchHosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, axiosConfig);
      setHosts(res.data.hosts || []);
    } catch (err) {
      console.error("Error fetching hosts:", err);
      alert(err.response?.data?.message || "Failed to fetch hosts");
    } finally {
      setLoading(false);
    }
  }, [axiosConfig]);

  useEffect(() => { fetchHosts(); }, [fetchHosts]);

  /** Delete host */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this host?")) return;
    try {
      await axios.delete(`${ API }/${id}`, axiosConfig);
setHosts((prev) => prev.filter((h) => h._id !== id));
alert("Host deleted successfully");
    } catch (err) {
  console.error("Error deleting host:", err);
  alert(err.response?.data?.message || "Failed to delete host");
}
  };

/** Update host status */
const handleStatusChange = async (hostId, newStatus) => {
  try {
    const res = await axios.put(`${API}/${hostId}/status`, { status: newStatus }, axiosConfig);
    if (!res.data.success) return;
    const updatedHost = res.data.host;

    if (newStatus === "listed") {
      await axios.post(`${BACKEND_URL}/api/pgdetails/host-sync`, { hostId });
      alert("PG created / synced successfully!");
    }

    if (newStatus === "pending") {
      const deleteRes = await axios.delete(`${BACKEND_URL}/api/pgdetails/host/${hostId}`);
      alert(deleteRes.data.message);
    }

    setHosts((prev) => prev.map((h) => (h._id === hostId ? updatedHost : h)));
  } catch (err) {
    console.error("Error updating status:", err);
    alert(err.response?.data?.message || "Failed to update status");
  }
};

/** Pagination */
const handleNext = () => { if ((page + 1) * rowsPerPage < filteredData.length) setPage(page + 1); };
const handlePrev = () => { if (page > 0) setPage(page - 1); };

/** Filter hosts */
const filteredHosts = hosts.filter(h => filter !== "all" && filter !== "users" ? h.status === filter : true);

/** Users table: compute unique users and host counts */
const usersData = useMemo(() => {
  const map = {};
  hosts.forEach(h => {
    if (!map[h.userId]) map[h.userId] = 0;
    map[h.userId]++;
  });
  return Object.entries(map).map(([userId, hostCount]) => ({ userId, hostCount }));
}, [hosts]);

/** Data to display in table based on filter */
const filteredData = filter === "users" ? usersData : filteredHosts;

/** Search filtering */
const searchedData = filteredData.filter(item => {
  if (filter === "users") {
    return item.userId.toLowerCase().includes(searchTerm.toLowerCase());
  } else {
    return (
      item.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hostDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
});

const paginatedData = searchedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

/** Counts for dashboard cards */
const counts = {
  all: hosts.length,
  pending: hosts.filter((h) => h.status === "pending").length,
  listed: hosts.filter((h) => h.status === "listed").length,
  wrong: hosts.filter((h) => h.status === "wrong").length,
  users: usersData.length,
};

return (
  <div className="host-manage">
    <h1>Host Management</h1>

    {/* Dashboard Cards */}
    <div className="dashboard-cards">
      <div className={`dashboard-card ${filter === "users" ? "active" : ""}`} onClick={() => { setFilter("users"); setPage(0); }}>
        <h3>Users</h3><p>{counts.users}</p>
      </div>
      <div className={`dashboard-card ${filter === "all" ? "active" : ""}`} onClick={() => { setFilter("all"); setPage(0); }}>
        <h3>All</h3><p>{counts.all}</p>
      </div>
      <div className={`dashboard-card ${filter === "pending" ? "active" : ""}`} onClick={() => { setFilter("pending"); setPage(0); }}>
        <h3>Pending</h3><p>{counts.pending}</p>
      </div>
      <div className={`dashboard-card ${filter === "listed" ? "active" : ""}`} onClick={() => { setFilter("listed"); setPage(0); }}>
        <h3>Listed</h3><p>{counts.listed}</p>
      </div>
      <div className={`dashboard-card ${filter === "wrong" ? "active" : ""}`} onClick={() => { setFilter("wrong"); setPage(0); }}>
        <h3>Wrong</h3><p>{counts.wrong}</p>
      </div>

    </div>

    {/* Search Input */}
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by User ID or Host Name..."
        value={searchTerm}
        onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
        className="search-input"
      />
    </div>

    {/* Table */}
    {loading ? <p>Loading...</p> : (
      <>
        <table className="host-table">
          <thead>
            {filter === "users" ? (
              <tr><th>No</th><th>User ID</th><th>Host Count</th></tr>
            ) : (
              <tr>
                <th>No</th>
                <th>User ID</th>
                <th>Property Type</th>
                <th>Host Info</th>
                <th>Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {paginatedData.length ? paginatedData.map((item, idx) => (
              filter === "users" ? (
                <tr key={item.userId} className="user-row">
                  <td>{page * rowsPerPage + idx + 1}</td>
                  <td>{item.userId}</td>
                  <td>{item.hostCount}</td>
                </tr>
              ) : (
                <tr key={item._id} className={`host-row ${item.status}`}>
                  <td>{page * rowsPerPage + idx + 1}</td>
                  <td>{item.userId}</td>
                  <td>{item.propertyType}</td>
                  <td>{item.hostDetails?.name} ({item.hostDetails?.contact})</td>
                  <td><img src={getImageUrl(item.images?.[0])} alt="Host" className="host-img" /></td>
                  <td>
                    <div className="status-buttons">
                      <button className={`status-btn ${item.status === "pending" ? "active pending" : ""}`} onClick={() => handleStatusChange(item._id, "pending")}>Pending</button>
                      <button className={`status-btn ${item.status === "listed" ? "active listed" : ""}`} onClick={() => handleStatusChange(item._id, "listed")}>Listed</button>
                      <button className={`status-btn ${item.status === "wrong" ? "active wrong" : ""}`} onClick={() => handleStatusChange(item._id, "wrong")}>Wrong</button>
                    </div>
                  </td>
                  <td>
                    <FaEdit className="icon-btn edit" onClick={() => navigate(`/admin/host-manage/edit/${item._id}`)} />
                    <FaTrash className="icon-btn delete" onClick={() => handleDelete(item._id)} />
                  </td>
                </tr>
              )
            )) : (
              <tr><td colSpan={filter === "users" ? 3 : 7}>No data found</td></tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {paginatedData.length > 0 && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 0} className="page-btn">◀ Prev</button>
            <span>Page {page + 1} of {Math.ceil(searchedData.length / rowsPerPage)}</span>
            <button onClick={handleNext} disabled={(page + 1) * rowsPerPage >= searchedData.length} className="page-btn">Next ▶</button>
          </div>
        )}
      </>
    )}
  </div>
);
};

export default HostManage;

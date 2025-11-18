// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import AdminLand from "../../Home/AdminLand/AdminLand";
// import AdminDetails from "../AdminDetails/AdminDetails";
// import HeroSection from "../HeroSection/HeroSection";
// import HostManage from "../HostManage/HostManage";
// // import Payment from "../Payment/Payment";
// import icon1 from "../../../Assets/image.png";
// import PgDetails from "../PgDetails/PgDetails";
// import UserDetails from "../UserDetails/UserDetails";
// import "./Sidebar.css";

// const sidebarItems = [
//   { icon: icon1, label: "AdminLand" },
//   { icon: "📧", label: "HeroSection" },
//   { icon: "📥", label: "UserDetails" },
//   { icon: "📝", label: "AdminDetails" },
//   { icon: "⭐", label: "PgDetails" },
//   { icon: "📝", label: "HostManage" },
//   // { icon: "📬", label: "Payment" },
// ];

// const Sidebar = () => {
//   const [open, setOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("AdminLand");
//   const [isAdmin, setIsAdmin] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = sessionStorage.getItem("adminToken");
//     if (token) {
//       setIsAdmin(true);
//     } else {
//       // Redirect to admin login if token not found
//       navigate("/adminlogin");
//     }
//   }, [navigate]);

//   const renderPage = () => {
//     switch (activeTab) {
//       case "AdminLand":
//         return <AdminLand />;
//       case "PgDetails":
//         return <PgDetails />;
//       case "HeroSection":
//         return <HeroSection />;
//       case "UserDetails":
//         return <UserDetails />;
//       case "AdminDetails":
//         return <AdminDetails />;
//       case "HostManage":
//         return <HostManage />;
//       // case "Payment":
//       //   return <Payment />;
//       default:
//         return <UserDetails />;
//     }
//   };

//   if (!isAdmin) {
//     // Optional fallback: show nothing while redirecting
//     return null;
//   }

//   return (
//     <div className="drawer-layout">
//       {/* AppBar */}
//       <header className={`appbar ${open ? "appbar-open" : ""}`}>
//         <div className="left-section">
//           <button className="menu-btn" onClick={() => setOpen(!open)}>
//             {open ? "Localpg" : "Localpg"}
//           </button>
//         </div>

//         <div className="right-section">
//           <button
//             className="profile-btn"
//             onClick={() => navigate("/adminprofile")}
//           >
//             👤
//           </button>
//         </div>
//       </header>

//       {/* Sidebar */}
//       <aside className={`sidebar ${open ? "sidebar-open" : "sidebar-closed"}`}>
//         <ul>
//           {sidebarItems.map((item, idx) => (
//             <li
//               key={idx}
//               className={`sidebar-item ${activeTab === item.label ? "active" : ""}`}
//               onClick={() => setActiveTab(item.label)}
//             >
//               <span className="icon">{item.icon}</span>
//               {open && <span className="label">{item.label}</span>}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Content */}
//       <main className="main-content">{renderPage()}</main>
//     </div>
//   );
// };

// export default Sidebar;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaHome, FaUsers, FaUserShield } from "react-icons/fa";
import { MdDashboard, MdImage, MdManageAccounts } from "react-icons/md";

import AdminLand from "../../Home/AdminLand/AdminLand";
import AdminDetails from "../AdminDetails/AdminDetails";
import HeroSection from "../HeroSection/HeroSection";
import HostManage from "../HostManage/HostManage";
import PgDetails from "../PgDetails/PgDetails";
import UserDetails from "../UserDetails/UserDetails";

import "./Sidebar.css";

const sidebarItems = [
  { icon: <MdDashboard />, label: "AdminLand" },
  { icon: <MdImage />, label: "HeroSection" },
  { icon: <FaUsers />, label: "UserDetails" },
  { icon: <FaUserShield />, label: "AdminDetails" },
  { icon: <FaHome />, label: "PgDetails" },
  { icon: <MdManageAccounts />, label: "HostManage" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("AdminLand");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      setIsAdmin(true);
    } else {
      navigate("/adminlogin");
    }
  }, [navigate]);

  const renderPage = () => {
    switch (activeTab) {
      case "AdminLand":
        return <AdminLand />;
      case "PgDetails":
        return <PgDetails />;
      case "HeroSection":
        return <HeroSection />;
      case "UserDetails":
        return <UserDetails />;
      case "AdminDetails":
        return <AdminDetails />;
      case "HostManage":
        return <HostManage />;
      default:
        return <UserDetails />;
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="drawer-layout">
      {/* AppBar */}
      <header className={`appbar ${open ? "appbar-open" : ""}`}>
        <div className="left-section">
          <button className="menu-btn" onClick={() => setOpen(!open)}>
            Localpg
          </button>
        </div>

        <div className="right-section">
          <button
            className="profile-btn"
            onClick={() => navigate("/adminprofile")}
          >
            👤
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "sidebar-open" : "sidebar-closed"}`}>
        <ul>
          {sidebarItems.map((item, idx) => (
            <li
              key={idx}
              className={`sidebar-item ${activeTab === item.label ? "active" : ""}`}
              onClick={() => setActiveTab(item.label)}
            >
              <span className="icon">{item.icon}</span>
              {open && <span className="label">{item.label}</span>}
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main className="main-content">{renderPage()}</main>
    </div>
  );
};

export default Sidebar;

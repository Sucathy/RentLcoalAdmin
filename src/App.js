// src/App.js
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminLogin from "./Components/AdminUser/AdminLogin";
import AdminSignup from "./Components/AdminUser/AdminSignup";
import AdminHome from "./Components/Home/AdminHome";
import AdminLand from "./Components/Home/AdminLand/AdminLand";
import Profile from "./Components/Menubar/Profile";
import HostManage from "./Components/Sidebar/HostManage/HostManage";
import HostManageEdit from "./Components/Sidebar/HostManage/HostManageEdit";
import AddPg from "./Components/Sidebar/PgDetails/AddPg";
import EditPg from "./Components/Sidebar/PgDetails/EditPg";
import Sidebar from "./Components/Sidebar/Sidebar/Sidebar";
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<AdminHome />} />
       <Route path="/adminland" element={<AdminLand />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/adminprofile" element={<Profile />} />
        <Route path="Sidebar" element={<Sidebar/>} />
         <Route path="/pgdetails/add" element={<AddPg />} />
        <Route path="/pgdetails/edit/:id" element={<EditPg />} />
        <Route path="/admin/host-manage" element={<HostManage />} />
        <Route path="/admin/host-manage/edit/:id" element={<HostManageEdit />} /> 
      </Routes>
    </Router>
  );
}

export default App;

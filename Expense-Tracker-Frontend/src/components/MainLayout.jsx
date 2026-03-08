import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../styles/MainLayout.css";
import Swal from "sweetalert2";

import { getProfile } from "../services/userApi";
import {
  LayoutDashboard,
  User,
  Settings,
  BadgeIndianRupee,
  LogOut,
  ChevronLeft,
} from "lucide-react";

function MainLayout() {
  const [profile, setProfile] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  return (
    <div className="layout-container">

      {/* Outside collapse button */}
      <button
        className={`collapse-arrow ${collapsed ? "collapsed" : ""}`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Sidebar (NOT collapsing) */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>


        {/* PROFILE PIC */}
        <div className="profile-pic-container">
          {profile?.profileImageUrl ? (
            <img
              src={profile.profileImageUrl}
              alt="Profile"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="no-profile-pic"></div>
          )}
        </div>

        {/* Logo – hide only on collapse */}
         <h2 className="logo">Expense Tracker</h2>

        {/* NavLinkS – only text collapses */}
   <nav className="nav-links">

          <NavLink to="/dashboard">
            <LayoutDashboard className="icon" />
            <span className="NavLink-text">Dashboard</span>
          </NavLink>

          <NavLink to="/profile">
            <User className="icon" />
            <span className="NavLink-text">My Profile</span>
          </NavLink>

          <NavLink to="/expenses">
            <BadgeIndianRupee className="icon" />
            <span className="NavLink-text">My Expenses</span>
          </NavLink>

          <NavLink to="/settings">
            <Settings className="icon" />
            <span className="NavLink-text">Settings</span>
          </NavLink>
        </nav>

        {/* LOGOUT BUTTON */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          {!collapsed && "Logout"}
        </button>
      </aside>

      {/* Main Content */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;

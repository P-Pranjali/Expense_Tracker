import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import DashboardPage from "../pages/DashboardPage";

import ProfilePage from "../pages/ProfilePage";  // Create next
import MainLayout from "../components/MainLayout";
import ExpensesPage from "../pages/MyExpenses";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
       
        <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route  element={<MainLayout />}>
         <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
         <Route path="profile" element={<ProfilePage />} />
          {/* Add more pages later: */}
          <Route path="expenses" element={<ExpensesPage />} />
          {/* <Route path="settings" element={<SettingsPage />} /> */}
       </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;

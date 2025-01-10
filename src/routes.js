import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import Signup from "./components/Signup";
import ClientDashboard from "./components/ClientDashboard";
import ServiceProviderDashboard from "./components/ServiceProviderDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login Route */}
      <Route path="/" element={<Login />} />

      {/* Signup Route */}
      <Route path="/signup" element={<Signup />} />

      {/* Dashboards */}
      <Route path="/ClientDashboard" element={<ClientDashboard />} />
      <Route path="/ServiceProviderDashboard" element={<ServiceProviderDashboard />} />
      <Route path="/AdminDashboard" element={<AdminPanel />} />
    </Routes>
  );
};

export default AppRoutes;

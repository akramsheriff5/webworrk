import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ClientDashboard from "./components/ClientDashboard";
import ServiceProviderDashboard from "./components/ServiceProviderDashboard";
import AdminPanel from "./components/AdminPanel";

const AppRoutes = () => {
  return (
    <Routes basename="/webworrk">
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/ClientDashboard" element={<ClientDashboard />} />
      <Route path="/ServiceProviderDashboard" element={<ServiceProviderDashboard />} />
      <Route path="/AdminPanel" element={<AdminPanel />} />
    </Routes>
  );
};

export default AppRoutes;

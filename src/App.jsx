import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import DentistDashboard from "./pages/DentistDashboard";
import PatientDashboard from "./pages/PatientDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/dentist" element={<DentistDashboard />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
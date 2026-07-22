import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import DentistDashboard from "./pages/DentistDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/dentist" element={<DentistDashboard />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
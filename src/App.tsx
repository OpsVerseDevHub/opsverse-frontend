// import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import Home from "./pages/Home";

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}


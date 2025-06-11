import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Registration from "./components/Registration";

function AppWrapper() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Registration onRegister={handleLogin} />} />
    </Routes>
  );
}

export default function App() {
  return <AppWrapper />;
}

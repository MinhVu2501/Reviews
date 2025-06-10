import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  
  const handleLogin = (token, userData) => {
    setUser(userData);
    localStorage.setItem("token", token);
    
    navigate("/");
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  );
}

export default App;

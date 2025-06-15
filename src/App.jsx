import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Reviews from "./components/Reviews";
import TopRated from "./components/TopRated";
import SearchResults from "./components/SearchResults";
import MovieDetail from "./components/MoviesDetail";
import About from "./components/About";
import Contact from "./components/Contact";

function AppWrapper() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    navigate("/reviews");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Registration onRegister={handleLogin} />} />
      <Route path="/reviews" element={<Reviews user={user} />} />
      <Route path="/reviews/:id" element={<Reviews user={user} />} />
      <Route path="/top-rated" element={<TopRated />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/movies/:id" element={<MovieDetail />} />
      <Route path="/about" element={<About />} /> 
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default function App() {
  return <AppWrapper />;
}

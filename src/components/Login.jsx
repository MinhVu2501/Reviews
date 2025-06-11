import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("https://movies-reviews-ly21.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      onLogin(data.token, data.user);

      setIdentifier("");
      setPassword("");
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label htmlFor="identifier">Username or Email:</label>
      <input
        id="identifier"
        type="text"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <br />

      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Login</button>
    </form>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 8; // Example: Check if the password is at least 8 characters
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError(""); // Clear previous errors before a new API call
    try {
      const response = await axios.post("http://localhost:5001/register", {
        username,
        password,
      });
      console.log(response.data.message); // Log success message
      alert("Registration successful! You can now login."); // Inform user of success
      navigate("/login"); // Redirect to login page on successful registration
    } catch (error) {
      setError(
        error.response
          ? error.response.data.error
          : "Server error or connection issue"
      );
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Register;

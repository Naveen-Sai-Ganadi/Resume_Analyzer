// Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Login({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login`,
        { username, password },
        { withCredentials: true } // Ensure cookies are sent with the request
      );
      if (response.status === 200) {
        console.log(response.data.message); // Log the success message
        setAuth(true); // Update authentication state
        navigate("/"); // Redirect to the home page after successful login
      } else {
        // Handle other statuses or fallback if needed
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      // Improved error handling: handle cases where the response might be undefined
      setError(
        error.response
          ? error.response.data.error
          : "Server error or connection failed"
      );
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        If you don't have an account, <Link to="/register">register here</Link>.
      </p>
    </div>
  );
}

export default Login;

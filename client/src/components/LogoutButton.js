import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LogoutButton({ setAuth }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5001/logout",
        {},
        { withCredentials: true } // Ensure cookies are sent with the request
      );
      setAuth(false); // Update authentication state to false
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
}

export default LogoutButton;

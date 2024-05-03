import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Navigation from "./Navigation"; // Import the new component
import "./App.css";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/check_session",
          { withCredentials: true }
        );
        setAuthenticated(
          response.status === 200 && response.data.authenticated
        );
      } catch (error) {
        console.error("Session check failed:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navigation
        setAuth={setAuthenticated}
        isAuthenticated={isAuthenticated}
      />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Home setAuth={setAuthenticated} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

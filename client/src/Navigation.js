// Navigation.js
import React from "react";
import { useLocation } from "react-router-dom";
import LogoutButton from "./components/LogoutButton";

function Navigation({ setAuth, isAuthenticated }) {
  const location = useLocation();

  return (
    <div className="navigation">
      {isAuthenticated && location.pathname === "/" && (
        <LogoutButton setAuth={setAuth} />
      )}
    </div>
  );
}

export default Navigation;

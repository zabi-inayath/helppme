import React from "react";
import { useLocation } from "react-router-dom";
import "./MobileLayout.css";

const MobileLayout = ({ children }) => {
  const location = useLocation();

  // List of admin paths that should be visible on desktop
  const adminPaths = ["/admin/login", "/admin/dashboard", "/enroll"];
  const isAdminPage = adminPaths.includes(location.pathname);

  // Detect screen width
  const isMobile = window.innerWidth <= 1024;

  return (
    <>
      {isMobile || isAdminPage ? (
        <div className={`mobile-container ${isAdminPage ? "admin-view" : ""}`}>
          {children}
        </div>
      ) : (
        <div className="desktop-warning">
          <h1>This app is only for mobile!</h1>
        </div>
      )}
    </>
  );
};

export default MobileLayout;

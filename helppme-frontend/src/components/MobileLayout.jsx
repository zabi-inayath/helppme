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
          <div className="desktop-warning bg-gradient-to-br from-blue-900/90 via-blue-700/80 to-blue-400/80">
            <h1 className="text-white">This app is only for mobile for now.</h1>
            <p className="text-white">
              Please use a mobile device to access the app.
            </p>
        </div>
      )}
    </>
  );
};

export default MobileLayout;

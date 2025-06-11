import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MobileLayout from "./components/MobileLayout";
import Home from "./pages/Home";
// const dotenv = require("dotenv");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <MobileLayout>
        <Home />
      </MobileLayout>
    </Router>
  </StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client"; // Use the new import
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes"; // Adjust the path based on your structure
import "./styles/style.css"; // Import global styles

// Get the root DOM element
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);

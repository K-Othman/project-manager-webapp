// -------------------------------------------------------------
// Application entry point.
// - Mounts the React app into the DOM
// - Wraps the app with AuthProvider
// - Imports global Tailwind-enabled stylesheet
// -------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <>
      <Navbar />
      <Home />
    </>
  </React.StrictMode>,
);

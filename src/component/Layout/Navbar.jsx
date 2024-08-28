import React from "react";
import "./Navbar.css"; // Or styled-components
import HomeIcon from "@mui/icons-material/Home";
import DiamondIcon from "@mui/icons-material/Diamond";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">
          {" "}
          <div style={{ display: "flex" }}>
            <DiamondIcon sx={{ mt: "auto", mr: 1 }} /> <span>Logo</span>
          </div>
        </a>
      </div>
      <div className="navbar-menu">
        <a href="/">
          <HomeIcon />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

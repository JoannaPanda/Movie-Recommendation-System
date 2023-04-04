import React, { useState, useEffect } from "react";
import Logo from "../images/icon.png";
// import { Link } from "react-router-dom";
import "../styles/Header.css";
import { Link } from "react-router-dom";

// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

function Header() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  const handleClick = () => {
    console.log("Clickable area clicked!");
  };
  return (
    <header>
      <img src={Logo} alt="Logo" className="logo" />
      <ul className="navigation-links">
        <li>
          {token === null ? (
            <div onClick={handleClick}>
              <Link to="/login">
                <div>Log In</div>
              </Link>
            </div>
          ) : (
            <div onClick={handleClick}>
              <Link to="/logout">
                <div>Log Out</div>
              </Link>
            </div>
          )}
        </li>
        <li>
          <div onClick={handleClick}>
            <Link to="/home">
              <div>Home</div>
            </Link>
          </div>
        </li>
        <li>
          <div onClick={handleClick}>
            <Link to="/search">
              <div>Search</div>
            </Link>
          </div>
        </li>
        <li>
          <div onClick={handleClick}>
            <Link to="/contact">
              <div>About&Contact</div>
            </Link>
          </div>
        </li>
        <li>
          <div onClick={handleClick}>
            <Link to="/Dashboard">
              <div>Dashboard</div>
            </Link>
          </div>
        </li>
      </ul>
    </header>
  );
}

export default Header;

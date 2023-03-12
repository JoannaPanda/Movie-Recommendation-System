import React from "react";
import Logo from "../images/icon.png";
// import { Link } from "react-router-dom";
import "../styles/Header.css";

// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

function Header() {
  return (
    <header>
      <img src={Logo} alt="Logo" className="logo" />
      <ul className="navigation-links">
        <li>
          <a href="Home">Home</a>
        </li>
        <li>
          <a href="About">About</a>
        </li>
        <li>
          <a href="Content">Contact</a>
        </li>
      </ul>
    </header>
    //   <AppBar position="static">
    //     <Toolbar>
    //       <IconButton
    //         size="large"
    //         edge="start"
    //         color="inherit"
    //         aria-label="menu"
    //         sx={{ mr: 2 }}
    //       >
    //         <MenuIcon />
    //       </IconButton>

    //       <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
    //         GeeksforGeeks Header
    //       </Typography>
    //       <Button color="inherit">Login</Button>
    //     </Toolbar>
    //   </AppBar>
  );
}

export default Header;

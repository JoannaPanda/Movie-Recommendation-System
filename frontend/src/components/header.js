import React, { useState, useEffect } from "react";
import Logo from "../images/icon.png";
import "../styles/Header.css";
import { Link } from "react-router-dom";
import { backendurl } from "./backendurl";
// This is the header for the whole system
function Header() {
  const [token, setToken] = useState(null);
  const [userinfo, setUserinfo] = useState(null);
  // The token would be obtained from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    // If the user is already log in the token would be saved
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // get the user information from the local storge
  useEffect(() => {
    const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserinfo) {
      // if the user had already logged in the userinfo would be saved
      setUserinfo(storedUserinfo);
    }
  }, []);

  // always get the up-to-date userinfo
  useEffect(() => {
    const fetchUserinfo = async () => {
      try {
        const response = await fetch(
          `http://lbosau.exlb.org:9900/User/Info?Uid=${userinfo.Uid}`
        );
        const data = await response.json();
        setUserinfo(data);
      } catch (error) {
        console.error("Error fetching user info: ", error);
      }
    };
    if (userinfo) {
      fetchUserinfo();
    }
  }, [userinfo]);

  // get the user id if the userinfo is not empty
  const getUid = () => {
    if (userinfo && userinfo.Uid) {
      return userinfo.Uid;
    } else {
      return "User";
    }
  };
  // given the useful console information
  const handleClick = () => {
    console.log("Clickable area clicked!");
  };
  return (
    <header>
      {/* the icon of the website */}
      <img src={Logo} alt="Logo" className="logo" />
      <ul className="navigation-links">
        <li>
          {/* if the token is not null then only log out in the header
          otherwise, only login in the header */}
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
          {/* redirected to the home page */}
          <div onClick={handleClick}>
            <Link to="/home">
              <div>Home</div>
            </Link>
          </div>
        </li>
        <li>
          {/* redirected to the search page */}
          <div onClick={handleClick}>
            <Link to="/search">
              <div>Search</div>
            </Link>
          </div>
        </li>
        <li>
          {/* redirected to the contact page */}
          <div onClick={handleClick}>
            <Link to="/contact">
              <div>About&Contact</div>
            </Link>
          </div>
        </li>
        <li>
          {/* redirected to the profile page */}
          <div onClick={handleClick}>
            <Link to={`/profile/${getUid()}`}>
              <div>Dashboard</div>
            </Link>
          </div>
        </li>
      </ul>
    </header>
  );
}

export default Header;

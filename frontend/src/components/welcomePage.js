import React from "react";
import { Link } from "react-router-dom";
import image from "../images/cinema.png";
import "../styles/welcome.css";

function WelcomePage() {
  return (
    <div
      className="welcomeBackground"
      style={{
        backgroundSize: `cover`,
        height: "900px",
        backgroundColor: "#400b0a",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <img
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 200,
          height: 115,
        }}
        src={require("../images/iconhorizon.png")}
        alt="Icon"
      />
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 335,
        }}
      >
        <h1 style={{ color: "white", fontSize: 50 }}>
          Movies change your life
        </h1>
        <p style={{ color: "white" }}>Escape into a world of wonder.</p>
        <Link to="/login" className="login-link">
          <button
            style={{
              backgroundColor: "transparent",
              border: "2px solid white",
              color: "white",
              padding: "12px 20px",
              fontSize: 12,
              borderRadius: 4,
              marginTop: 50,
              cursor: "pointer",
            }}
          >
            EXPLORE NOW →
          </button>
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import image from "../images/cinema.png";
import BounceWindow from "./bounceWindow";

function WelcomePage() {
  const [showWindow, setShowWindow] = useState(false);

  const handleWindowClick = () => {
    setShowWindow(true);
  };

  const handleWindowChoice = (choice) => {
    setShowWindow(false);
    if (choice === "Yes") {
      console.log("cliked yes");
    } else {
      console.log("clicked no");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${image}})`,
        backgroundSize: `cover`,
        width: "88%",
        height: "800px",
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
          onClick={handleWindowClick}
        >
          EXPLORE NOW →
        </button>
        {showWindow && (
          <BounceWindow
            message="Are you ready to explore?"
            choices={["No", "Yes"]}
            onChoice={handleWindowChoice}
            link="/login"
          />
        )}
      </div>
    </div>
  );
}

export default WelcomePage;

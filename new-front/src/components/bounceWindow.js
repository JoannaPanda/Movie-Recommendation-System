import React from "react";
import { Link } from "react-router-dom";
import "../styles/window.css";

function BounceWindow(props) {
  const { message, choices, onChoice, link } = props;

  const handleButtonClick = (choice) => {
    onChoice(choice);
  };

  return (
    <div className="windowWrapper">
      <div className="windowContent">
        <div className="windowHeader">
          <h2>{message}</h2>
        </div>
        <div className="windowButton">
          <Link to={link}>
            <button onClick={() => handleButtonClick(choices[0])}>
              {choices[0]}
            </button>
          </Link>

          <button onClick={() => handleButtonClick(choices[1])}>
            {choices[1]}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BounceWindow;

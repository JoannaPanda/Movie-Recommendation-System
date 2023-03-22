import React, { useState } from "react";

const DirectorBar = ({ onToggle }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(!isSelected);
    onToggle(!isSelected);
    console.log("click director");
  };

  return (
    <nav>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${isSelected ? "active" : ""}`}
            onClick={handleClick}
            style={{
              fontSize: "16px",
              padding: "10px 20px",
              backgroundColor: isSelected ? "blue" : "grey",
              color: isSelected ? "white" : "black",
            }}
          >
            Just like this director?
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DirectorBar;

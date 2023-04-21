import React, { useState } from "react";
// the director bar is only used in the recommendation system
const DirectorBar = ({ onToggle }) => {
  const [isSelected, setIsSelected] = useState(false);
  // this would give the isselected back to recommendation component
  // which would be used to filter recommendation movies
  const handleClick = () => {
    setIsSelected(!isSelected);
    onToggle(!isSelected);
    console.log("click director");
  };

  return (
    <nav>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          {/* the button of director */}
          <button
            type="button"
            className={`nav-link ${isSelected ? "active" : ""}`}
            onClick={handleClick}
            style={{
              fontSize: "16px",
              padding: "10px 20px",
              backgroundColor: isSelected ? "blue" : "grey",
              color: "white",
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

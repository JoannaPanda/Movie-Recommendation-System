import React from "react";
import { Rating } from "@mui/material";

function StarRating({ name, value, onValueChange }) {
  const handleChange = (event, newValue) => {
    onValueChange(newValue);
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: "1rem", fontSize: "20px" }}>{name} : </div>
      <Rating name="simple-controlled" value={value} onChange={handleChange} />
      <div style={{ marginLeft: "1rem", fontSize: "20px" }}>
        {value === 5 && "Excellent"}
        {value === 4 && "Good"}
        {value === 3 && "Average"}
        {value === 2 && "Below Average"}
        {value === 1 && "Poor"}
        {value === 0 && "Terrible"}
      </div>
    </div>
  );
}

export default StarRating;

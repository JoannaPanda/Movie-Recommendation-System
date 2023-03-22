import React, { useState } from "react";

function HeartButton({ movieId }) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(!clicked);

    // Get the user's token from local storage
    const token = localStorage.getItem("token");

    // Create the request parameters
    const params = new URLSearchParams();
    params.append("token", token);
    params.append("mid", movieId);
    let url = "";
    // Make the API request to add/remove the movie to the user's wishlist
    if (clicked) {
      url = "http://lbosau.exlb.org:9900/User/Wishlist/remove";
    } else {
      url = "http://lbosau.exlb.org:9900/User/Wishlist/add";
    }
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add movie to wishlist");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const buttonStyle = {
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "47px",
    cursor: "pointer",
  };

  return (
    <button style={buttonStyle} onClick={handleClick}>
      {clicked ? "❤️" : "🖤"}
    </button>
  );
}

export default HeartButton;

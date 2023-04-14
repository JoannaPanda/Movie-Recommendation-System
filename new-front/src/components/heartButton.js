import React, { useState, useEffect } from "react";

function HeartButton({ movieId }) {
  const [clicked, setClicked] = useState(false);
  const [userinfo, setUserinfo] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserinfo) {
      setUserinfo(storedUserinfo);
    }
  }, []);

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

  useEffect(() => {
    if (userinfo && userinfo.WishList) {
      const wishListValues = Object.values(userinfo.WishList);
      console.log("wishlistvalues", wishListValues);
      console.log("movieId", movieId);
      if (wishListValues.includes(parseInt(movieId))) {
        setInWishlist(true);
      } else {
        setInWishlist(false);
      }
    }
  }, [userinfo]);

  console.log("wishlist", inWishlist);
  //   console.log("userinfo", userinfo);

  const buttonStyle = {
    background: "transparent",
    border: "none",
    outline: "none",
    fontSize: "47px",
    cursor: "pointer",
    color: inWishlist ? "red" : "black", // Set the color based on whether the movieId is in the user's wishlist or not
  };

  return (
    <button style={buttonStyle} onClick={handleClick}>
      {inWishlist ? "❤️" : "🖤"}
    </button>
  );
}

export default HeartButton;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HeartButton({ movieId }) {
  const [clicked, setClicked] = useState(false);
  const [userinfo, setUserinfo] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [comments, setComment] = useState([]);
  const [ownWish, setOwnWish] = useState(0);

  // user level and according banlist & wishlist limits
  const MAX_BANWISHS = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
  };

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
        setOwnWish(data.WishList.length);
      } catch (error) {
        console.error("Error fetching user info: ", error);
      }
    };
    if (userinfo) {
      fetchUserinfo();
    }
  }, [userinfo]);

  useEffect(() => {
    // fetch all comment for this user
    if (userinfo) {
      axios
        .get(`http://lbosau.exlb.org:9900/User/Comment?Uid=${userinfo.Uid}`)
        .then((response) => {
          setComment(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userinfo]);

  const used_comment_length = comments.length;
  const level =
    used_comment_length < 50 ? Math.floor(used_comment_length / 10) + 1 : 5;

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
    if (
      ownWish >= MAX_BANWISHS[level] &&
      comments.length < 50 &&
      url === "http://lbosau.exlb.org:9900/User/Wishlist/add"
    ) {
      // alert(
      //   "You have exceeded the maximum number of movie wishlists for your user level."
      // );
      toast.error(
        "You have exceeded the maximum number of movie wishlists for your user level.",
        {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        }
      );
    } else {
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

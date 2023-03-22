import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [movie, setMovie] = useState([]);
  const [userinfo, setUserinfo] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

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

  useEffect(() => {
    if (userinfo) {
      const mids = Object.values(userinfo.WishList);
      const requests = mids.map((mid) =>
        axios.get(
          `http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}&token=${token}`
        )
      );
      Promise.all(requests)
        .then((responses) => {
          const movies = responses.map((response) => response.data.movieinfo);
          setMovie(movies);
          // console.log("movies", movies);
        })
        .catch((error) => {
          console.log(error);
          window.location.href = "/404";
        });
    }
  }, [userinfo, token]);

  const getUsername = () => {
    if (userinfo && userinfo.UserName) {
      return userinfo.UserName;
    } else {
      return "User";
    }
  };

  const getUid = () => {
    if (userinfo && userinfo.Uid) {
      return userinfo.Uid;
    } else {
      return "User";
    }
  };

  console.log("currinfo", userinfo);
  // console.log("currid", userinfo && userinfo.Uid);
  console.log("movies", movie);

  return (
    <div
      style={{
        marginTop: "200px",
        marginLeft: "25%",
        color: "whitesmoke",
        maxWidth: "50%",
        alignItems: "center",
        textAlign: "center",
        textShadow: "inherit",
        textEmphasisColor: "Highlight",
      }}
    >
      <h1>{getUsername()}'s Dashboard</h1>
      {userinfo && (
        <div>
          <p>Name: {userinfo.UserName}</p>
          <p>Email: {userinfo.Email}</p>
          <p>Preference: {Object.keys(userinfo.PreferenceModels).join(", ")}</p>
          {/* <p>WishList: {Object.values(userinfo.WishList).join(", ")}</p> */}
          <p>WishList: {movie.map((m) => m.MovieName).join(", ")}</p>
          <p>Click the button below to change Preference.</p>
          <Link to="/setprefgenre" className="login-link">
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
              CHANGE PREFERENCE →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

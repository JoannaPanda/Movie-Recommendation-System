import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import * as d3 from "d3";

function Dashboard() {
  const [movie, setMovie] = useState([]);
  const [userinfo, setUserinfo] = useState(null);
  const [token, setToken] = useState(null);
  const [progress, setProgress] = useState(0);
  const targetCount = 10;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  console.log("Token", token);

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
      const wishlistCount = mids.length;

      // Calculate the progress
      const progress = Math.min(wishlistCount / targetCount, 1);
      setProgress(progress);
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

  const chartRef = useRef();

  useEffect(() => {
    const data = [
      { label: "Completed", value: progress * 100 },
      { label: "Remaining", value: 100 - progress * 100 },
    ];

    const svg = d3.select(chartRef.current);
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const color = d3.scaleOrdinal().range(["#004AAD", "#EFEFEF"]);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(radius / 2);

    const outerArc = d3
      .arc()
      .outerRadius((radius - 10) * 1.07)
      .innerRadius((radius / 2) * 1.07);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const path = g
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label))
      .on("mouseover", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", outerArc);
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("d", arc);
      })
      .each(function(d) {
        this._current = d;
      });

    const text = g
      .selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${outerArc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-weight", "bold");

    text
      .append("tspan")
      .text((d) => d.data.label)
      .attr("x", 0)
      .attr("dy", "-0.5em");

    text
      .append("tspan")
      .text((d) => `${Math.round(d.data.value)}%`)
      .attr("x", 0)
      .attr("dy", "1em");

    return () => {
      svg.selectAll("*").remove();
    };
  }, [progress]);

  // const getUid = () => {
  //   if (userinfo && userinfo.Uid) {
  //     return userinfo.Uid;
  //   } else {
  //     return "User";
  //   }
  // };

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
          <svg ref={chartRef} width="350" height="350"></svg>
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

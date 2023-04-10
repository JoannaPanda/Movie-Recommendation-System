import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import axios from "axios";
import * as d3 from "d3";
import { Link } from "react-router-dom";

const Profile = () => {
  const { uid } = useParams();
  const [comments, setComment] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [movieNames, setMovieNames] = useState([]);
  const [movieInfo, setMovieInfo] = useState([]);
  const [banlist, setBanlist] = useState([]);
  const [banUser, setBanUser] = useState([]);
  const [director, setDirector] = useState([]);
  const [scores, setScores] = useState([]);
  const [token, setToken] = useState([]);

  const [scrollIndex, setScrollIndex] = useState(0);

  const [progress, setProgress] = useState(0);
  const [userinfo, setUserinfo] = useState(null);
  const [ouid, setOuid] = useState(null);
  const targetCount = 10;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    // fetch all comment for this user
    axios
      .get(`http://lbosau.exlb.org:9900/User/Comment?Uid=${uid}`)
      .then((response) => {
        setComment(response.data);
        setVisibleComments(response.data.slice(0, 10));
        setScrollIndex(10);
      })
      .catch((error) => {
        console.log(error);
      });

    // fetch user information
    axios
      .get(`http://lbosau.exlb.org:9900/User/Info?Uid=${uid}`)
      .then((response) => {
        setUserInfo(response.data);
        setBanlist(response.data.BanList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [uid]);

  // banning list
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleClick = () => {
    setIsDialogOpen(true);
    document.body.classList.add("modal-open");
  };
  const handleClose = () => {
    setIsDialogOpen(false);
    document.body.classList.remove("modal-open");
  };

  useEffect(() => {
    Promise.all(
      banlist.map((uid) =>
        fetch(
          `http://lbosau.exlb.org:9900/User/Info?Uid=${uid}`
        ).then((response) => response.json())
      )
    ).then((users) => {
      setBanUser(users);
    });
  }, [banlist]);

  // load more data when scroll down the button.
  const loadMoreComments = useCallback(() => {
    if (scrollIndex >= comments.length) return;

    setVisibleComments((prevVisibleComments) =>
      prevVisibleComments.concat(comments.slice(scrollIndex, scrollIndex + 10))
    );

    setScrollIndex((prevScrollIndex) => prevScrollIndex + 10);
  }, [scrollIndex, comments]);

  useEffect(() => {
    const handleScroll = (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.target;
      if (scrollHeight - scrollTop <= clientHeight) {
        loadMoreComments();
      }
    };
    const container = document.getElementById("profile");
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreComments]);

  useEffect(() => {
    Promise.all(
      visibleComments.map((comment) =>
        fetch(
          `http://lbosau.exlb.org:9900/Movie/Info?Mid=${comment.Mid}`
        ).then((response) => response.json())
      )
    )
      .then((data) => {
        const movieNames = data.map(
          (movieInfo) => movieInfo.movieinfo.MovieName
        );
        setMovieNames(movieNames);

        const movieDirector = data.map(
          (movieInfo) => movieInfo.movieinfo.Director
        );
        setDirector(movieDirector);

        const movieScores = data.map((movieInfo) => movieInfo.movieinfo.Score);
        setScores(movieScores);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [visibleComments]);

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
      const ouid = userinfo.Uid;
      setOuid(ouid.toString());
      const mids = Object.values(userinfo.WishList);
      const wishlistCount = mids.length;
      console.log("wishlist count", wishlistCount);

      // Calculate the progress
      const progress = Math.min(wishlistCount / targetCount, 1);
      setProgress(progress);
    }
  }, [userInfo, token]);

  console.log(ouid, uid);

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
    const color = d3.scaleOrdinal().range(["#004AAD", "#ADD8E6"]);

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

  return (
    <div id="profile">
      <div className="background">
        <div className="profile-white-box">
          <Link to={`/wishlist${ouid === uid ? "" : `/${uid}`}`}>
            {ouid === uid ? (
              <svg
                className="progChart"
                ref={chartRef}
                width="350"
                height="350"
              ></svg>
            ) : null}
          </Link>
          <div className="inline">
            <img
              src={`http://lbosau.exlb.org:9900/Image/User/${uid}`}
              className="user-poster"
            />
            <div>
              <div className="inline">
                <h3 style={{ marginBottom: "6px", marginTop: "6px" }}>
                  {userInfo.UserName !== "" ? userInfo.UserName : "Tong Xia"}
                </h3>
                <img
                  className="ban-poster"
                  src={require("../CommentImage/ban.png")}
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.append("token", token);
                    params.append("Uid", uid);
                    console.log(params.toString());
                    fetch(`http://lbosau.exlb.org:9900/User/Banlist/add`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      body: params.toString(),
                    })
                      .then((response) => {
                        if (response.ok) {
                          alert("The user has been added to the banning list");
                        } else {
                          throw new Error("Failed to add banning list");
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}
                />
              </div>
              <div className="inline">
                <div>
                  <h4>Contributions</h4>
                  <h4 style={{ marginTop: "-20px" }}>{comments.length}</h4>
                </div>
                <div onClick={handleClick} className="banning">
                  <h4 style={{ marginLeft: "55%" }}>Banning</h4>
                  <h4 style={{ marginLeft: "55%", marginTop: "-20px" }}>
                    {banlist.length}
                  </h4>
                </div>
                <div>
                  <Link to={`/wishlist${ouid === uid ? "" : `/${uid}`}`}>
                    <h4 style={{ marginLeft: "60px" }}>Wishlist</h4>
                  </Link>

                  {userInfo.WishList && (
                    <h4 style={{ marginTop: "-20px", marginLeft: "60px" }}>
                      {Object.keys(userInfo.WishList).length}
                    </h4>
                  )}
                </div>
                {isDialogOpen && (
                  <div className="modal">
                    <div>
                      <div className="close-background" onClick={handleClose}>
                        {
                          <img
                            className="delete_poster2"
                            src={require("../CommentImage/close.png")}
                          />
                        }
                      </div>
                      <div className="modal-content">
                        {banUser.map((user) => (
                          <>
                            <div className="inline" key={user.Uid}>
                              <img
                                className="banlist_user_poster"
                                src={`http://lbosau.exlb.org:9900/Image/User/${user.Uid}`}
                              />
                              <div>
                                <h4 className="banlist_user_name">
                                  {user.UserName}
                                </h4>
                                <h5 className="banlist_email">{user.Email}</h5>
                                <div>
                                  <div className="inline">
                                    <div className="banlist_desc">
                                      {user.WishList.length} Wishes ·
                                    </div>
                                    <div className="banlist_desc">
                                      {user.BanList.length} Bans
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {
                                <img
                                  className="banlist_delete"
                                  src={require("../CommentImage/delete.png")}
                                  onClick={() => {
                                    const params = new URLSearchParams();
                                    params.append("token", token);
                                    params.append("Uid", user.Uid);
                                    console.log(params.toString());
                                    fetch(
                                      `http://lbosau.exlb.org:9900/User/Banlist/remove`,
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type":
                                            "application/x-www-form-urlencoded",
                                        },
                                        body: params.toString(),
                                      }
                                    )
                                      .then((response) => {
                                        if (response.ok) {
                                          alert(
                                            "The user has been removed to the banning list"
                                          );
                                        } else {
                                          throw new Error(
                                            "Failed to remove banning list"
                                          );
                                        }
                                      })
                                      .catch((error) => {
                                        console.log(error);
                                      });
                                  }}
                                />
                              }
                            </div>

                            <hr
                              style={{
                                borderColor: "#e0e0e0",
                                borderWidth: "1px",
                                width: "95%",
                                marginTop: "30px",
                                marginBottom: "30px",
                                opacity: "0.3",
                              }}
                            />
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="white-small-box">
          {visibleComments.map((comment, index) => (
            <div key={comment.id}>
              <div className="inline">
                <div style={{ width: "30%", marginLeft: "50px" }}>
                  <img
                    className="user_poster"
                    src={`http://lbosau.exlb.org:9900/Image/User/${comment.Uid}`}
                  />
                </div>
                <h5 className="userName">
                  {userInfo.UserName !== "" ? userInfo.UserName : "Tong Xia"}
                </h5>
                <h6 className="writeReview">wrote a review</h6>
                <div>
                  {
                    <img
                      className="delete_poster"
                      src={require("../CommentImage/close.png")}
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.append("Cid", comment.Cid);
                        params.append("token", token);
                        console.log(params.toString());
                        fetch(`http://lbosau.exlb.org:9900/Comment/remove`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                          },
                          body: params.toString(),
                        })
                          .then((response) => {
                            if (response.ok) {
                              alert("Comment deleted successfully");
                            } else {
                              throw new Error("Failed to delete comment");
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      }}
                    />
                  }
                </div>
              </div>
              <div style={{ marginLeft: "50px" }}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {[...Array(comment.Score)].map((_, index) => (
                    <img
                      key={index}
                      className="comment-poster"
                      src={require("../CommentImage/circle.png")}
                    />
                  ))}
                  {[...Array(5 - Math.floor(comment.Score))].map((_, index) => (
                    <img
                      key={index}
                      className="comment-poster"
                      src={require("../CommentImage/emptyCircle.png")}
                    />
                  ))}
                </div>
                <div className="userComment">{comment.Comment}</div>
                <div className="inline">
                  <div>
                    {
                      <img
                        className="profile-movie_poster"
                        src={`http://lbosau.exlb.org:9900/image/${movieNames[index]}/${movieNames[index]}`}
                      />
                    }
                  </div>
                  <div className="box">
                    <div className="movieName">{movieNames[index]}</div>
                    <div className="dirName">{director[index]}</div>
                    {scores[index] !== undefined && (
                      <>
                        {[...Array(Math.floor(scores[index]))].map((_, i) => (
                          <img
                            key={i}
                            className="comment-poster"
                            src={require("../CommentImage/circle.png")}
                          />
                        ))}
                        {[
                          ...Array(5 - Math.floor(Math.max(0, scores[index]))),
                        ].map((_, i) => (
                          <img
                            key={i}
                            className="comment-poster"
                            src={require("../CommentImage/emptyCircle.png")}
                          />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <hr
                style={{
                  borderColor: "#e0e0e0",
                  borderWidth: "1px",
                  width: "95%",
                  marginTop: "30px",
                  marginBottom: "30px",
                  opacity: "0.3",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import axios from "axios";
import * as d3 from "d3";
import { Link } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";
import "../styles/progress.css";
import UserProfileImageUpload from "../components/profilePhoto";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { uid } = useParams();
  const [comments, setComment] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [movieNames, setMovieNames] = useState([]);
  const [movieInfo, setMovieInfo] = useState([]);
  const [banlist, setBanlist] = useState([]);
  const [ownBan, setOwnBan] = useState(0);
  const [banUser, setBanUser] = useState([]);
  const [director, setDirector] = useState([]);
  const [scores, setScores] = useState([]);
  const [token, setToken] = useState([]);
  const [refresh, setReFresh] = useState(false);
  const [olevel, setOlevel] = useState([]);

  const [scrollIndex, setScrollIndex] = useState(0);

  const [progress, setProgress] = useState(0);
  const [userinfo, setUserinfo] = useState(null);
  const [ouid, setOuid] = useState(null);
  const targetCount = 10;

  // user level and according banlist & wishlist limits
  const MAX_BANWISHS = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 25,
  };

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
  }, [uid, refresh]);

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

  // profile image upload
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const handleImageDialogOpen = () => {
    setIsImageDialogOpen(true);
  };

  const handleImageDialogClose = () => {
    setIsImageDialogOpen(false);
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
  }, [banlist, refresh]);

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
      if (scrollHeight - scrollTop <= clientHeight + 10) {
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
        setOwnBan(data.BanList.length);
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
      axios
        .get(`http://lbosau.exlb.org:9900/User/Comment?Uid=${userinfo.Uid}`)
        .then((response) => {
          const ownlevel =
            response.data.length < 50
              ? Math.floor(response.data.length / 10) + 1
              : 5;
          setOlevel(ownlevel);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userinfo]);

  useEffect(() => {
    if (userinfo) {
      const ouid = userinfo.Uid;
      setOuid(ouid.toString());
      const mids = Object.values(userinfo.WishList);
      const wishlistCount = mids.length;
      console.log("wishlist count", wishlistCount);

      let progress;
      // Calculate the progress
      // if level is not null or not "Complete",
      // the progress is calculated using MAX_BANWISHS[level]
      // If level is "Complete", the progress is calculated using a target count of 100
      if (level !== null && level !== "Complete") {
        progress = Math.min(wishlistCount / MAX_BANWISHS[level], 1);
      } else if (level === "Complete") {
        progress = Math.min(wishlistCount / 100, 1);
      } else {
        progress = Math.min(wishlistCount / targetCount, 1);
      }

      setProgress(progress);
    }
  }, [userinfo, token]);

  // console.log(ouid, uid);

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
      .style("font-weight", "bold")
      .style("font-size", "13px");

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

  const used_comment_length = comments.length;
  const level =
    used_comment_length < 50 ? Math.floor(used_comment_length / 10) + 1 : 5;
  const nextLevel = level < 4 ? `Level ${level + 1}` : "Complete";
  const completed =
    used_comment_length < 50 ? (used_comment_length % 10) * 10 : 100;
  const rewards =
    used_comment_length < 50
      ? `${10 - (used_comment_length % 10)} more reviews to ${nextLevel}`
      : `Great!!! You are on the top level!`;
  return (
    <div id="profile">
      <div className="background">
        <div className="profile-white-box">
          <div className="inline">
            <img
              src={`http://lbosau.exlb.org:9900/Image/User/${uid}`}
              className="user-poster"
            />
            <img
              src={require("../CommentImage/upload.png")}
              onClick={handleImageDialogOpen}
              className="imageUpload"
              style={{ width: "30px", height: "30px", marginTop: "100px" }}
            ></img>
            {console.log(isImageDialogOpen)}
            {isImageDialogOpen && (
              <div className="modal">
                <div>
                  <div
                    className="close-background"
                    onClick={handleImageDialogClose}
                  >
                    {
                      <img
                        className="delete_poster2"
                        src={require("../CommentImage/close.png")}
                      />
                    }
                  </div>
                  <div className="modal-content">
                    <UserProfileImageUpload />
                  </div>
                </div>
              </div>
            )}
            <div>
              <div className="inline">
                <h3 style={{ marginBottom: "6px", marginTop: "6px" }}>
                  {userInfo.UserName !== "" ? userInfo.UserName : "User"}
                </h3>
                {console.log(ownBan, olevel, MAX_BANWISHS[olevel])}
                {ouid !== uid ? (
                  <>
                    <img
                      className="ban-poster"
                      src={require("../CommentImage/ban.png")}
                      onClick={() => {
                        if (
                          ownBan >= MAX_BANWISHS[olevel] &&
                          olevel !== "Complete"
                        ) {
                          // alert(
                          //   "You have exceeded the maximum number of bans for your user level."
                          // );
                          toast.error(
                            "You have exceeded the maximum number of bans for your user level.",
                            {
                              position: "bottom-left",
                              autoClose: 1000,
                              hideProgressBar: false,
                              closeOnClick: true,
                            }
                          );
                        } else {
                          const params = new URLSearchParams();
                          params.append("token", token);
                          params.append("Uid", uid);
                          console.log(params.toString());
                          fetch(
                            `http://lbosau.exlb.org:9900/User/Banlist/add`,
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
                                // alert(
                                //   "The user has been added to the banning list"
                                // );
                                toast.success(
                                  "The user has been added to the banning list",
                                  {
                                    position: "bottom-left",
                                    autoClose: 1000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                  }
                                );
                              } else {
                                throw new Error("Failed to add banning list");
                              }
                            })
                            .catch((error) => {
                              console.log(error);
                            });
                        }
                      }}
                    />
                  </>
                ) : null}
              </div>
              <div className="inline">
                <div>
                  <h4>Contributions</h4>
                  <h4 style={{ marginTop: "-20px", textAlign: "center" }}>
                    {comments.length}
                  </h4>
                </div>
                <div onClick={handleClick} className="banning">
                  <h4 style={{ marginLeft: "55%" }}>Banning</h4>
                  <h4
                    style={{
                      marginLeft: "88%",
                      marginTop: "-20px",
                      textAlign: "center",
                    }}
                  >
                    {banlist.length}
                  </h4>
                </div>
                <div>
                  <Link to={`/wishlist${ouid === uid ? "" : `/${uid}`}`}>
                    <h4 style={{ marginLeft: "70px" }}>Wishlist</h4>
                  </Link>

                  {userInfo.WishList && (
                    <h4
                      style={{
                        marginTop: "-20px",
                        marginLeft: "60px",
                        textAlign: "center",
                      }}
                    >
                      {Object.keys(userInfo.WishList).length}
                    </h4>
                  )}
                </div>
                <div>
                  <h4 style={{ marginLeft: "45px" }}>Level</h4>
                  <h4
                    style={{
                      marginLeft: "50%",
                      marginTop: "-20px",
                      textAlign: "center",
                    }}
                  >
                    {level}
                  </h4>
                </div>
                <div style={{ textAlign: "center", marginLeft: "60px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "1rem",
                      marginLeft: "170px",
                    }}
                  >
                    <h4 style={{ marginRight: "1rem" }}>{rewards}</h4>
                    <div
                      className="pass-instruction"
                      style={{ marginTop: "-75px", marginLeft: "2px" }}
                    >
                      <span>&#63;</span>
                    </div>
                  </div>
                  {comments.length >= 50 ? (
                    <h4
                      style={{
                        color: "red",
                        marginTop: "-10px",
                      }}
                    >
                      You have unlimited postions in your ban list and wish list
                    </h4>
                  ) : (
                    <h4 style={{ color: "red", marginTop: "-10px" }}>
                      You have maximum {5 * level} positions in your ban list
                      and wish list
                    </h4>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: -30,
                    }}
                  >
                    <h4 style={{ marginRight: "10px" }}>Level {level}</h4>
                    <div style={{ width: "400px" }}>
                      {/* learnt progress bar from
                      https://www.tutorialspoint.com/how-to-create-progress-bar-in-reactjs */}
                      <ProgressBar
                        completed={completed}
                        bgColor="green"
                        animateOnRender={true}
                        style={{ marginTop: "-10px" }}
                      />
                    </div>

                    <h4 style={{ marginLeft: "10px" }}>{nextLevel}</h4>
                  </div>
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
                      <div
                        className="modal-content"
                        style={{
                          maxHeight: "calc(100vh - 200px)",
                          overflowY: "auto",
                        }}
                      >
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
                                    setReFresh(!refresh);
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
                                          // alert(
                                          //   "The user has been removed to the banning list"
                                          // );
                                          toast.success(
                                            "The user has been removed to the banning list",
                                            {
                                              position: "bottom-left",
                                              autoClose: 1000,
                                              hideProgressBar: false,
                                              closeOnClick: true,
                                            }
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
        <div
          style={{
            textAlign: "center",
            position: "absolute",
            top: "83%",
            left: "82%",
            transform: "translate(-82%, -82%)",
          }}
        >
          <Link to={`/wishlist${ouid === uid ? "" : `/${uid}`}`}>
            {ouid === uid ? (
              <svg
                className="progChart"
                ref={chartRef}
                width="345"
                height="345"
              ></svg>
            ) : null}
          </Link>
          {ouid === uid ? (
            <>
              <p style={{ marginLeft: "90px", fontSize: 13 }}>
                Click the button below to add more preference tags.
              </p>
              <Link to="/setprefgenre" className="login-link">
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid black",
                    color: "black",
                    padding: "12px 20px",
                    fontSize: 12,
                    borderRadius: 4,
                    cursor: "pointer",
                    marginLeft: "90px",
                  }}
                >
                  ADD MORE PREFERENCE →
                </button>
              </Link>
            </>
          ) : null}
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
                  {userInfo.UserName !== "" ? userInfo.UserName : "User"}
                </h5>
                <h6 className="writeReview">wrote a review</h6>
                <div>
                  {
                    <img
                      className="delete_poster"
                      src={require("../CommentImage/close.png")}
                      onClick={() => {
                        setReFresh(!refresh);
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
                              // alert("Comment deleted successfully");
                              toast.success("Comment deleted successfully", {
                                position: "bottom-left",
                                autoClose: 1000,
                                hideProgressBar: false,
                                closeOnClick: true,
                              });
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
                      className="review_comment-poster"
                      src={require("../CommentImage/circle.png")}
                    />
                  ))}
                  {[...Array(5 - Math.floor(comment.Score))].map((_, index) => (
                    <img
                      key={index}
                      className="review_comment-poster"
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
                            className="review_comment-poster"
                            src={require("../CommentImage/circle.png")}
                          />
                        ))}
                        {[
                          ...Array(5 - Math.floor(Math.max(0, scores[index]))),
                        ].map((_, i) => (
                          <img
                            key={i}
                            className="review_comment-poster"
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
      <ToastContainer />
    </div>
  );
};

export default Profile;

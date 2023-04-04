import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import "./profile.css";
import axios from "axios";

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

  return (
    <div id="profile">
      <div className="background">
        <div className="profile-white-box">
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
                    const data = {
                      token: token,
                      Uid: uid,
                    };
                    fetch(`http://lbosau.exlb.org:9900/User/Banlist/add`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                      body: JSON.stringify(data),
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
                                    const data = {
                                      token: token,
                                      Uid: uid,
                                    };
                                    fetch(
                                      `http://lbosau.exlb.org:9900/User/Banlist/remove`,
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type":
                                            "application/x-www-form-urlencoded",
                                        },
                                        body: JSON.stringify(data),
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
                        const data = {
                          Cid: comment.Cid,
                          token: token,
                        };
                        fetch(`http://lbosau.exlb.org:9900/Comment/remove`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(data),
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

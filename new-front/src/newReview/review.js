import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import "./review.css";
import axios from "axios";
import { Link } from "react-router-dom";
import LikeComment from "../components/likeComment";

const ListComment = () => {
  // extract "mid" information from URL
  const { mid } = useParams();
  // initial comment as empty
  const [comments, setComment] = useState([]);
  const [score, setScore] = useState([]);
  const [movieInfo, setMovieInfo] = useState([]);
  const [movieName, setMovieName] = useState([]);
  const [rank, setRank] = useState(0);

  const [visibleComments, setVisibleComments] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  useEffect(() => {
    fetch("http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=Score&desc=True", {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(mid);
        data.forEach((movie) => {
          console.log(`Movie Mid: ${movie.Mid}`);
        });
        const movieIndex = data.findIndex(movie => parseInt(movie.Mid) === parseInt(mid));
        console.log(movieIndex);
        setRank(movieIndex);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  useEffect(() => {
    // fetch comment and movie info
    setIsLoading(true);
    Promise.all([
      axios.get(
        `http://lbosau.exlb.org:9900/Comment/Movie?Mid=${mid}&token=${token}`
      ),
      axios.get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}`),
    ])
      .then(([commentResponse, movieResponse]) => {
        setComment(commentResponse.data.commentinfo);
        setVisibleComments(commentResponse.data.commentinfo.slice(0, 10));
        setScore(commentResponse.data.score);
        setScrollIndex(10);
        console.log("Comment response", commentResponse.data);
        console.log(
          "Comment request URL: ",
          `http://lbosau.exlb.org:9900/Comment/Movie?Mid=${mid}&token=${token}`
        );
        setMovieInfo(movieResponse.data.movieinfo);
        setMovieName(movieResponse.data.movieinfo.MovieName);
        console.log("Movie response", movieResponse.data);
        console.log(
          "Movie request URL: ",
          `http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}`
        );
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [mid, token]);

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
    const container = document.getElementById("comment");
    console.log(container);
    console.log(comments);
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreComments]);

  return (
    <div id="comment">
      <div className="review_inline-element">
        <a href="https://www.google.com" target="_blank">
          <img
            className="review_back_poster"
            src={require("../CommentImage/back.png")}
          />
        </a>
        <div className="review_title">{movieName}</div>
        <div className="review_pass_poster">
          <img
            className="review_pass_poster"
            src={require("../CommentImage/pass.png")}
          />
        </div>
        <div style={{ marginTop: "50px", fontSize: "15px" }}>Claimed</div>
      </div>

      <div className="review_container-green">
        <div className="review_inline-element">
          <div className="review_container-largegreen"></div>
          <div className="review_covid-noticeL">COVID-19 update:</div>
          <div className="review_covid-noticeS">
            {" "}
            Enjoy movies safely with our enhanced health measures.
          </div>
          <a
            href="https://www.healthdirect.gov.au/covid19-restriction-checker/entertainment-and-amusement-venues/nsw"
            target="_blank"
          >
            <div className="review_covid-noticeM">Read more</div>
          </a>
        </div>
      </div>

      <div className="review_container-grey">
        <div className="review_inline-element">
          <div>
            {
              <img
                className="review_movie_poster"
                src={`http://lbosau.exlb.org:9900/image/${movieName}/${movieName}`}
              />
            }
          </div>
          <div className="review_white-box">
            <div style={{ padding: "20px" }}>
              <h4 style={{ marginTop: "10px" }}>Ratings and reviews</h4>
              <div className="review_inline-element">
                <h3 style={{ marginTop: "0px", marginRight: "10px" }}>
                  {Number(parseFloat(score).toFixed(2))}
                </h3>
                {[...Array(Math.floor(Number(score)))].map((_, index) => (
                  <img
                    key={index}
                    className="review_rest_circle"
                    src={require("../CommentImage/circle.png")}
                  />
                ))}
              </div>
              <h5 style={{ marginTop: "0px", marginBottom: "10px" }}>
                # {rank} of movie in Movie Finder
              </h5>
              <h5 style={{ marginTop: "0px", marginBottom: "40px" }}>
                # {comments.length} of movie finders reviews
              </h5>

              <hr
                style={{
                  borderColor: "#e0e0e0",
                  borderWidth: "1px",
                  width: "90%",
                  opacity: "0.3",
                }}
              />

              <h4 style={{ marginTop: "40px" }}>Type</h4>
              <h5>{movieInfo.Type}</h5>
            </div>
          </div>
          <div className="review_white-box">
            <div style={{ padding: "20px" }}>
              <h4 style={{ marginTop: "10px" }}>Location and contact</h4>
              <a
                href="https://www.google.com/maps/place/Ritz+Cinemas/@-33.9200572,151.2421689,17.63z/data=!3m1!5s0x6b12b222eee7ee7d:0x2cf44beea19c5de3!4m6!3m5!1s0x6b12b222ef472a97:0x156e315a4bc48178!8m2!3d-33.9200741!4d151.243326!16s%2Fm%2F0_83wmc"
                target="_blank"
              >
                <img
                  className="review_cinema_poster"
                  src={require("../CommentImage/cinemaAddress.png")}
                />
                <div className="review_inline-element">
                  <img
                    className="review_address_poster"
                    src={require("../CommentImage/location.png")}
                  />
                  <div className="review_address">
                    45 St Pauls St, Randwick NSW 2031
                  </div>
                  <img
                    className="review_address_poster"
                    src={require("../CommentImage/call.png")}
                  />
                </div>
              </a>
              <div className="review_inline-element">
                <img
                  className="review_address_poster"
                  src={require("../CommentImage/call.png")}
                />
                <div className="review_address">(02) 83 24 25 00</div>
              </div>
              <h6>improve this list?</h6>
            </div>
          </div>
        </div>

        <div className="review_container-write-comments">
          <h5 style={{ fontWeight: "100" }}>
            Write a review and unleash your creativity too - join the
            conversation today!
          </h5>
        </div>

        <div className="review_inline-element">
          <div className="review_container-comments">
            <div className="review_inline-element">
              <h3
                style={{
                  marginTop: "10px",
                }}
              >
                Reviews
              </h3>
              <div className="review_review-number">({comments.length})</div>
              <button className="review_button-write">
                <a
                  href={`http://localhost:3000/comment/add/${mid}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{ marginTop: "-25px" }}>Write a review</div>
                </a>
              </button>
            </div>
            <hr
              style={{
                borderColor: "#e0e0e0",
                borderWidth: "1px",
                width: "95%",
                marginTop: "10px",
                marginBottom: "10px",
                opacity: "0.3",
              }}
            />
            <div>
              {Array.isArray(visibleComments) &&
                visibleComments.map((comment) => (
                  <div key={comment.id}>
                    <div className="review_inline-element">
                      <div style={{ width: "30%", marginLeft: "50px" }}>
                        <Link to={`/profile/${comment.Uid}`}>
                          <img
                            className="review_user_poster"
                            src={`http://lbosau.exlb.org:9900/Image/User/${comment.Uid}`}
                          />
                        </Link>
                      </div>
                      <div style={{ marginLeft: "-55px" }}>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          {[...Array(comment.Score)].map((_, index) => (
                            <img
                              key={index}
                              className="review_comment-poster"
                              src={require("../CommentImage/circle.png")}
                            />
                          ))}
                        </div>
                        <div className="review_comment">{comment.Comment}</div>
                        <div className="review_inline-element">
                          <h6>helpful?</h6>
                          <LikeComment Cid={comment.Cid} />
                          {/* <img
                            className="good-poster"
                            src={require("../CommentImage/emptyGood.png")}
                            onClick={() => {
                              const params = new URLSearchParams();
                              params.append("Cid", comment.Cid);
                              params.append("token", token);
                              console.log(params.toString());
                              fetch(
                                `http://lbosau.exlb.org:9900/Comment/Like`,
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
                                    alert("Comment likes successfully");
                                  } else {
                                    throw new Error("Failed to likes comment");
                                  }
                                })
                                .catch((error) => {
                                  console.log(error);
                                });
                            }}
                          /> */}
                        </div>
                      </div>
                    </div>
                    <hr
                      style={{
                        borderColor: "#e0e0e0",
                        borderWidth: "1px",
                        width: "95%",
                        marginTop: "-15px",
                        marginBottom: "10px",
                        opacity: "0.3",
                      }}
                    />
                  </div>
                ))}
              {isLoading && <h5>Loading comments...</h5>}
              {!isLoading && scrollIndex >= comments.length && (
                <h5>No more comments to load</h5>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListComment;

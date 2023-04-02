import "../review/comment.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/movieDetail.css";
import { Link } from "react-router-dom";

function ListComment() {
  const { mid, token } = useParams();
  console.log("mid:", mid);
  const [comments, setComment] = useState([]);

  useEffect(() => {
    setComment([]);

    axios
      .get(`http://lbosau.exlb.org:9900/Comment/Movie?Mid=${mid}&token=NULL`)
      .then((response) => {
        console.log(response);
        console.log(response.data.commentinfo);
        console.log(response.data.score);
        setComment(response.data.commentinfo);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/404";
      });
  }, [mid]);
  const movieName = <GetMovieName id={mid} />;
  const movieImage = <GetMovieImage id={mid} />;
  const movieType = <GetMovieType id={mid} />;

  return (
    <div class="container">
      <div class="left-column">
        <ul>
          <li>
            <a href="#">Detail</a>
          </li>
          <li>
            <a href="#">Description</a>
          </li>
          <li>
            <a href="#">Director</a>
          </li>
          <li>
            <a href="#">Cast</a>
          </li>
          <li>
            <a href="#">Review</a>
          </li>
          <li>
            <a href="#">Recommandation</a>
          </li>
        </ul>
      </div>

      <div class="right-column">
        <div style={{ justifyContent: "space-between", display: "flex" }}>
          <h4>{movieName}</h4>
          <h5>{movieType}</h5>
          <a href="http://google.com">
            <img
              class="buttonProfile"
              src={require("../images/profile.png")}
            ></img>
          </a>
          <a href="http://google.com">
            <img
              class="buttonMessage"
              src={require("../images/message.png")}
            ></img>
          </a>
          <a href="http://google.com">
            <img
              class="buttonMessage"
              src={require("../images/notice.png")}
            ></img>
          </a>
        </div>

        <div style={{ display: "flex" }}>
          <div>{movieImage}</div>
          <h3>User Review</h3>
          <a href={`http://localhost:3000/comment/add/${mid}`}>
            <img class="buttonArrow" src={require("../images/arrow.png")}></img>
            <button class="buttonWriteComment">Write a review here</button>
          </a>
        </div>

        <ul id="comments">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="gray-box">
                <div className="userScore">
                  <div
                    style={{
                      display: "flex",
                      margin: "10px 0",
                      backgroundColor: "#f6f6f6",
                    }}
                  >
                    <div class="userFont">
                      <Link to={`/wishlist/${comment.Uid}`}>
                        User {comment.Uid} gives {comment.Score} marks!!
                      </Link>
                    </div>
                    {Array.from({ length: comment.Score }, (_, i) => (
                      <img
                        class="starImage"
                        key={i}
                        src={require("../images/star.png")}
                      />
                    ))}
                  </div>
                </div>
                <div class="white-box" style={{ borderRadius: "20px" }}>
                  <div class="commentFont">{comment.Comment}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ListComment;

const GetMovieName = (props) => {
  const [movie, setMovie] = useState([]);
  const movieId = props.id;
  useEffect(() => {
    setMovie([]);

    axios
      .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${movieId}`)
      .then((response) => {
        console.log(response);
        console.log(response.data.movieinfo.MovieName);
        setMovie(response.data.movieinfo.MovieName);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/404";
      });
  }, [movieId]);

  return <div>{movie}</div>;
};

const GetMovieImage = (props) => {
  const [movie, setMovie] = useState([]);
  const movieId = props.id;
  useEffect(() => {
    setMovie([]);

    axios
      .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${movieId}`)
      .then((response) => {
        console.log(response);
        console.log(response.data.movieinfo.MovieName);
        setMovie(response.data.movieinfo.MovieName);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/404";
      });
  }, [movieId]);

  return (
    <img
      class="movieImage"
      src={`http://lbosau.exlb.org:9900/image/${movie}/${movie}`}
    ></img>
  );
};

const GetMovieType = (props) => {
  const [movie, setMovie] = useState([]);
  const movieId = props.id;
  useEffect(() => {
    setMovie([]);

    axios
      .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${movieId}`)
      .then((response) => {
        console.log(response);
        console.log(response.data.movieinfo.Type);
        setMovie(response.data.movieinfo.Type);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/404";
      });
  }, [movieId]);

  return <div>{movie}</div>;
};

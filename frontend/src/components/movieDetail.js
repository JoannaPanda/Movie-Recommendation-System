import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/movieDetail.css";
import { Link } from "react-router-dom";

function MovieDetail() {
  const { mid } = useParams();
  console.log("mid:", mid);
  const [movie, setMovie] = useState([]);
  // const [recommendation, setRecommendation] = useState([]);
  useEffect(() => {
    setMovie([]);
    // setRecommendation([]);
    axios
      .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}`)
      .then((response) => {
        console.log(response);
        console.log(response.data.movieinfo);
        setMovie(response.data.movieinfo);
        // setRecommendation(response.data.recommendation);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/404";
      });
  }, [mid]);
  console.log(movie.Performers);
  const cast = movie.Performers
    ? movie.Performers.map((actor) => (
        <li style={{ marginLeft: "10px" }}>{actor} </li>
      ))
    : null;
  console.log(cast);
  return (
    <div
      className="movie-detail-page"
      style={{
        backgroundColor: "white",
        backgroundSize: `cover`,
        width: "120%",
        height: "auto",
      }}
    >
      <div className="movie-header" style={{ marginLeft: 13 }}>
        <div className="movie-name-date">
          <h1 className="movie-title">{movie.MovieName}</h1>
          <h2 className="summary-heading">{movie.Type}</h2>
          <p className="movie-release-date">
            Released on:{" "}
            {new Date(movie.PublishDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div
          className="movie-rating"
          style={{ marginLeft: 300, width: 30, height: 30 }}
        >
          {Number(movie.Score).toFixed(2)}/5
          <img
            src={require("../images/star.png")}
            alt="star"
            style={{ marginLeft: 10, width: 30, height: 30 }}
          />
        </div>
      </div>
      <div className="movie-description">
        <div className="movie-poster">
          <img src={require("../images/titanic.jpg")} alt={movie.MovieName} />
        </div>
        <div className="movie-summary" style={{ marginLeft: 20 }}>
          <h2 className="summary-heading">Summary</h2>
          <p className="summary-text">{movie.Info}</p>
        </div>
      </div>
      <div className="movie-cast">
        <h2 className="cast-heading">Director</h2>
        <ul className="cast-list">{movie.Director}</ul>
      </div>
      <div className="movie-cast">
        <h2 className="cast-heading">Cast</h2>
        <ul className="cast-list">
          {cast}
          {/* {movie.Performers.map((actor) => (
            <li className="cast-item">{actor} </li>
            // <li key={actor.id} className="cast-item">
            //   {actor.name} as {actor.character}
            // </li>
          ))} */}
        </ul>
      </div>
      {/* <Link to="/moviereview/1">
          
      </Link> */}
      {/* <div className="movie-reviews">
        <h2 className="reviews-heading">Reviews</h2>
        <ul className="reviews-list">
          {movie.reviews.map((review) => (
            <li key={review.id} className="review-item">
              <h3 className="review-title">{review.title}</h3>
              <p className="review-text">{review.text}</p>
              <p className="review-author">By {review.author}</p>
            </li>
          ))}
        </ul>
      </div> */}
      <div className="movie-cast">
        <h2 className="cast-heading">Guess you like:</h2>

        <RecoMovies id={mid} />
      </div>
    </div>
  );
}

export default MovieDetail;

const RecoMovies = (props) => {
  const [movies, setMovies] = useState([]);
  const recoid = props.id;
  useEffect(() => {
    setMovies([]);

    axios
      .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${recoid}`)
      .then((response) => {
        console.log(response);
        console.log(response.data.recommendation);
        setMovies(response.data.recommendation);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/404";
      });
  }, [recoid]);
  console.log(movies.Mid);
  const handleClick = () => {
    console.log("Clickable area clicked!");
  };

  return (
    <div
      style={{ marginTop: "20px", color: "whitesmoke" }}
      onClick={handleClick()}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.MovieName}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px",
              width: "250px",
              height: "400px",
              backgroundColor: "gray",
              borderRadius: "10px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            }}
          >
            <Link to={`/movieinfo/${movie.Mid}`}>
              <img
                src={require("../images/titanic.jpg")}
                alt={movie.MovieName}
                style={{ width: "100%", height: "70%", objectFit: "cover" }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "30%",
                  padding: "10px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {movie.MovieName}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ marginRight: "5px" }}>
                    {movie.Score.toFixed(2)}
                  </div>
                  <span style={{ color: "yellow" }}>★</span>
                </div>
                <div style={{ fontWeight: "bold" }}>
                  Released on{" "}
                  {new Date(movie.PublishDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

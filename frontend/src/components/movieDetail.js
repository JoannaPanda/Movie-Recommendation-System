import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/movieDetail.css";
import { Link } from "react-router-dom";

function MovieDetail() {
  const { mid } = useParams();
  console.log("mid:", mid);
  const [movie, setMovie] = useState([]);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  useEffect(() => {
    setMovie([]);

    axios
      .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}&token=${token}`)
      .then((response) => {
        console.log(response);
        console.log(response.data.movieinfo);
        setMovie(response.data.movieinfo);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/404";
      });
  }, [mid]);
  console.log(movie.Performers);
  const cast = movie.Performers ? (
    <MovieAttend name={movie.Performers} movietitle={movie.MovieName} />
  ) : null;
  console.log(cast);
  const handleClick = () => {
    console.log("Clickable area clicked!");
  };
  return (
    <div
      className="movie-detail-page"
      style={{
        backgroundColor: "white",
        backgroundSize: `cover`,
        width: "150%",
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
        <div onClick={handleClick()}>
          <Link to={`/review/${movie.Mid}`}>
            <div
              className="movie-rating"
              style={{ marginLeft: 300, width: 30, height: 30 }}
              onClick={handleClick()}
            >
              {Number(movie.Score).toFixed(2)}/5
              <img
                src={require("../images/star.png")}
                alt="star"
                style={{ marginLeft: 10, width: 30, height: 30 }}
              />
            </div>
          </Link>
        </div>
      </div>
      <div className="movie-description">
        <div className="movie-poster">
          <img
            src={`http://lbosau.exlb.org:9900/image/${movie.MovieName}/${movie.MovieName}`}
            alt={movie.MovieName}
          />
        </div>
        <div className="movie-summary" style={{ marginLeft: 20 }}>
          <h2 className="summary-heading">Summary</h2>
          <p className="summary-text">{movie.Info}</p>
        </div>
      </div>
      <div className="movie-cast">
        <h2 className="cast-heading">Director</h2>
        <img
          src={`http://lbosau.exlb.org:9900/image/${movie.MovieName}/${movie.Director}`}
          alt={movie.Director}
          style={{
            width: "200px",
            height: "240px",
            objectFit: "cover",
            borderRadius: "20px",
          }}
        />
        <ul className="cast-list" style={{ fontSize: 20, fontWeight: "bold" }}>
          {movie.Director}
        </ul>
      </div>
      <div className="movie-cast">
        <h2 className="cast-heading">Cast</h2>
        <ul className="cast-list">{cast}</ul>
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
      <div className="movie-cast" style={{ margin: "auto" }}>
        <h2 className="cast-heading">Guess you like:</h2>

        <RecoMovies id={mid} />
      </div>
    </div>
  );
}

export default MovieDetail;

const MovieAttend = (props) => {
  const actorNmae = props.name;
  const title = props.movietitle;
  return (
    <div style={{ marginTop: "20px", color: "whitesmoke" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {actorNmae.map((actor) => (
          <div
            key={actor}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px",
              width: "170px",
              height: "220px auto",
              backgroundColor: "gray",
              borderRadius: "10px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            }}
          >
            <img
              src={`http://lbosau.exlb.org:9900/image/${title}/${actor}`}
              alt={title}
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
                {actor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecoMovies = (props) => {
  const [movies, setMovies] = useState([]);
  const recoid = props.id;
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    setMovies([]);

    axios
      .get(
        `http://lbosau.exlb.org:9900/Movie/Info?Mid=${recoid}&token=${token}`
      )
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
              width: "200px",
              height: "350px auto",
              backgroundColor: "gray",
              borderRadius: "10px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            }}
          >
            <Link to={`/movieinfo/${movie.Mid}`}>
              <img
                src={`http://lbosau.exlb.org:9900/image/${movie.MovieName}/${movie.MovieName}`}
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
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

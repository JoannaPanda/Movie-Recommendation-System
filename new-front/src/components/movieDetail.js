import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/movieDetail.css";
import { Link } from "react-router-dom";
import RecoMovies from "./recoMovie";
import HeartButton from "./heartButton";

function MovieDetail() {
  const { mid } = useParams();
  // console.log("mid:", mid);
  const [movie, setMovie] = useState([]);
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  // console.log("token:", token);
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
  }, [mid, refresh]);

  console.log(movie.Performers);
  const cast = movie.Performers ? (
    <MovieAttend name={movie.Performers} movietitle={movie.MovieName} />
  ) : null;
  // console.log(cast);
  const handleClick = () => {
    // console.log("Clickable area clicked!");
  };

  function handleHeartButtonClick () {
    setRefresh(!refresh);
    console.log(refresh);
  }
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
          <HeartButton movieId={mid} onClick={handleHeartButtonClick}/>
          <h2 className="summary-heading">{movie.Type}</h2>
          <p className="movie-release-date">
            Released on:{" "}
            {new Date(movie.PublishDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="movie-wishlist">
            {" "}
            {movie.WishListCount} users added to wishlist
          </p>
        </div>
        <div onClick={handleClick()}>
          <Link to={`/comment/list/${movie.Mid}`}>
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

      <Link to={`/comment/list/${movie.Mid}`}>
        <button
          style={{
            backgroundColor: "transparent",
            border: "2px solid black",
            color: "black",
            padding: "12px 20px",
            fontSize: 12,
            borderRadius: 4,
            marginTop: 50,
            cursor: "pointer",
          }}
        >
          SEE COMMENTS →
        </button>
      </Link>

      <div className="movie-cast">
        <h2 className="cast-heading">Director</h2>
        <Link to={`/director/${movie.Director}`}>
          <img
            src={`http://lbosau.exlb.org:9900/image/${movie.MovieName}/${movie.Director}`}
            alt={movie.Director}
            style={{
              width: "200px",
              height: "240px",
              objectFit: "cover",
              borderRadius: "20px",
            }}
            onClick={handleClick()}
          />
        </Link>

        <ul className="cast-list" style={{ fontSize: 20, fontWeight: "bold" }}>
          {movie.Director}
        </ul>
      </div>
      <div className="movie-cast">
        <h2 className="cast-heading">Cast</h2>
        <ul className="cast-list">{cast}</ul>
      </div>

      <div className="movie-cast" style={{ margin: "auto" }}>
        <h2 className="cast-heading">Guess you like:</h2>
        <RecoMovies id={mid} director={movie.Director} />
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

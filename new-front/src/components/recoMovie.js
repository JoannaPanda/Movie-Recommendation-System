import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/movieDetail.css";
import { Link } from "react-router-dom";
import GenreBar from "./genreBar";
import DirectorBar from "./selectedDirector";

function RecoMovies(props) {
  const [movies, setMovies] = useState([]);
  const recoid = props.id;
  //   const director = props.director;
  const [token, setToken] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isDirectorSelected, setIsDirectorSelected] = useState(false);
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

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  const recommendedMovies = selectedGenre
    ? movies.filter((movie) => movie.Type === selectedGenre)
    : movies;

  const handleDirectorToggle = (isSelected) => {
    setIsDirectorSelected(isSelected);
    console.log(isDirectorSelected);
  };

  const recommendedMovies2 = isDirectorSelected
    ? recommendedMovies.filter((movie) => movie.Director === props.director)
    : recommendedMovies;

  return (
    <div>
      <DirectorBar onToggle={handleDirectorToggle} />
      <GenreBar
        genres={[
          "Comedy",
          "Action",
          "Horror",
          "Romance",
          "Adventure",
          "Scientific",
        ]}
        onSelect={handleGenreSelect}
      />
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
          {recommendedMovies2.map((movie) => (
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
    </div>
  );
}

export default RecoMovies;

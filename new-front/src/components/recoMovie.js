import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/movieDetail.css";
import { Link } from "react-router-dom";
import GenreBar from "./genreBar";
import DirectorBar from "./selectedDirector";
import MovieResults from "./results";

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
  console.log(token);
  useEffect(() => {
    setMovies([]);
    console.log(`recoused token ${token}`);
    axios
      .get(
        `http://lbosau.exlb.org:9900/Movie/Recommend?Mid=${recoid}&token=${token}`
      )
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setMovies(response.data);
      })
      .catch((error) => {
        console.log(error);
        // window.location.href = "/404";
      });
  }, [recoid]);

  const handleClick = () => {
    console.log("Clickable area clicked!");
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };
  console.log(`get reco as ${movies}`);
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
          "Sci-fi",
          "Kids & family",
        ]}
        onSelect={handleGenreSelect}
      />
      <div
        style={{ marginTop: "20px", color: "whitesmoke" }}
        onClick={handleClick()}
      >
        <MovieResults movies={recommendedMovies2} />
      </div>
    </div>
  );
}

export default RecoMovies;

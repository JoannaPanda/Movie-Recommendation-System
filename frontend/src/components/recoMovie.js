import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/movieDetail.css";
import { Link } from "react-router-dom";
import GenreBar from "./genreBar";
import DirectorBar from "./selectedDirector";
import MovieResults from "./results";
import { backendurl } from "./backendurl";

function RecoMovies(props) {
  const [movies, setMovies] = useState([]);
  // get the corresponding movie id that need the recomendation movies
  const recoid = props.id;

  const [token, setToken] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isDirectorSelected, setIsDirectorSelected] = useState(false);
  // get the token from local storage
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
    // get this given movie's correponding recommendation movie list
    // if the token is null  then the recomandation would only based on the
    // given movies, otherwise, it would also based on the users'
    // perference and history
    axios
      .get(
        `${backendurl}/Movie/Recommend?Mid=${recoid}&token=${token}`
      )
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setMovies(response.data);
      })
      .catch((error) => {
        console.log(error);
        window.location.href = "/404";
      });
  }, [recoid]);

  const handleClick = () => {
    console.log("Clickable area clicked!");
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };
  // filtering the returened movie by the selecte genre
  const recommendedMovies = selectedGenre
    ? movies.filter((movie) => movie.Type === selectedGenre)
    : movies;
  // check if the 'just like this director' button is clciked
  const handleDirectorToggle = (isSelected) => {
    setIsDirectorSelected(isSelected);
    console.log(isDirectorSelected);
  };
  // if it is clicked then further filtering the returned movie set by director
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

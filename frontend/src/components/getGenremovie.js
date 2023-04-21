import React, { useState, useEffect } from "react";
import MovieResults from "./results";
import axios from "axios";
import "../styles/search.css";
// This component would take in the genre
// This component is mainly used in the home page to
// retuern the sorted movies for each genre
function GenreMovies(props) {
  const genre = props.genre;
  const [results, setResults] = useState([]);

  useEffect(() => {
    // with each change in genre, the results list would be set
    // back to empty
    setResults([]);

    axios
      .get(
        `${backendurl}/Movie/ListOrder?orderby=Score&desc=True`
      )
      .then((response) => {
        // the result is the sorted movie lists from backend
        setResults(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [genre]);
  console.log(`results: ${results}`);

  return (
    <div>
      {/* if the genre is not the default value "xxxxxxxxxx"
      the result movies is the movie from a specific genre.
      Otherwise, the movie results is the whole movie set in the system */}
      {genre === "xxxxxxxxxxxxx" ? (
        <MovieResults movies={results} />
      ) : (
        <MovieResults
          movies={results.filter((movie) => movie.Type === genre)}
        />
      )}
    </div>
  );
}
export default GenreMovies;

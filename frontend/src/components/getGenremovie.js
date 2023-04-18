import React, { useState, useEffect } from "react";
import MovieResults from "./results";
import axios from "axios";
import "../styles/search.css";

function GenreMovies(props) {
  const genre = props.genre;
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults([]);

    axios
      .get(
        `http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=Score&desc=True`
      )
      .then((response) => {
        console.log(response.data);
        setResults(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // if (genre !== "xxxxxxxxxxxxx") {
    //   axios
    //     .get(
    //       `http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=Score&desc=True`
    //     )
    //     .then((response) => {
    //       console.log(response.data);
    //       setResults(response.data);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } else {
    //   axios
    //     .get(
    //       `http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=Score&desc=True`
    //     )
    //     .then((response) => {
    //       console.log(response.data);
    //       setResults(response.data);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }
  }, [genre]);
  console.log(`results: ${results}`);

  return (
    <div>
      {genre === "xxxxxxxxxxxxx" ? (
        <MovieResults movies={results} />
      ) : (
        <MovieResults
          movies={results.filter((movie) => movie.Type === genre)}
        />
      )}
      {console.log(genre)}
    </div>
  );
}
export default GenreMovies;

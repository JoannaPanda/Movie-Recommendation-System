import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/movieDetail.css";

import MovieResults from "./results";

import axios from "axios";

function DirectorPage() {
  const { director } = useParams();
  const [results, setResults] = useState([]);
  console.log(`director: ${director}`);

  useEffect(() => {
    setResults([]);
    if (director !== "") {
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
    } else {
      axios
        .get(
          `http://lbosau.exlb.org:9900/Movie/Search?searchtext=xxxxxxxxxxxxxxxxxxx`
        )
        .then((response) => {
          console.log(response.data);
          setResults(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const movietitle = results.map((result) => result.MovieName)[0];
  console.log(`title: ${movietitle}`);

  return (
    <div
      className="movie-detail-page"
      style={{
        backgroundColor: "white",
        backgroundSize: `cover`,
        width: "80%",
        height: "auto",
      }}
    >
      <h1>{director}</h1>
      <img
        src={`http://lbosau.exlb.org:9900/image/${movietitle}/${director}`}
        alt={director}
        style={{
          width: "200px",
          height: "240px",
          objectFit: "cover",
          borderRadius: "20px",
        }}
      />

      <h2>Movie Set</h2>

      {!results ? (
        <h1>loading...</h1>
      ) : (
        <MovieResults
          movies={results.filter((movie) => movie.Director === director)}
        />
      )}
    </div>
  );
}

export default DirectorPage;

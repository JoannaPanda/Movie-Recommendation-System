import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/movieDetail.css";
import MovieResults from "./results";
import axios from "axios";

function DirectorPage() {
  // from the link get the director name
  const { director } = useParams();
  const [results, setResults] = useState([]);
  // get the movies listed from highest-score to lowest-score
  useEffect(() => {
    setResults([]);
    // ensure the direct is not empty
    if (director !== "") {
      axios
        .get(
          `http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=Score&desc=True`
        )
        .then((response) => {
          // save the sorted movies as results
          setResults(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // if the director is an empty string,
      axios
        .get(
          `http://lbosau.exlb.org:9900/Movie/Search?searchtext=xxxxxxxxxxxxxxxxxxx`
        )
        .then((response) => {
          // the search for xxxxxxxxxxxx would return an empty list
          setResults(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  // get the movie title from the directors' movie set
  // one is enough, used to get the image of this director
  const movietitle = results
    .filter((movie) => movie.Director === director)
    .map((result) => result.MovieName)[0];
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
      {/* print the directors' name and his/her image */}
      <h1>{director}</h1>
      {console.log(`director is ${director}`)}
      {console.log(`from movie ${movietitle}`)}
      <img
        // image obtained by using the movie title and director
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
      {/* show all the movies return from the backend under this director's name */}
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

// import React, { useState, useEffect} from "react";
// import axios from "axios";
// import "../styles/movieDetail.css";
// import { Link } from "react-router-dom";

import React, { useState, useEffect } from "react";
import MovieResults from "./results";
import axios from "axios";
import "../styles/search.css";

function GenreMovies(props) {
  const genre = props.genre;
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults([]);
    if (genre !== "xxxxxxxxxxxxx") {
      axios
        .get(`http://lbosau.exlb.org:9900/Movie/Search?searchtext=${genre}`)
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
  }, [genre]);
  console.log(`results: ${results}`);

  return (
    <div>
      {!results ? <h1>loading...</h1> : <MovieResults movies={results} />}
    </div>
  );
}
export default GenreMovies;

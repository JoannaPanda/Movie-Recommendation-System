import React, { useState, useEffect } from "react";
import MovieResults from "./results";
import axios from "axios";

function SearchPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  // const getMovies = () => {
  //   axios
  //     .get(`http://lbosau.exlb.org:9900/Movie/Search?searchtext=${search}`)
  //     .then((response) => {
  //       console.log(response.data.movieinfo);
  //       setResults(response.data.movieinfo);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    setResults([]);
    if (search !== "") {
      axios
        .get(`http://lbosau.exlb.org:9900/Movie/Search?searchtext=${search}`)
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
  }, [search]);

  return (
    <div>
      {/* <form
        onSubmit={handleSearchSubmit}
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 100,
        }}
      > */}
      <input
        type="search"
        value={search}
        onChange={handleChange}
        style={{
          backgroundColor: "#877878",
          border: "none",
          borderRadius: 30,
          color: "#0e153a",
          cursor: "pointer",
          fontSize: 30,
          fontWeight: "bold",
          padding: "20px 100px",
          marginTop: 100,
        }}
      />
      {!results ? <h1>loading...</h1> : <MovieResults movies={results} />}
    </div>
  );
}
export default SearchPage;

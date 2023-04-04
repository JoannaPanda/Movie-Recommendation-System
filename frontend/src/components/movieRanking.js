import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import GenreBar from "./genreBar";

function MovieRankings() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("xxxxxxxxxxxxx");
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // intentionally disable API before database completes
        const res = await fetch(
          "http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=Score&desc=True"
        );
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.log("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);
  console.log(movies);
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  const usedGenre = selectedGenre === null ? "xxxxxxxxxxxxx" : selectedGenre;
  const results = movies.filter((movie) => movie.Type === selectedGenre);
  const usedResults = usedGenre === "xxxxxxxxxxxxx" ? movies : results;
  return (
    <div
      style={{
        marginTop: "20px",
        color: "whitesmoke",
        backgroundColor: "grey",
        backgroundSize: "cover",
        marginLeft: "10%",
        marginRight: "10%",
      }}
    >
      <input
        type="text"
        placeholder="TOP 10 MOVIES"
        style={{
          fontSize: "30px",
          marginBottom: "22px",
          width: "100%",
          padding: "5px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      />
      <h1 style={{ color: "black", fontSize: 40 }}>Movie Rankings</h1>
      <GenreBar
        genres={[
          "Comedy",
          "Action",
          "Horror",
          "Romance",
          "Sci-fi",
          "Kids & family",
          "Mystery & thriller",
          "Crime",
        ]}
        onSelect={handleGenreSelect}
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "100px",
          borderRadius: "10px",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {usedResults.map((movie) => (
          <div
            key={movie.MovieName}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px 0",
              width: "100%",
              fontSize: "17px",
            }}
          >
            <Link to={`/movieinfo/${movie.Mid}`}>
              <div
                style={{
                  marginRight: "10px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                {movie.MovieName}
              </div>
            </Link>
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              return (
                <span
                  key={i}
                  style={{
                    color: ratingValue <= movie.Score ? "yellow" : "gray",
                    marginRight: "5px",
                  }}
                >
                  ★
                </span>
              );
            })}
            <div style={{ marginLeft: "5px" }}>{movie.Score.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieRankings;

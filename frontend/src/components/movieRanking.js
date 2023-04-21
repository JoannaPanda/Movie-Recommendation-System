import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GenreBar from "./genreBar";
import { backendurl } from "./backendurl";

// this component is used from homepage
function MovieRankings() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("xxxxxxxxxxxxx");
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // get all the sorted movie from the backend
        const res = await fetch(
          `${backendurl}/Movie/ListOrder?orderby=Score&desc=True`
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
  // get the selected genre
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };
  // filter the returned movies by genre
  const usedGenre = selectedGenre === null ? "xxxxxxxxxxxxx" : selectedGenre;
  const results = movies.filter((movie) => movie.Type === selectedGenre);
  const usedResults = usedGenre === "xxxxxxxxxxxxx" ? movies : results;
  return (
    <div
      style={{
        marginTop: "20px",
        color: "whitesmoke",
        backgroundColor: "#400b0a",
        backgroundSize: "cover",
        marginLeft: "7%",
        marginRight: "7%",
        textAlign: "center",
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
      <h1 style={{ color: "white", fontSize: 40 }}>Movie Rankings</h1>
      {/* put a gnerebar can be used to select genre for filtering */}
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
        {/* print all the selected movies with ratings */}
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
                  color: "white",
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

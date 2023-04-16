import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import GenreBar from "./genreBar";

function NewMoviePage() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("xxxxxxxxxxxxx");
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // intentionally disable API before database completes
        const res = await fetch(
          "http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=PublishDate&desc=True"
        );
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.log("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

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
        placeholder="NEW & UPCOMING MOVIES"
        style={{
          fontSize: "30px",
          marginBottom: "22px",
          width: "100%",
          padding: "5px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      />
      <h1 style={{ color: "black", fontSize: 40, fontWeight: "bold" }}>
        NEW and UPCOMING MOVIES
      </h1>
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
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {usedResults.map((movie) => (
          <div
            key={movie.MovieName}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px",
              width: "250px",
              height: "400px",
              backgroundColor: "gray",
              borderRadius: "10px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            }}
          >
            <img
              // src={require("../images/default-movie.png")}
              src={`http://lbosau.exlb.org:9900/image/${movie.MovieName}/${movie.MovieName}`}
              alt={movie.MovieName}
              style={{ width: "100%", height: "70%", objectFit: "cover" }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "30%",
                padding: "10px",
              }}
            >
              <Link to={`/movieinfo/${movie.Mid}`}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {movie.MovieName}
                </div>
              </Link>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div style={{ marginRight: "5px" }}>
                  {movie.Score.toFixed(2)}
                </div>
                <span style={{ color: "yellow" }}>★</span>
              </div>
              <div style={{ fontWeight: "bold" }}>
                Released on{" "}
                {new Date(movie.PublishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewMoviePage;

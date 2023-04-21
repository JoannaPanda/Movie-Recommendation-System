import React, { useEffect, useState } from "react";
import MovieResults from "./results";
import { Link } from "react-router-dom";
import GenreBar from "./genreBar";

function NewMoviePage() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("xxxxxxxxxxxxx");
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // get all the sorted movie from backend by publishdate
        const res = await fetch(
          "${backendurl}/Movie/ListOrder?orderby=PublishDate&desc=True"
        );
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.log("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);
  // get the selected genre
  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };
  // filter the return movie lis by genre
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
      <h1 style={{ color: "white", fontSize: 40, fontWeight: "bold" }}>
        NEW and UPCOMING MOVIES
      </h1>
      {/* a genrebar used by user to filter the returned movies */}
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
      <MovieResults movies={usedResults} />
    </div>
  );
}

export default NewMoviePage;

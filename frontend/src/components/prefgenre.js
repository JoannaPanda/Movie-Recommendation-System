import React, { useState } from "react";
import "../styles/Pref.css";

const genreData = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Drama" },
  { id: 4, name: "Horror" },
  { id: 5, name: "Romance" },
  { id: 6, name: "Sci-Fi" },
  { id: 7, name: "Thriller" },
  { id: 8, name: "Western" },
];

const SetPreferenceGenre = () => {
  const [genrePreferences, setGenrePreferences] = useState([]);

  const handleGenreButtonClick = (genreId) => {
    if (genrePreferences.includes(genreId)) {
      setGenrePreferences((prevState) =>
        prevState.filter((id) => id !== genreId)
      );
    } else {
      setGenrePreferences((prevState) => [...prevState, genreId]);
    }
  };

  const handleNextButtonClick = () => {
    // navigate to the next page
  };

  return (
    <div className="movie-preference-container">
      <h1 className="movie-preference-title">Select up to 8 genres</h1>
      <div className="movie-preference-genres">
        {genreData.map((genre) => (
          <button
            key={genre.id}
            className={`movie-preference-genre-button ${genrePreferences.includes(
              genre.id
            ) && "selected"}`}
            onClick={() => handleGenreButtonClick(genre.id)}
            disabled={
              genrePreferences.length === 8 &&
              !genrePreferences.includes(genre.id)
            }
          >
            <img
              src={require(`../images/${genre.name.toLowerCase()}.png`)}
              alt={`${genre.name} icon`}
            />
            <span>{genre.name}</span>
          </button>
        ))}
      </div>
      <div className="movie-preference-next">
        <button
          className="movie-preference-next-button"
          onClick={handleNextButtonClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SetPreferenceGenre;

import React, { useState } from "react";

const GenreBar = ({ genres, onSelect }) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleSelect = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
      onSelect(null);
    } else {
      setSelectedGenre(genre);
      onSelect(genre);
    }
  };

  return (
    <nav>
      <ul
        className="nav nav-tabs"
        style={{
          display: "flex",
          flexDirection: "row",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        {genres.map((genre) => (
          <li key={genre} className="nav-item">
            <button
              type="button"
              className={`nav-link ${selectedGenre === genre ? "active" : ""}`}
              onClick={() => handleSelect(genre)}
              style={{
                fontSize: "16px",
                padding: "10px 20px",
                backgroundColor: selectedGenre === genre ? "blue" : "grey",
                color: selectedGenre === genre ? "white" : "black",
              }}
            >
              {genre}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default GenreBar;

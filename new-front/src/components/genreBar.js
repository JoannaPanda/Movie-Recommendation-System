import React, { useState } from "react";
// this component is used in searching page, homepage, and sorting page, and recommandation
// system which would take in a list of genres and return which one is selected
const GenreBar = ({ genres, onSelect }) => {
  // the selected genre would be used to remember which genre is selected by user
  const [selectedGenre, setSelectedGenre] = useState(null);

  // return the genre throgh onSelect()
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
        {/* for each genre in the given genre list
        map it to be a button*/}
        {genres.map((genre) => (
          <li key={genre} className="nav-item">
            <button
              type="button"
              className={`nav-link ${selectedGenre === genre ? "active" : ""}`}
              onClick={() => handleSelect(genre)}
              style={{
                fontSize: "16px",
                padding: "10px 20px",
                // the  background color would be blue if it had been selected,
                // otherwise it would be grey
                backgroundColor: selectedGenre === genre ? "blue" : "#5A5A5A",
                color: "white",
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

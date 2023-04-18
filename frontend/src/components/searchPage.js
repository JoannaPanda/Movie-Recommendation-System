import React, { useState, useEffect } from "react";
import MovieResults from "./results";
import axios from "axios";
import "../styles/search.css";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

function SearchPage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("xxxxxxxxxxxxx");

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

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
  const handleGenreSelect = (selectedGenre) => {
    setSelectedGenre(selectedGenre);
  };

  const handleClear = () => {
    setSearch("");
    setResults([]);
    setSelectedGenre(null);
    handleGenreSelect(selectedGenre);
  };

  const usedGenre = selectedGenre === null ? "xxxxxxxxxxxxx" : selectedGenre;
  const returnedResults = results.filter(
    (movie) => movie.Type === selectedGenre
  );
  const usedResults = usedGenre === "xxxxxxxxxxxxx" ? results : returnedResults;
  return (
    <div
      className="search"
      style={{
        backgroundColor: "#400b0a",
        backgroundSize: `cover`,
        width: "auto",
        height: "1000px",
        padding: "95px",
      }}
    >
      <div className="logo">
        <a href="/spin">
          <img
            src={require("../images/spinwheel.png")}
            alt="Spin"
            style={{ height: 50, width: 50, marginLeft: -700 }}
          />
        </a>
      </div>
      <div className="searchInputs">
        <input
          type="text"
          placeholder="Enter Movie Title Here..."
          value={search}
          onChange={handleChange}
        />
        <div className="searchIcon">
          {/* leart from https://www.google.com/search?q=how+to+modified+the+cross
        +in+search+type+in+reactjs&oq=how+to+modified+the+cross+in+search+type+in
        +reactjs&aqs=chrome..69i57j33i10i160.27942j0j7&sourceid=chrome&ie=UTF-8#
        fpstate=ive&vld=cid:a32f139b,vid:x7niho285qs */}
          {search === "" ? (
            <SearchIcon style={{ height: 70, width: 70 }} />
          ) : (
            <ClearIcon
              id="clearBtn"
              onClick={handleClear}
              style={{ height: 70, width: 70 }}
            />
          )}
        </div>
      </div>
      <h1></h1>

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
          "History",
          "Western",
          "Fantasy",
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
      {!results ? <h1>loading...</h1> : <MovieResults movies={usedResults} />}
    </div>
  );
}
export default SearchPage;

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
          flexWrap: "wrap",
          justifyContent: "center",
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
                padding: "9px 16px",
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

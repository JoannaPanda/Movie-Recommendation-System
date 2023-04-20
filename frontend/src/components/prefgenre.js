import React, { useState } from "react";
import "../styles/Pref.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// the genreData used later
const genreData = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Drama" },
  { id: 4, name: "Horror" },
  { id: 5, name: "Romance" },
  { id: 6, name: "Sci-Fi" },
  { id: 7, name: "Thriller" },
  { id: 8, name: "Western" },
  { id: 9, name: "Sports" },
];

const SetPreferenceGenre = () => {
  const [genrePreferences, setGenrePreferences] = useState([]);
  // if the perference clicked add the the list
  const handleGenreButtonClick = (genreId) => {
    if (genrePreferences.includes(genreId)) {
      setGenrePreferences((prevState) =>
        prevState.filter((id) => id !== genreId)
      );
    } else {
      setGenrePreferences((prevState) => [...prevState, genreId]);
    }
  };
  // if the next button clicked
  const handleNextButtonClick = () => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    params.append("token", token);
    console.log(token);

    const selectedGenres = genrePreferences.map(
      (id) => genreData.find((genre) => genre.id === id).name
    );
    const genreString = selectedGenres.join(", ");
    console.log(genreString);

    params.append("tag", genreString);

    fetch("http://lbosau.exlb.org:9900/User/Recommend/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => {
        // navigate to the next page
        // redirect to preference tag setting
        window.location.href = "/setpreftag";
      })
      .catch((error) => {
        toast.error("Perference not added!", {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };
  // print all the genre perference and if the next page clicked
  // would be redirected to perference tag page
  return (
    <div className="movie-preference-container" style={{ textAlign: "center" }}>
      <h1 className="movie-preference-title">What's your movie preference?</h1>
      <h1 className="movie-preference-subtitle">Select up to 8 genres</h1>
      <div className="movie-preference-genres">
        {genreData.map((genre) => (
          <button
            style={{ width: "350px", height: "170px" }}
            key={genre.id}
            className={`movie-preference-genre-button ${
              genrePreferences.includes(genre.id) && "selected"
            }`}
            onClick={() => handleGenreButtonClick(genre.id)}
            disabled={
              genrePreferences.length === 9 &&
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
      <ToastContainer />
    </div>
  );
};

export default SetPreferenceGenre;

import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { backendurl } from "./backendurl";

const DoughnutWinwheel = () => {
  const [movies, setMovies] = useState([]);
  const [flag, setFlag] = useState(false);
  const [randomMovie, setRandomMovie] = useState("");
  const [randomMovieID, setRandomMovieID] = useState("");
  const confetiRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // get all the movie from the database
        const res = await fetch(
          `${backendurl}/Movie/ListOrder?orderby=Score&desc=True`
        );
        const data = await res.json();
        if (data !== null) {
          setMovies(data);
          console.log(data.map((movie) => ({ text: movie.MovieName })));
        }
      } catch (error) {
        console.log("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);
  // by clicking the button there would be a random movie generated
  const handleClick = () => {
    setFlag(true);
    const randomIndex = Math.floor(Math.random() * movies.length);
    setRandomMovie(movies[randomIndex].MovieName);
    setRandomMovieID(movies[randomIndex].Mid);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        marginTop: "400px",
        textAlign: "center",
      }}
    >
      {/* improve visulization */}
      <div className="confetti" ref={confetiRef}>
        <Confetti run={flag} numberOfPieces={150} width={1200} height={1000} />
      </div>
      {/* this is the button used to generate the movies */}
      <button onClick={handleClick}>Click for Confetti and a Movie!</button>
      {randomMovie && (
        <Link to={`/movieinfo/${randomMovieID}`}>
          {" "}
          <h1>{randomMovie}</h1>{" "}
        </Link>
      )}
    </div>
  );
};

export default DoughnutWinwheel;

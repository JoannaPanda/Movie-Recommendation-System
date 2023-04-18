import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";

const DoughnutWinwheel = () => {
  const [movies, setMovies] = useState([]);
  const [flag, setFlag] = useState(false);
  const [randomMovie, setRandomMovie] = useState("");
  const [randomMovieID, setRandomMovieID] = useState("");
  const confetiRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // intentionally disable API before database completes
        const res = await fetch(
          "http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=Score&limit=10&desc=True"
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
      <div className="confetti" ref={confetiRef}>
        <Confetti run={flag} numberOfPieces={150} width={1200} height={1000} />
      </div>
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

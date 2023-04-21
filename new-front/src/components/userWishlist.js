import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/wishlist.css";
import HeartButton from "./heartButton";

const MovieWishlist = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10);
  const [userinfo, setUserinfo] = useState(null);
  const [token, setToken] = useState(null);
  const [filterOption, setFilterOption] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserinfo) {
      setUserinfo(storedUserinfo);
    }
  }, []);

  useEffect(() => {
    const fetchUserinfo = async () => {
      try {
        const response = await fetch(
          `http://lbosau.exlb.org:9900/User/Info?Uid=${userinfo.Uid}`
        );
        const data = await response.json();
        setUserinfo(data);
      } catch (error) {
        console.error("Error fetching user info: ", error);
      }
    };
    if (userinfo) {
      fetchUserinfo();
    }
  }, [userinfo]);

  useEffect(() => {
    if (userinfo) {
      const mids = Object.values(userinfo.WishList);
      const requests = mids.map((mid) =>
        axios.get(
          `http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}&token=${token}`
        )
      );
      Promise.all(requests)
        .then((responses) => {
          // default order is the order of adding to wishlist
          let movies = responses.map((response) => response.data.movieinfo);
          if (filterOption === "releaseDate") {
            // filter for newest to oldest release date
            movies = movies.sort(
              (a, b) => new Date(b.PublishDate) - new Date(a.PublishDate)
            );
          } else if (filterOption === "score") {
            movies = movies.sort((a, b) => b.Score - a.Score);
          } else if (filterOption === "title") {
            movies = movies.sort((a, b) =>
              a.MovieName.localeCompare(b.MovieName)
            );
          }
          setMovies(movies);
        })
        .catch((error) => {
          console.log(error);
          window.location.href = "/404";
        });
    }
  }, [userinfo, token, filterOption]);

  // Logic for displaying movies
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  return (
    <div
      className="movie-wishlist-container"
      style={{
        marginTop: "100px",
      }}
    >
      <div className="filter-option">
        <label htmlFor="filter-select">Filter by:</label>
        <select id="filter-select" onChange={handleFilterChange}>
          <option value="">Select an option</option>
          <option value="releaseDate">Release Date</option>
          <option value="score">Score</option>
          <option value="title">Title</option>
        </select>
      </div>
      <h2
        style={{
          color: "black",
        }}
      >
        My Wishlist
      </h2>
      {currentMovies.map((movie, index) => (
        <div key={index} className="movie-wishlist-card">
          <img
            style={{
              marginRight: "10px",
            }}
            src={`http://lbosau.exlb.org:9900/image/${movie.MovieName}/${movie.MovieName}`}
            alt={movie.MovieName}
          />
          <div className="movie-wishlist-details">
            <Link to={`/movieinfo/${movie.Mid}`}>
              <h3 className="movie-wishlist-title">{movie.MovieName}</h3>
            </Link>
            <HeartButton movieId={movie.Mid} />
            <p className="movie-wishlist-date">
              {/* fix user date added later */}
              Released on:{" "}
              {new Date(movie.PublishDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
      <Pagination
        moviesPerPage={moviesPerPage}
        totalMovies={movies.length}
        paginate={paginate}
      />
    </div>
  );
};

const Pagination = ({ moviesPerPage, totalMovies, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MovieWishlist;

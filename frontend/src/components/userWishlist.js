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
          const movies = responses.map((response) => response.data.movieinfo);
          setMovies(movies);
        })
        .catch((error) => {
          console.log(error);
          window.location.href = "/404";
        });
    }
  }, [userinfo, token]);

  // Logic for displaying movies
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div
      className="movie-wishlist-container"
      style={{
        marginTop: "100px",
      }}
    >
      <h2
        style={{
          color: "whitesmoke",
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
              Added to Wishlist on date added
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

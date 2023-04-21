import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import GenreBar from "./genreBar";
import axios from "axios";
import GenreMovies from "./getGenremovie";
import MovieResults from "./results";
import "../styles/multiple.css";
// This is the home page component that have multiple other component

// this fucntion is used to present the top ten movies
const TopTenMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // get the movie from the backend with limit = 10
        // top ten movies would be returned
        const res = await fetch(
          "${backendurl}/Movie/ListOrder?orderby=Score&limit=10&desc=True"
        );
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.log("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div style={{ marginTop: "20px", color: "whitesmoke" }}>
      <input
        type="text"
        placeholder="TOP 10 MOVIES"
        style={{
          fontSize: "30px",
          marginBottom: "22px",
          width: "100%",
          padding: "5px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* for each movie in the returned movie set, 
        the movie tile and conresponding ratings would be showed */}
        {movies.map((movie) => (
          <div
            key={movie.MovieName}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px 0",
              width: "100%",
              fontSize: "17px",
              color: "white",
            }}
          >
            <Link to={`/movieinfo/${movie.Mid}`}>
              <div
                style={{
                  marginRight: "10px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {movie.MovieName}
              </div>
            </Link>
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              return (
                <span
                  key={i}
                  style={{
                    color: ratingValue <= movie.Score ? "yellow" : "gray",
                    marginRight: "5px",
                  }}
                >
                  ★
                </span>
              );
            })}
            <div style={{ marginLeft: "5px" }}>{movie.Score.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// the classic movie posters are from museum outlets website

const movies = [
  {
    MovieName: "Nightmare Alley",
    Mid: "65",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/539dffebe4b080549e5a5df5/1410310397860-B08JBSY4GLQ99U14SHBB/mp-36-nightmare-alley-film-noir-classic-movie-poster.jpg?format=1000w",
  },
  {
    MovieName: "The Brides of Dracula",
    Mid: "66",
    imageUrl:
      "http://static1.squarespace.com/static/539dffebe4b080549e5a5df5/53ac6176e4b0c4e738760920/57e4622415d5db083264a81f/1635979532345/?format=1500w",
  },
  {
    MovieName: "Breakfast at Tiffany",
    Mid: "67",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/539dffebe4b080549e5a5df5/1462396269407-D3URV1GNKZY8J31DUMC4/MP-63+Breakfast+at+Tiffany%27s++Vintage+Movie+Posters.jpg?format=1500w",
  },
  {
    MovieName: "The Big Sleep",
    Mid: "68",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/539dffebe4b080549e5a5df5/1492894877307-93AKZB22IF82BIDQ3048/MP-260-the-big-sleep-classic-vintage-movie-poster.jpeg?format=1500w",
  },
  {
    MovieName: "Wizard of Oz ",
    Mid: "69",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/539dffebe4b080549e5a5df5/1556117276431-4EYYJM5WNYSKL0AQHNZ3/Wizard-of-Oz-classic-movie-poster-museum-outlets.jpg?format=1500w",
  },
];

// the function would be used to presented the newMovies
const NewMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // fetch the new movies set from the backend database
        const res = await fetch(
          "${backendurl}/Movie/ListOrder?orderby=PublishDate&limit=10&desc=True"
        );
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.log("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div
      style={{
        marginTop: "20px",
        color: "whitesmoke",
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
      {/* return the new movie list as movie boxes */}
      <MovieResults movies={movies} />
    </div>
  );
};

function Homepage() {
  const [selectedGenre, setSelectedGenre] = useState("xxxxxxxxxxxxx");
  const settings = {
    dots: false,
    infinite: true,
    speed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    centerMode: true,
    centerPadding: "0",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20%",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "10%",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "5%",
        },
      },
    ],
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };
  // if there is genre selected from the genre bar, the usedGenre would be set
  const usedGenre = selectedGenre === null ? "xxxxxxxxxxxxx" : selectedGenre;

  return (
    <div className="multiple">
      <input
        type="text"
        placeholder="MEET THE CLASSICS"
        style={{
          marginTop: "87px",
          color: "whitesmoke",
          fontSize: "30px",
          marginBottom: "20px",
          width: "100%",
          padding: "5px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      />
      {/* the slider compoent would be used to display the classic movie posters */}
      <Slider {...settings} className="posterSlider">
        {movies.map((movie) => (
          <Link to={`/movieinfo/${movie.Mid}`}>
            <div key={movie.MovieName}>
              <img
                src={movie.imageUrl}
                alt={movie.MovieName}
                style={{ width: "100%", height: "600px" }}
              />
            </div>
          </Link>
        ))}
      </Slider>
      {/* use the top ten movies */}
      <TopTenMovies />
      {/* this is a a button used to redirect to the movie ranking pagr */}
      <Link to={`/movierankings`}>
        <button
          style={{
            backgroundColor: "transparent",
            border: "2px solid black",
            color: "white",
            borderColor: "white",
            padding: "12px 20px",
            fontSize: 12,
            borderRadius: 4,
            marginTop: 50,
            cursor: "pointer",
          }}
        >
          SEE ALL →
        </button>
      </Link>
      {/* new movie component used */}
      <NewMovies />
      {/* this is a button that used to redirect to the new movie page */}
      <Link to={`/newmoviepage`}>
        <button
          style={{
            backgroundColor: "transparent",
            border: "2px solid black",
            color: "white",
            borderColor: "white",
            padding: "12px 20px",
            fontSize: 12,
            borderRadius: 4,
            marginTop: 50,
            cursor: "pointer",
          }}
        >
          SEE ALL →
        </button>
      </Link>
      {/*  at the bottom of the home page there is sorint movies that can be filter by genre */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "10px",
        }}
      >
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
      </div>

      <GenreMovies genre={usedGenre} />
    </div>
  );
}

export default Homepage;

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import GenreBar from "./genreBar";
import axios from "axios";
import GenreMovies from "./getGenremovie";
const TopTenMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // intentionally disable API before database completes
        const res = await fetch(
          "http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=Score&limit=10&desc=True"
        );
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.log("Error fetching movies:", error);
        // manual list used for testing style
        setMovies([
          { MovieName: "The Shawshank Redemption", Score: 5 },
          { MovieName: "The Godfather", Score: 4.7 },
          { MovieName: "The Godfather: Part II", Score: 4.6 },
          { MovieName: "The Dark Knight", Score: 4.5 },
          { MovieName: "12 Angry Men", Score: 4.5 },
          { MovieName: "Schindler's List", Score: 4.5 },
          {
            MovieName: "The Lord of the Rings: The Return of the King",
            Score: 4.5,
          },
          { MovieName: "Pulp Fiction", Score: 4.4 },
          { MovieName: "The Good, the Bad and the Ugly", Score: 4.4 },
          { MovieName: "Fight Club", Score: 4.3 },
        ]);
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
            }}
          >
            <Link to={`/movieinfo/${movie.Mid}`}>
              <div style={{ marginRight: "10px", fontWeight: "bold" }}>
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

const NewMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // intentionally disable API before database completes
        const res = await fetch(
          "http://lbosau.exlb.org:9900/Movie/ListOrder?orderby=PublishDate&limit=10&desc=True"
        );
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.log("Error fetching movies:", error);
        // manual list used for testing style
        setMovies([
          {
            MovieName: "The Shawshank Redemption",
            Score: 5.0,
            PublishDate: "2023/03/12",
          },
          {
            MovieName: "The Godfather",
            Score: 4.75,
            PublishDate: "2023/03/12",
          },
          {
            MovieName: "The Godfather: Part II",
            Score: 4.65,
            PublishDate: "2023/03/11",
          },
          {
            MovieName: "The Dark Knight",
            Score: 4.57,
            PublishDate: "2023/03/09",
          },
          { MovieName: "12 Angry Men", Score: 4.52, PublishDate: "2023/03/07" },
          {
            MovieName: "Schindler's List",
            Score: 4.5,
            PublishDate: "2023/03/07",
          },
          {
            MovieName: "The Lord of the Rings: The Return of the King",
            Score: 4.5,
            PublishDate: "2023/03/06",
          },
          { MovieName: "Pulp Fiction", Score: 4.45, PublishDate: "2023/03/03" },
          {
            MovieName: "The Good, the Bad and the Ugly",
            Score: 4.4,
            PublishDate: "2023/03/02",
          },
          { MovieName: "Fight Club", Score: 4.3, PublishDate: "2023/03/02" },
        ]);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div style={{ marginTop: "20px", color: "whitesmoke" }}>
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.MovieName}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px",
              width: "250px",
              height: "400px",
              backgroundColor: "gray",
              borderRadius: "10px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            }}
          >
            <img
              // src={require("../images/default-movie.png")}
              src={`http://lbosau.exlb.org:9900/image/${movie.MovieName}/${movie.MovieName}`}
              alt={movie.MovieName}
              style={{ width: "100%", height: "70%", objectFit: "cover" }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "30%",
                padding: "10px",
              }}
            >
              <Link to={`/movieinfo/${movie.Mid}`}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "10px",
                    color: "white",
                  }}
                >
                  {movie.MovieName}
                </div>
              </Link>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <div style={{ marginRight: "5px" }}>
                  {movie.Score.toFixed(2)}
                </div>
                <span style={{ color: "yellow" }}>★</span>
              </div>
              <div style={{ fontWeight: "bold" }}>
                Released on{" "}
                {new Date(movie.PublishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

  const usedGenre = selectedGenre === null ? "xxxxxxxxxxxxx" : selectedGenre;

  return (
    <div>
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
      <Slider {...settings}>
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
      <TopTenMovies />
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

      <NewMovies />
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

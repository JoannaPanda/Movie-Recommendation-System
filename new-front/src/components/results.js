import React from "react";
import { Link } from "react-router-dom";

function MovieResults(props) {
  return <MovieBox results={props.movies} />;
}

export default MovieResults;

const MovieBox = (props) => {
  const movies = props.results;

  const handleClick = () => {
    console.log("Clickable area clicked!");
  };

  return (
    <div
      style={{ marginTop: "20px", color: "whitesmoke" }}
      onClick={handleClick()}
    >
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
              height: "400px auto",
              backgroundColor: "gray",
              borderRadius: "10px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            }}
          >
            <Link to={`/movieinfo/${movie.Mid}`}>
              <img
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
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

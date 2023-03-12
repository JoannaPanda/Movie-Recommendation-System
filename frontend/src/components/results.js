import React from "react";
import { Link } from "react-router-dom";

function MovieResults(props) {
  // const boxes = props.movies.map((result) => {
  //   return (
  //     <Box
  //       mid={result.Mid}
  //       image={result.ImageLink}
  //       title={result.MovieName}
  //       rate={result.Score}
  //     />
  //   );
  // });
  return <MovieBox results={props.movies} />;
}

// const Box = (props) => {
//   return (
//     <div
//       className="shadow min-h-[200px] border border-black mt-3"
//       style={{
//         minHeight: 20,
//         borderColor: "black",
//         border: "none",
//         borderRadius: 30,
//         marginTop: 3,
//       }}
//     >
//       <Link to={`/movieinfo/${props.mid}`}>
//         <img src={props.image} alt="" className="w-full" />
//       </Link>
//       <div
//         className="flex justify-between px-2 items-center"
//         // style={{
//         //   display: "flex",
//         //   justifyContent: "spaceBetween",
//         //   alignItems: "center",
//         // }}
//       >
//         <span
//           className="text-2xl"
//           style={{
//             fontSize: 21,
//             color: "white",
//           }}
//         >
//           {" "}
//           {props.title}
//         </span>
//         <span
//           className="text-xl  text-yellow-500 font-bold"
//           style={{
//             fontSize: 11,
//             color: "yellow",
//             fontWeight: "bold",
//             marginLeft: "30%",
//           }}
//         >
//           {props.rate}
//         </span>
//       </div>
//     </div>
//   );
// };

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
              height: "400px",
              backgroundColor: "gray",
              borderRadius: "10px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
            }}
          >
            <Link to={`/movieinfo/${movie.Mid}`}>
              <img
                src={require("../images/titanic.jpg")}
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

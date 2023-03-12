import React from "react";
import { Link } from "react-router-dom";

function MovieResults(props) {
  const boxes = props.movies.map((result) => {
    return (
      <Box
        mid={result.Mid}
        image={result.ImageLink}
        title={result.MovieName}
        rate={result.Score}
      />
    );
  });
  return <div className="w-full grid grid-cols-4 gap-5">{boxes}</div>;
}

const Box = (props) => {
  return (
    <div
      className="shadow min-h-[200px] border border-black mt-3"
      style={{
        minHeight: 20,
        borderColor: "black",
        border: "none",
        borderRadius: 30,
        marginTop: 3,
      }}
    >
      <Link to={`/movieinfo/${props.mid}`}>
        <img src={props.image} alt="" className="w-full" />
      </Link>
      <div
        className="flex justify-between px-2 items-center"
        // style={{
        //   display: "flex",
        //   justifyContent: "spaceBetween",
        //   alignItems: "center",
        // }}
      >
        <span
          className="text-2xl"
          style={{
            fontSize: 21,
            color: "white",
          }}
        >
          {" "}
          {props.title}
        </span>
        <span
          className="text-xl  text-yellow-500 font-bold"
          style={{
            fontSize: 11,
            color: "yellow",
            fontWeight: "bold",
            marginLeft: "30%",
          }}
        >
          {props.rate}
        </span>
      </div>
    </div>
  );
};

export default MovieResults;

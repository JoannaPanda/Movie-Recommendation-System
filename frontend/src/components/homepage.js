import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const movies = [
  {
    name: "Nightmare Alley",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/539dffebe4b080549e5a5df5/1410310397860-B08JBSY4GLQ99U14SHBB/mp-36-nightmare-alley-film-noir-classic-movie-poster.jpg?format=1000w",
  },
  {
    name: "The Brides of Dracula",
    imageUrl:
      "http://static1.squarespace.com/static/539dffebe4b080549e5a5df5/53ac6176e4b0c4e738760920/57e4622415d5db083264a81f/1635979532345/?format=1500w",
  },
  {
    name: "Breakfast at Tiffany",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/539dffebe4b080549e5a5df5/1462396269407-D3URV1GNKZY8J31DUMC4/MP-63+Breakfast+at+Tiffany%27s++Vintage+Movie+Posters.jpg?format=1500w",
  },
  {
    name: "The Big Sleep",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/539dffebe4b080549e5a5df5/1492894877307-93AKZB22IF82BIDQ3048/MP-260-the-big-sleep-classic-vintage-movie-poster.jpeg?format=1500w",
  },
  {
    name: "Wizard of Oz ",
    imageUrl:
      "https://images.squarespace-cdn.com/content/v1/539dffebe4b080549e5a5df5/1556117276431-4EYYJM5WNYSKL0AQHNZ3/Wizard-of-Oz-classic-movie-poster-museum-outlets.jpg?format=1500w",
  },
];

function Homepage() {
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

  return (
    <Slider {...settings}>
      {movies.map((movie) => (
        <div key={movie.name}>
          <img
            src={movie.imageUrl}
            alt={movie.name}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      ))}
    </Slider>
  );
}

export default Homepage;

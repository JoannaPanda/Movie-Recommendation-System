import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./writeReview.css";
import axios from "axios";
import StarRating from "./starRating";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendurl } from "../components/backendurl";

const AddComment = () => {
  // extract "mid" information from URL
  const { mid } = useParams();
  const [token, setToken] = useState(null);
  // initial comment as empty
  const [comments, setComment] = useState([]);
  const [score, setScore] = useState([]);
  const [image, setImage] = useState([]);
  const [movieInfo, setMovieInfo] = useState([]);
  const [movieName, setMovieName] = useState([]);
  const [movieDirector, setMovieDirector] = useState([]);
  const [givenScore, setGivenScore] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [rating1Value, setRating1Value] = useState(0);
  const [rating2Value, setRating2Value] = useState(0);
  const [rating3Value, setRating3Value] = useState(0);
  const [rating4Value, setRating4Value] = useState(0);
  const [rating1Num, setrating1Num] = useState(0);
  const [rating2Num, setrating2Num] = useState(0);
  const [rating3Num, setrating3Num] = useState(0);
  const [rating4Num, setrating4Num] = useState(0);
  const [haveReview, setHaveReview] = useState(false);

  const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  console.log(token);
  const ratingStrings = {
    5: "Excellent",
    4: "Good",
    3: "Average",
    2: "Below Average",
    1: "Poor",
  };

  const handleRating1Change = (newValue) => {
    setRating1Value(newValue);
    const updatedRatingValue =
      newValue + rating2Value + rating3Value + rating4Value;
    setRatingValue(updatedRatingValue);
    if (newValue > 0) {
      setrating1Num(1);
    } else {
      setrating1Num(0);
    }
  };
  const handleRating2Change = (newValue) => {
    setRating2Value(newValue);
    const updatedRatingValue =
      rating1Value + newValue + rating3Value + rating4Value;
    setRatingValue(updatedRatingValue);
    if (newValue > 0) {
      setrating2Num(1);
    } else {
      setrating2Num(0);
    }
    // setRating2String("Characters are " + ratingStrings[newValue] + ", ");
    // const rsting =
    //   rating1String + rating2String + rating3String + rating4String;
    // setRatingString(rsting);
  };
  const handleRating3Change = (newValue) => {
    setRating3Value(newValue);
    const updatedRatingValue =
      rating1Value + rating2Value + newValue + rating4Value;
    setRatingValue(updatedRatingValue);
    if (newValue > 0) {
      setrating3Num(1);
    } else {
      setrating3Num(0);
    }
    // setRating3String("Audio is " + ratingStrings[newValue] + ", ");
    // const rsting =
    //   rating1String + rating2String + rating3String + rating4String;
    // setRatingString(rsting);
  };
  const handleRating4Change = (newValue) => {
    setRating4Value(newValue);
    const updatedRatingValue =
      rating1Value + rating2Value + rating3Value + newValue;
    setRatingValue(updatedRatingValue);
    if (newValue > 0) {
      setrating4Num(1);
    } else {
      setrating4Num(0);
    }
    // setRating4String("Visuals are " + ratingStrings[newValue] + ", ");
    // const rsting =
    //   rating1String + rating2String + rating3String + rating4String;
    // setRatingString(rsting);
  };

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "./script.js";
  //   document.body.appendChild(script);
  // }, []);
  function handleInputChange(event) {
    const ratestr =
      ratingValue == 0
        ? ""
        : (rating1Value > 0
            ? "Plot: " + ratingStrings[rating1Value] + ";\n "
            : "") +
          (rating2Value > 0
            ? "Actors: " + ratingStrings[rating2Value] + ";\n "
            : "") +
          (rating3Value > 0
            ? "Music: " + ratingStrings[rating3Value] + ";\n "
            : "") +
          (rating4Value > 0
            ? "Production: " + ratingStrings[rating4Value] + ";\n "
            : "") +
          ".\n";

    setInputValue(ratestr + event.target.value);
    // setRatingString(event.target.value);
  }

  useEffect(() => {
    // initial as empty when mid changed
    setComment([]);
    setScore([]);
    setImage([]);
    setMovieInfo([]);

    // fetch comment
    axios
      .get(`${backendurl}/Comment/Movie?Mid=${mid}`)
      .then((response) => {
        console.log(response);
        setComment(response.data.commentinfo);
        setScore(response.data.score);
        console.log(token);
        setHaveReview(
          response.data.commentinfo.some(
            (item) => item.uid === storedUserinfo.uid
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });

    // fetch Movieinfo
    axios
      .get(`${backendurl}/Movie/Info?Mid=${mid}`)
      .then((response) => {
        console.log(response);
        setMovieInfo(response.data.movieinfo);
        setMovieName(response.data.movieinfo.MovieName);
        setMovieDirector(response.data.movieinfo.Director);
      })
      .catch((error) => {
        console.log(error);
      });

    // fetch image of movie
    axios
      .get(`${backendurl}/image/${movieName}/${movieName}`)
      .then((response) => {
        console.log(response);
        setImage(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [mid]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const certifyCheckbox = document.querySelector('input[name="submit"]');
    if (!certifyCheckbox.checked) {
      toast.error(
        "Please certify that this review is based on your own experience and is your genuine opinion.",
        {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
        },
        3000
      );
      // alert("Please certify that this review is based on your own experience and is your genuine opinion.");
      return;
    }

    const params = new URLSearchParams();
    console.log("heretoken", token);
    params.append("Mid", mid);
    params.append("token", token);
    params.append("score", givenScore);
    params.append("comment", inputValue);
    console.log(params.toString());

    fetch(`${backendurl}/Comment/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        toast.success("Success!", {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          onClose: () => {
            setTimeout(() => {
              window.location.href = `/comment/list/${mid}`;
            }, 3000); // Delay redirect by 2 seconds
          },
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          "Error!",
          {
            position: "bottom-left",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
          },
          3000
        ); // Delay redirect by 2 seconds);
      });
  };

  const rate = (circle) => {
    const circles = document.getElementsByClassName("circle-poster");
    const score = parseInt(circle.alt);
    const scoreDisplay = document.getElementById("score");

    if (score === givenScore) {
      // double-clicked on the same dot
      setGivenScore(0);
      scoreDisplay.textContent = "Awful";
    } else {
      setGivenScore(score);
      scoreDisplay.textContent =
        score === 0
          ? "Awful"
          : score === 1
          ? "Terrible"
          : score === 2
          ? "Poor"
          : score === 3
          ? "Average"
          : score === 4
          ? "Very Good"
          : score === 5
          ? "Excellent"
          : "";
    }
    if (scoreDisplay.textContent === "Awful") {
      for (let i = 0; i < circles.length; i++) {
        circles[i].src = require("../CommentImage/emptyCircle.png");
      }
    } else {
      for (let i = 0; i < circles.length; i++) {
        if (i < score) {
          circles[i].src = require("../CommentImage/circle.png");
        } else {
          circles[i].src = require("../CommentImage/emptyCircle.png");
        }
      }
    }
  };

  return (
    <div className="container-grey2">
      <div className="inline">
        <div>
          <a href={`http://localhost:3000/comment/list/${mid}`}>
            <img
              className="back_poster"
              src={require("../CommentImage/back.png")}
            />
          </a>
        </div>
        <div className="left-column">
          <div className="inline-element">
            {
              <img
                className="movie-poster-display"
                src={`${backendurl}/image/${movieName}/${movieName}`}
              />
            }
            <div>
              <h3 className="title">{movieName}</h3>
              <h5 className="director">{movieDirector}</h5>
            </div>
          </div>
          <h4 className="adv">
            Your first-hand experiences really help other Movie Finders.
          </h4>
          <h4>
            Please note that your re-comment will overwrite the previous one.
          </h4>
          <h4 className="adv2">Thanks!</h4>
          <hr className="line" />
          <StarRating
            name="Plot"
            value={rating1Value}
            onValueChange={handleRating1Change}
          />
          <StarRating
            name="Actors"
            value={rating2Value}
            onValueChange={handleRating2Change}
          />
          <StarRating
            name="Music"
            value={rating3Value}
            onValueChange={handleRating3Change}
          />
          <StarRating
            name="Production"
            value={rating4Value}
            onValueChange={handleRating4Change}
          />
          <p>
            According to your four sub-ratings, the advised overall rating is{" "}
            {Math.round(
              ratingValue / (rating1Num + rating2Num + rating3Num + rating4Num)
            )}
            {console.log(rating1Num)}
            {console.log(rating2Num)}
            {console.log(rating3Num)}
            {console.log(rating4Num)}.
          </p>
          <h5>Your overall rating of this movie</h5>
          <div className="rating-container">
            <div className="inline-element">
              <img
                src={require("../CommentImage/emptyCircle.png")}
                alt="1"
                className="circle-poster"
                onClick={(e) => rate(e.target)}
              />
              <img
                src={require("../CommentImage/emptyCircle.png")}
                alt="2"
                className="circle-poster"
                onClick={(e) => rate(e.target)}
              />
              <img
                src={require("../CommentImage/emptyCircle.png")}
                alt="3"
                className="circle-poster"
                onClick={(e) => rate(e.target)}
              />
              <img
                src={require("../CommentImage/emptyCircle.png")}
                alt="4"
                className="circle-poster"
                onClick={(e) => rate(e.target)}
              />
              <img
                src={require("../CommentImage/emptyCircle.png")}
                alt="5"
                className="circle-poster"
                onClick={(e) => rate(e.target)}
              />
              <div className="score-display">
                <span id="score">Click to rate</span>
              </div>
            </div>
            <div className="inline-element">
              <h5>Your review</h5>
              <h6 className="tips">
                <abbr
                  data-tips="Describe the movie you experienced&#x0a;Tell us how you liked the movie&#x0a;Talk about the atmosphere&#x0a;Say what you liked best & least&#x0a;"
                >
                  Tips for writing a great review
                </abbr>
              </h6>
            </div>
            <textarea
              type="text"
              id="input-box"
              placeholder="Tell people about your expierence"
              className="input"
              onChange={handleInputChange}
              // value={
              //   "Plot is " +
              //   ratingStrings[rating1Value] +
              //   ", Characters are " +
              //   ratingStrings[rating2Value] +
              //   ", Audio is " +
              //   ratingStrings[rating3Value] +
              //   ", Visuals are " +
              //   ratingStrings[rating4Value]
              // }
            >
              {console.log(comments)}
            </textarea>
            <hr className="line2" />
            {/* <h4>Submit your review</h4> */}
            <div className="inline-element">
              <label className="certify">
                <input type="checkbox" name="submit" />I certify that this
                review is based on my own experience and is my genuine opinion
                of this restaurant, and that I have no personal or business
                relationship with this establishment, and have not been offered
                any incentive or payment originating from the establishment to
                write this review. I understand that Tripadvisor has a
                zero-tolerance policy on fake reviews.
              </label>
            </div>
            {comments.some((item) => item.Uid === storedUserinfo.Uid) ? (
              <li style={{ color: "red", marginTop: 10 }}>
                You had already given a review. If you submit a review again,
                your old review would be replaced by this new one.
              </li>
            ) : (
              <></>
            )}

            {console.log(
              comments.some((item) => item.Uid === storedUserinfo.Uid)
            )}
            <button className="submit" type="submit" onClick={handleSubmit}>
              Submit your review
            </button>
          </div>
        </div>
        <script src="script.js"></script>
      </div>
      <ToastContainer />
      {console.log(comments)}
    </div>
  );
};

export default AddComment;

import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './writeReview.css';
import axios from "axios";

const AddComment = () => {
    // extract "mid" and "token" information from URL
    const { mid, token } = useParams();
    // initial comment as empty
    const [comments, setComment] = useState([]);
    const [score, setScore] = useState([]);
    const [image, setImage] = useState([]);
    const [movieInfo, setMovieInfo] = useState([]);
    const [movieName, setMovieName] = useState([]);
    const [movieDirector, setMovieDirector] = useState([]);

    // useEffect(() => {
    //   const script = document.createElement("script");
    //   script.src = "./script.js";
    //   document.body.appendChild(script);
    // }, []);
  
    useEffect(() => {
        // initial as empty when mid changed
        setComment([]);
        setScore([]);
        setImage([]);
        setMovieInfo([]);

        // fetch comment
        axios
        .get(`http://lbosau.exlb.org:9900/Comment/Movie?Mid=${mid}`)
        .then((response) => {
            console.log(response);
            setComment(response.data.commentinfo);
            setScore(response.data.score)
        })
        .catch((error) => {
            console.log(error);
            
        });

        // fetch Movieinfo
        axios
        .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}`)
        .then((response) => {
            console.log(response);
            setMovieInfo(response.data.movieinfo);
            setMovieName(response.data.movieinfo.MovieName);
            setMovieDirector(response.data.movieinfo.Director)
            
        })
        .catch((error) => {
            console.log(error);
        });

        // fetch image of movie
        axios
        .get(`http://lbosau.exlb.org:9900/image/${movieName}/${movieName}`)
        .then((response) => {
            console.log(response);
            setImage(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }, [mid]);

    const rate = (circle) => {
      const circles = document.getElementsByClassName("circle-poster");
      const score = parseInt(circle.alt);

      for (let i = 0; i < circles.length; i++) {
          if (i < score) {
            circles[i].src = require("../CommentImage/circle.png");
          } else {
            circles[i].src = require("../CommentImage/emptyCircle.png");
          }
      }
      const scoreDisplay = document.getElementById("score");

      if (score == 1) scoreDisplay.textContent = "Terrible";
      if (score == 2) scoreDisplay.textContent = "Poor";
      if (score == 3) scoreDisplay.textContent = "Average";
      if (score == 4) scoreDisplay.textContent = "Very Good";
      if (score == 5) scoreDisplay.textContent = "Excellent";
    };

    return (
        <>
          <div className="left-column">
            <div className="inline-element">
              {<img 
                className="movie-poster" 
                src={`http://lbosau.exlb.org:9900/image/${movieName}/${movieName}`}
              />}
              <div>
                <h3 className="title">{movieName}</h3>
                <h5 className="director">{movieDirector}</h5>
              </div>
            </div>
            <h4 className="adv">
              Your first-hand experiences really help other Movie Finders.
            </h4>
            <h4 className="adv2">Thanks!</h4>
            <hr className="line" />
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
              ></textarea>
              <hr className="line2" />
              <h4>Submit your review</h4>
              <div className="inline-element">
                <label className="certify">
                  <input type="checkbox" name="submit" />
                  I certify that this review is based on my own experience and is my
                  genuine opinion of this restaurant, and that I have no personal or
                  business relationship with this establishment, and have not been
                  offered any incentive or payment originating from the establishment
                  to write this review. I understand that Tripadvisor has a zero-tolerance
                  policy on fake reviews.
                </label>
              </div>
              <button className="submit">Submit your review</button>
            </div>
          </div>
          <script src="script.js"></script>
        </>
    );
}

export default AddComment;
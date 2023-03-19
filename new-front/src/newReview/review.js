import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './review.css';
import axios from "axios";

const ListComment = () => {
    // extract "mid" and "token" information from URL
    const { mid, token } = useParams();
    // initial comment as empty
    const [comments, setComment] = useState([]);
    const [score, setScore] = useState([]);
    const [image, setImage] = useState([]);
    const [movieInfo, setMovieInfo] = useState([]);
    const [movieName, setMovieName] = useState([]);


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

    return (
        <div>
            <div className="inline-element">
                <a href="https://www.google.com" target="_blank">
                    <img
                        className="back_poster"
                        src={require("../CommentImage/back.png")}
                    />
                </a>
                <div className="title">{movieName}</div>
                <div className="pass_poster">
                    <img
                        className="pass_poster"
                        src={require("../CommentImage/pass.png")}
                    />
                </div>
                <div style={{ marginTop: "50px", fontSize: "15px" }}>Claimed</div>
                <div>
                    <img
                        className="profile_poster"
                        src={require("../CommentImage/profile.png")}
                    />
                    <img
                        className="setting_poster"
                        src={require("../CommentImage/global.png" )}
                    />
                    <img
                        className="setting_poster"
                        src={require("../CommentImage/setting.png")}
                    />
                </div>
            </div>

            <div className="container-green">
                <div className="inline-element">
                    <div className="container-largegreen"></div>
                    <div className="covid-noticeL">COVID-19 update:</div>
                    <div className="covid-noticeS"> Enjoy movies safely with our enhanced health measures.</div>
                    <a href="https://www.healthdirect.gov.au/covid19-restriction-checker/entertainment-and-amusement-venues/nsw" target="_blank">
                        <div className="covid-noticeM">Read more</div>
                    </a>
                </div>
            </div>
        
            <div className="container-grey">
                <div className="inline-element">
                    <div>
                        {image && <img className="movie_poster" src={image}/>}
                    </div>
                    <div className="white-box">
                        <h4 style={{ marginTop: "10px" }}>Ratings and reviews</h4>
                        <div className="inline-element">
                            <h3 style={{ marginTop: "0px" }}>{Math.round(Number(parseFloat(score).toFixed(2)))}</h3>
                            {[...Array(Math.round(Number(score)))].map((_, index) => (
                                <img
                                key={index}
                                className="rest_circle"
                                src={require("../CommentImage/circle.png")}
                                />
                            ))}
                            </div>
                        <h5 style={{ marginTop: "0px", marginBottom: "10px" }}># 152 of movie in Movie Finder</h5>
                        <h5 style={{ marginTop: "0px", marginBottom: "40px" }}># 3588 of movie finders reviews</h5>

                        <hr style={{ borderColor: '#e0e0e0', borderWidth: '1px', width: '90%' }} />

                        <h4 style={{ marginTop: "40px" }}>Type</h4>
                        <h5>Drama / Comedy</h5>

                    </div>
                    <div className="white-box">
                        <h4 style={{ marginTop: "10px" }}>Location and contact</h4>
                        <a href="https://www.google.com/maps/place/Ritz+Cinemas/@-33.9200572,151.2421689,17.63z/data=!3m1!5s0x6b12b222eee7ee7d:0x2cf44beea19c5de3!4m6!3m5!1s0x6b12b222ef472a97:0x156e315a4bc48178!8m2!3d-33.9200741!4d151.243326!16s%2Fm%2F0_83wmc" target="_blank">
                            <img
                                className="cinema_poster"
                                src={require("../CommentImage/cinemaAddress.png")}
                            />
                            <div className="inline-element">
                                <img
                                    className="address_poster"
                                    src={require("../CommentImage/location.png")}
                                />
                                <div className="address">45 St Pauls St, Randwick NSW 2031</div>
                                <img
                                    className="address_poster"
                                    src={require("../CommentImage/NEarrow.png")}
                                />

                            </div>
                        </a>
                        <div className="inline-element">
                            <img
                                className="address_poster"
                                src={require("../CommentImage/call.png")}
                            />
                            <div className="address">(02) 83 24 25 00</div>
                        </div>
                        <h6>improve this list?</h6>
                    </div>
                </div>

                <div className="container-write-comments">
                    <h5 style={{ fontWeight: "100" }}>Write a review and unleash your creativity too - join the conversation today!</h5>
                </div>

                <div className="inline-element">
                    <div className="container-comments">
                        <div className="inline-element">
                            <h3 style={{ 
                                marginTop: '10px',
                            }}>Reviews</h3>
                            <div className='review-number'>({comments.length})</div>
                            <button className="button-write">
                                <div style={{marginTop: '-25px'}}>Write a review</div>
                            </button>
                        </div>
                        <hr style={{ 
                            borderColor: '#e0e0e0', 
                            borderWidth: '1px', 
                            width: '95%',
                            marginTop: '10px',
                            marginBottom: '10px',
                        }} />
                        <div>
                        {Array.isArray(comments) && comments.map((comment) => (
                            <div key={comment.id}>
                                <div className='inline-element'>
                                    <div style={{width: '30%'}}>                                                                               
                                        <img
                                            className="user_poster"
                                            src={`http://lbosau.exlb.org:9900/Image/User/${comment.Uid}`}
                                        />
                                    </div>
                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                        {[...Array(comment.score)].map((_, index) => (
                                        <img
                                            key={index}
                                            className="rest_circle"
                                            src={require("../CommentImage/circle.png")}
                                        />
                                        ))}
                                    </div>
                                    <div className='comment'>{comment.Comment}</div>
                                </div>
                                <hr style={{ 
                                        borderColor: '#e0e0e0', 
                                        borderWidth: '1px', 
                                        width: '95%',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                }} />
                            </div>
                        ))}
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default ListComment;

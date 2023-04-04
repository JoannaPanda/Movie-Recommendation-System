import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from "react-router-dom";
import './review.css';
import axios from "axios";

const ListComment = () => {
    // extract "mid" and "token" information from URL
    const { mid, token } = useParams();
    // initial comment as empty
    const [comments, setComment] = useState([]);
    const [score, setScore] = useState([]);
    const [movieInfo, setMovieInfo] = useState([]);
    const [movieName, setMovieName] = useState([]);
    
    const [visibleComments, setVisibleComments] = useState([]);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        // fetch comment
        setIsLoading(true);
        axios
        .get(`http://lbosau.exlb.org:9900/Comment/Movie?Mid=${mid}`)
        .then((response) => {
            setComment(response.data.commentinfo);
            setVisibleComments(response.data.commentinfo.slice(0, 10));
            setScore(response.data.score)
            setScrollIndex(10);
        })
        .catch((error) => {
            console.log(error);
        });

        // fetch Movieinfo
        axios
        .get(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${mid}`)
        .then((response) => {
            setMovieInfo(response.data.movieinfo);
            setMovieName(response.data.movieinfo.MovieName);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, [mid]);

    const loadMoreComments = useCallback(() => {
        if (scrollIndex >= comments.length) return;

        setVisibleComments((prevVisibleComments) =>
            prevVisibleComments.concat(comments.slice(scrollIndex, scrollIndex + 10)),
        );

        setScrollIndex((prevScrollIndex) => prevScrollIndex + 10);
    }, [scrollIndex, comments]);

    useEffect(() => {
        const handleScroll = (event) => {
            const { scrollTop, clientHeight, scrollHeight } = event.target;
            if (scrollHeight - scrollTop <= clientHeight) {
                loadMoreComments();
            }
        }
        const container = document.getElementById('comment');
        console.log(container);
        console.log(comments);
        container.addEventListener('scroll', handleScroll);

        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [loadMoreComments]);

    return (
        <div id="comment">
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
                        {<img className="movie_poster" src={`http://lbosau.exlb.org:9900/image/${movieName}/${movieName}`}/>}
                    </div>
                    <div className="white-box">
                    <div style={{padding: "20px"}}>
                        <h4 style={{ marginTop: "10px" }}>Ratings and reviews</h4>
                        <div className="inline-element">
                            <h3 style={{ marginTop: "0px", marginRight: "10px"}}>{Number(parseFloat(score).toFixed(2))}</h3>
                            {[...Array(Math.floor(Number(score)))].map((_, index) => (
                                <img
                                key={index}
                                className="rest_circle"
                                src={require("../CommentImage/circle.png")}
                                />
                            ))}
                        </div>
                        <h5 style={{ marginTop: "0px", marginBottom: "10px" }}># {comments.length} of movie in Movie Finder</h5>
                        <h5 style={{ marginTop: "0px", marginBottom: "40px" }}># {comments.length} of movie finders reviews</h5>

                        <hr style={{ borderColor: '#e0e0e0', borderWidth: '1px', width: '90%' , opacity: '0.3'}} />

                        <h4 style={{ marginTop: "40px" }}>Type</h4>
                        <h5>Drama / Comedy</h5>
                    </div>
                    </div>
                    <div className="white-box">
                    <div style={{padding: "20px"}}>
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
                                <a href={`http://localhost:3000/comment/add/${mid}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{marginTop: '-25px'}}>Write a review</div>
                                </a>   
                            </button>
                        </div>
                        <hr style={{ 
                            borderColor: '#e0e0e0', 
                            borderWidth: '1px', 
                            width: '95%',
                            marginTop: '10px',
                            marginBottom: '10px',
                            opacity: '0.3',
                        }} />
                        <div >
                            {Array.isArray(visibleComments) && visibleComments.map((comment) => (
                                <div key={comment.id}>
                                    <div className='inline-element'>
                                        <div style={{width: '30%', marginLeft: '50px'}}>                                                                               
                                            <img
                                                className="user_poster"
                                                src={`http://lbosau.exlb.org:9900/Image/User/${comment.Uid}`}
                                            />
                                        </div>
                                        <div style={{marginLeft: '-55px'}}>
                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                {[...Array(comment.Score)].map((_, index) => (
                                                <img
                                                    key={index}
                                                    className="comment-poster"
                                                    src={require("../CommentImage/circle.png")}
                                                />
                                                ))}
                                            </div>
                                            <div className='comment'>{comment.Comment}</div>
                                            <div className='inline-element'>
                                                <h6>helpful?</h6>
                                                <img
                                                    className='good-poster'
                                                    src={require("../CommentImage/emptyGood.png")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <hr style={{ 
                                            borderColor: '#e0e0e0', 
                                            borderWidth: '1px', 
                                            width: '95%',
                                            marginTop: '-15px',
                                            marginBottom: '10px',
                                            opacity: '0.3',
                                    }} />
                                </div>
                            ))}
                            {isLoading && <h5>Loading comments...</h5>}
                            {!isLoading && scrollIndex >= comments.length && <h5>No more comments to load</h5>}
                        </div>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default ListComment;

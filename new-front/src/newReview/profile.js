import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './profile.css';
import axios from "axios";

const Profile = () => {
    const { uid } = useParams();
    const [comments, setComment] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [movieNames, setMovieNames] = useState([]);
    const [movieInfo, setMovieInfo] = useState([]);
    const [banlist, setBanlist] = useState([]);
    const [banUser, setBanUser] = useState([]);

    useEffect(() => {
        Promise.all(comments.map((comment) => fetch(`http://lbosau.exlb.org:9900/Movie/Info?Mid=${comment.Mid}`).then((response) => response.json())))
        .then((data) => {          
            const movieNames = data.map((movieInfo) => movieInfo.movieinfo.MovieName);
            setMovieNames(movieNames);

            const movieInfo = data.map((movieInfo) => movieInfo.movieinfo);
            setMovieInfo(movieInfo);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [comments]);

    useEffect(() => {
        // fetch all comment for this user
        axios
        .get(`http://lbosau.exlb.org:9900/User/Comment?Uid=${uid}`)
        .then((response) => {
            setComment(response.data);
        })
        .catch((error) => {
            console.log(error);
        });

        // fetch user information
        axios
        .get(`http://lbosau.exlb.org:9900/User/Info?Uid=${uid}`)
        .then((response) => {
            setUserInfo(response.data);
            setBanlist(response.data.BanList);
        })
        .catch((error) => {
            console.log(error);
        });

    }, [uid]);

    // banning list 
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleClick = () => {
        setIsDialogOpen(true);
        document.body.classList.add("modal-open");
    };
    const handleClose = () => {
        setIsDialogOpen(false);
        document.body.classList.remove("modal-open");
    };

    useEffect(() => {
        Promise.all(
            banlist.map(uid =>
                fetch(`http://lbosau.exlb.org:9900/User/Info?Uid=${uid}`)
                .then(response => response.json())
            )
        ).then(users => {
          setBanUser(users);
        });
    }, [banlist]);

    return (
        <>
        <div style= {{ backgroundColor: "#f2f2f2", paddingTop: "30px" }}>
            <div className="white-box">
                <div className="inline">
                    <img
                        src={`http://lbosau.exlb.org:9900/Image/User/${uid}`}
                        className="user-poster" 
                    />
                    <div>
                        <h3 style={{ marginBottom: "6px", marginTop: "6px" }}>{userInfo.UserName !== '' ? userInfo.UserName : 'Tong Xia'}</h3>
                        <div className="inline">
                            <div>
                                <h4>Contributions</h4>
                                <h4 style={{ marginTop: "-20px" }}>3</h4>
                            </div>
                        
                            <div onClick={handleClick} className="banning">
                                <h4 style={{ marginLeft: "55%" }}>Banning</h4>
                                <h4 style={{ marginLeft: "55%", marginTop: "-20px" }}>2</h4>
                            </div>
                            {isDialogOpen && (
                                <div className="modal">
                                    <div>
                                        <div className='close-background' onClick={handleClose}>
                                            {<img className="delete_poster2" 
                                                src={require("../CommentImage/close.png")}
                                            />}
                                        </div>
                                        <div className="modal-content">
                                        {banUser.map(user => (
                                            <div key={user.Uid}>
                                                {user.UserName}
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="white-small-box">
                {comments.map((comment, index) => (
                    <div key={comment.id}> 
                        <div className='inline'>
                            <div style={{width: '30%', marginLeft: '50px'}}>                                                                               
                                <img
                                    className="user_poster"
                                    src={`http://lbosau.exlb.org:9900/Image/User/${comment.Uid}`}
                                />
                            </div>
                            <h5 className='userName'>{userInfo.UserName !== '' ? userInfo.UserName : 'Tong Xia'}</h5>
                            <h6 className='writeReview'>wrote a review</h6>
                            <div>
                                {<img className="delete_poster" 
                                src={require("../CommentImage/close.png")}
                                />}
                            </div>
                        </div>
                        <div style={{marginLeft: '50px'}}>
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                {[...Array(comment.Score)].map((_, index) => (
                                <img
                                    key={index}
                                    className="comment-poster"
                                    src={require("../CommentImage/circle.png")}
                                />
                                ))}
                                {[...Array(5 - Math.floor(comment.Score))].map((_, index) => (
                                <img
                                    key={index}
                                    className="comment-poster"
                                    src={require("../CommentImage/emptyCircle.png")}
                                />
                                ))} 
                            </div>
                            {/* <div className='userComment'>{comment.Comment}</div>
                            <div className='inline'>
                                <div>
                                    {<img className="movie_poster" 
                                    src={`http://lbosau.exlb.org:9900/image/${movieNames[index]}/${movieNames[index]}`}
                                    />}
                                </div>
                                <div className='box'>
                                    <div className='movieName'>{movieNames[index]}</div>
                                    <div className='dirName'>{movieInfo[index].Director}</div> 
                                    {[...Array(Math.floor(movieInfo[index].Score))].map((_, index) => (
                                    <img
                                        key={index}
                                        className="comment-poster"
                                        src={require("../CommentImage/circle.png")}
                                    />
                                    ))}
                                    {[...Array(5 - Math.floor(movieInfo[index].Score))].map((_, index) => (
                                    <img
                                        key={index}
                                        className="comment-poster"
                                        src={require("../CommentImage/emptyCircle.png")}
                                    />
                                    ))} 
                                </div>
                            </div> */}
                        </div>                       
                        <hr style={{ 
                            borderColor: '#e0e0e0', 
                            borderWidth: '1px', 
                            width: '95%',
                            marginTop: '30px',
                            marginBottom: '30px',
                            opacity: '0.3',
                        }} />
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}

export default Profile;
import React, { useState, useEffect } from "react";

function LikeComment({ Cid }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setdisliked] = useState(false);
  const [userinfo, setUserinfo] = useState({});
  const [ouid, setOuid] = useState("");

  // get the user info from the localstorage
  useEffect(() => {
    const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserinfo) {
      setUserinfo(storedUserinfo);
      setOuid(storedUserinfo.Uid);
    }
  }, []);
  // from the storage, get the likedcomment list
  useEffect(() => {
    // Check if this comment is liked in local storage
    const likedComments = JSON.parse(
      localStorage.getItem("likedComments") || "[]"
    );
    if (
      likedComments.some(
        (comment) => comment.Cid === Cid && comment.Uid === ouid
      )
    ) {
      setLiked(true);
    }
    console.log("liked", localStorage.getItem("likedComments"));
  }, [Cid, ouid]);

  // from the storage, get the dislikedcomment list
  useEffect(() => {
    // Check if this comment is disliked in local storage
    const dislikedComments = JSON.parse(
      localStorage.getItem("dislikedComments") || "[]"
    );
    if (
      dislikedComments.some(
        (comment) => comment.Cid === Cid && comment.Uid === ouid
      )
    ) {
      setdisliked(true);
    }
    console.log("disliked", localStorage.getItem("dislikedComments"));
  }, [Cid, ouid]);

  const handleLike = () => {
    if (liked) {
      // Unlike the comment
      const likedComments = JSON.parse(
        localStorage.getItem("likedComments") || "[]"
      );
      const updatedLikedComments = likedComments.filter(
        (comment) => !(comment.Cid === Cid && comment.Uid === ouid)
      );
      localStorage.setItem(
        "likedComments",
        JSON.stringify(updatedLikedComments)
      );
      setLiked(false);
    } else {
      // Like the comment
      const likedComments = JSON.parse(
        localStorage.getItem("likedComments") || "[]"
      );
      const updatedLikedComments = [...likedComments, { Cid: Cid, Uid: ouid }];
      localStorage.setItem(
        "likedComments",
        JSON.stringify(updatedLikedComments)
      );
      setLiked(true);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      // Unlike the comment
      const dislikedComments = JSON.parse(
        localStorage.getItem("dislikedComments") || "[]"
      );
      const updatedDislikedComments = dislikedComments.filter(
        (comment) => !(comment.Cid === Cid && comment.Uid === ouid)
      );
      localStorage.setItem(
        "dislikedComments",
        JSON.stringify(updatedDislikedComments)
      );
      setdisliked(false);
    } else {
      // Like the comment
      const dislikedComments = JSON.parse(
        localStorage.getItem("dislikedComments") || "[]"
      );
      const updatedDislikedComments = [
        ...dislikedComments,
        { Cid: Cid, Uid: ouid },
      ];
      localStorage.setItem(
        "dislikedComments",
        JSON.stringify(updatedDislikedComments)
      );
      setdisliked(true);
    }
  };
  return (
    <div>
      <img
        src={
          liked
            ? require("../CommentImage/liked.png")
            : require("../CommentImage/like.png")
        }
        alt={liked ? "Liked" : "Not liked"}
        onClick={handleLike}
        style={{
          cursor: "pointer",
          width: "25px",
          height: "25px",
          marginRight: "5px",
          marginLeft: "10px",
        }}
      />
      <img
        src={
          disliked
            ? require("../CommentImage/disliked.png")
            : require("../CommentImage/dislike.png")
        }
        alt={disliked ? "disliked" : "Not disliked"}
        onClick={handleDislike}
        style={{
          marginTop: "20px",
          cursor: "pointer",
          width: "25px",
          height: "25px",
        }}
      />
    </div>
  );
}

export default LikeComment;

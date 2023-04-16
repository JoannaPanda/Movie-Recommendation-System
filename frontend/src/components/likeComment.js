import React, { useState, useEffect } from "react";

function LikeComment({ Cid }) {
  const [liked, setLiked] = useState(false);
  const [userinfo, setUserinfo] = useState({});
  const [ouid, setOuid] = useState("");

  useEffect(() => {
    const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserinfo) {
      setUserinfo(storedUserinfo);
      setOuid(storedUserinfo.Uid);
    }
  }, []);

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
    console.log(localStorage.getItem("likedComments"));
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

  return (
    <div>
      <button
        onClick={handleLike}
        style={{
          color: liked ? "yellow" : "black",
        }}
      >
        Like
      </button>
    </div>
  );
}

export default LikeComment;

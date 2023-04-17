import React, { useState, useEffect } from "react";

function DislikeComment({ Cid }) {
  const [disliked, setDisliked] = useState(false);
  const [userinfo, setUserinfo] = useState({});
  const [ouid, setOuid] = useState("");

  useEffect(() => {
    const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserinfo) {
      setUserinfo(storedUserinfo);
      setOuid(userinfo.Uid);
    }
  }, []);

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
      setDisliked(true);
    }
    console.log(localStorage.getItem("dislikedComments"));
  }, [Cid, ouid]);

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
      setDisliked(false);
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
      setDisliked(true);
    }
  };

  return (
    <div>
      <button
        onClick={handleDislike}
        style={{
          color: disliked ? "yellow" : "black",
        }}
      >
        Dislike
      </button>
    </div>
  );
}

export default DislikeComment;

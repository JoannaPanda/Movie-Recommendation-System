import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { backendurl } from "../components/backendurl";

const ListComment = () => {
  const { mid, token } = useParams();
  const [allComments, setAllComments] = useState([]);
  const [visibleComments, setVisibleComments] = useState([]);

  const [scrollIndex, setScrollIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all comments initially
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${backendurl}/Comment/Movie?Mid=${mid}`)
      .then((response) => {
        setAllComments(response.data.commentinfo);
        setVisibleComments(response.data.commentinfo.slice(0, 10)); // Initially show the first 10 comments
        setScrollIndex(10);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [mid]);

  // Function to load more comments when the user scrolls
  const loadMoreComments = useCallback(() => {
    if (scrollIndex >= allComments.length) return;

    setVisibleComments((prevVisibleComments) =>
      prevVisibleComments.concat(allComments.slice(scrollIndex, scrollIndex + 10)),
    );
    setScrollIndex((prevScrollIndex) => prevScrollIndex + 10);
  }, [scrollIndex, allComments]);

  // Infinite scroll event listener
  useEffect(() => {
    const handleScroll = (event) => {
      const { scrollTop, clientHeight, scrollHeight } = event.target;

      if (scrollHeight - scrollTop === clientHeight) {
        loadMoreComments();
      }
    };

    const container = document.getElementById('comments-container');
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreComments]);

  return (
    <div id="comments-container" style={{ height: '300px', overflow: 'auto' }}>
      {visibleComments.map((comment, index) => (
        <p key={index}>{comment.Comment}</p>
      ))}
      {isLoading && <p>Loading comments...</p>}
      {!isLoading && scrollIndex >= allComments.length && <p>No more comments to load</p>}
    </div>
  );
};

export default ListComment;

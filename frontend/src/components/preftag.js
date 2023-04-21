import React, { useState, useEffect } from "react";
import "../styles/Pref.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tagData = [
  { id: 1, name: "Leonardo DiCaprio" },
  { id: 2, name: "Kate Winslet" },
  { id: 3, name: "Tom Hanks" },
  { id: 4, name: "Meryl Streep" },
  { id: 5, name: "Brad Pitt" },
  { id: 6, name: "Angelina Jolie" },
  { id: 7, name: "Johnny Depp" },
  { id: 8, name: "Emma Stone" },
  { id: 9, name: "Robert Downey Jr." },
  { id: 10, name: "Jennifer Lawrence" },
  { id: 11, name: "Ryan Gosling" },
  { id: 12, name: "Emma Watson" },
  { id: 13, name: "Will Smith" },
  { id: 14, name: "Scarlett Johansson" },
  { id: 15, name: "Matt Damon" },
  { id: 16, name: "Anne Hathaway" },
  { id: 17, name: "Denzel Washington" },
  { id: 18, name: "Charlize Theron" },
  { id: 19, name: "Steven Spielberg" },
  { id: 20, name: "Quentin Tarantino" },
  { id: 21, name: "Christopher Nolan" },
  { id: 22, name: "Martin Scorsese" },
  { id: 23, name: "James Cameron" },
  { id: 24, name: "Francis Ford Coppola" },
  { id: 25, name: "Ridley Scott" },
  { id: 26, name: "Alfred Hitchcock" },
  { id: 27, name: "Stanley Kubrick" },
  { id: 28, name: "Tim Burton" },
  { id: 29, name: "Woody Allen" },
  { id: 30, name: "George Lucas" },
  { id: 31, name: "Spike Lee" },
  { id: 32, name: "Coen Brothers" },
  { id: 33, name: "David Fincher" },
  { id: 34, name: "Wes Anderson" },
  { id: 35, name: "Clint Eastwood" },
  { id: 36, name: "Peter Jackson" },
  { id: 37, name: "High School" },
  { id: 38, name: "Zombie" },
  { id: 39, name: "Ninja" },
  { id: 40, name: "Superhero" },
  { id: 41, name: "Alien" },
  { id: 42, name: "Tragic" },
  { id: 43, name: "Animation" },
  { id: 44, name: "Travel" },
  { id: 45, name: "Mystery" },
  { id: 46, name: "Spy" },
  { id: 47, name: "Historical" },
  { id: 48, name: "documentary" },
  { id: 49, name: "Animal" },
  { id: 50, name: "Magic" },
  { id: 51, name: "Fantasy" },
  { id: 52, name: "Disney" },
  { id: 53, name: "Game" },
  { id: 54, name: "Race" },
];

const SetPreferenceTag = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [userinfo, setUserinfo] = useState(null);
  const [page, setPage] = useState(0);
  // get the user info
  useEffect(() => {
    const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserinfo) {
      setUserinfo(storedUserinfo);
    }
  }, []);
  // is the tag is clicked then put in the tag list
  // double click , remove from the tag list
  const handleTagButtonClick = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags((prevState) => prevState.filter((id) => id !== tagId));
    } else {
      setSelectedTags((prevState) => [...prevState, tagId]);
    }
  };
  // if next button clicked move to the next tage data
  const handleNextButtonClick = () => {
    // when the user clicks Next, go to dashboard
    const token = localStorage.getItem("token");
    console.log(userinfo);
    const params = new URLSearchParams();
    params.append("token", token);
    console.log(token);

    const selectedPtags = selectedTags.map(
      (id) => tagData.find((tag) => tag.id === id).name
    );
    const tagString = selectedPtags.join(", ");
    console.log(tagString);

    params.append("tag", tagString);

    fetch("${backendurl}/User/Recommend/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })
      .then((response) => {
        // navigate to the next page
        // redirect to preference tag setting
        window.location.href = `/profile/${userinfo.Uid}`;
      })
      .catch((error) => {
        console.error(error);
        // alert(error);
        toast.error("Perference not added!", {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      });
  };

  const handlePrevButtonClick = () => {
    // go to the previous page
    setPage((prevState) => prevState - 1);
  };

  const handleNextPageButtonClick = () => {
    // go to the next page
    setPage((prevState) => prevState + 1);
  };

  // calculate which tags should be shown on the current page
  const startIdx = page * 18;
  const endIdx = Math.min(startIdx + 18, tagData.length);
  const currentPageTags = tagData.slice(startIdx, endIdx);

  return (
    <div className="movie-preference-container">
      <h1 className="movie-preference-title">What's your movie preference?</h1>
      <h1 className="movie-preference-subtitle">Select up to 5 tags</h1>
      <div className="movie-preference-tags">
        {/* show 18 tags on the current page */}
        {currentPageTags.map((tag) => (
          <button
            key={tag.id}
            className={`movie-preference-tag-button ${
              selectedTags.includes(tag.id) && "selected"
            }`}
            onClick={() => handleTagButtonClick(tag.id)}
            disabled={
              selectedTags.length === 5 && !selectedTags.includes(tag.id)
            }
          >
            <span>{tag.name}</span>
          </button>
        ))}
      </div>
      <div className="movie-preference-nav">
        {/* show Previous button on pages 1 and later */}
        {page > 0 && (
          <button
            className="movie-preference-nav-button"
            onClick={handlePrevButtonClick}
          >
            &lt; Prev
          </button>
        )}
        {/* show Next button on pages 1 and 2 */}
        {page < 2 && (
          <button
            className="movie-preference-nav-button"
            onClick={handleNextPageButtonClick}
          >
            Next &gt;
          </button>
        )}
      </div>
      <div className="movie-preference-next">
        <button
          className="movie-preference-next-button"
          onClick={handleNextButtonClick}
        >
          Finish preference setting
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SetPreferenceTag;

// import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Header from "./components/header";
import Registerpage from "./components/registerpage";
import Loginpage from "./components/loginpage";
import SetPreferenceGenre from "./components/prefgenre";
import SetPreferenceTag from "./components/preftag";
import Homepage from "./components/homepage";
import WelcomePage from "./components/welcomePage";
import SearchPage from "./components/searchPage";
import MovieDetail from "./components/movieDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/notFound";
//import ListComment from "./review/listComment";
import ListComment from "./newReview/review";
//import AddComment from "./review/addComment";
import AddComment from "./newReview/writeReview";
import ContactPage from "./components/contactPage";
import Logout from "./components/logoutpage";
import Dashboard from "./components/userdashboard";
import Profile from "./newReview/profile";



function App() {
  return (
    <Router>
      {/* <div className="App">
        <Header /> */}
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/setprefgenre" element={<SetPreferenceGenre />} />
          <Route path="/setpreftag" element={<SetPreferenceTag />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/404" element={<NotFound />} />
          {/* <Route
            path="/movieinfo/:id"
            element={<MovieDetail mid=id />}
          /> */}
          <Route path="/movieinfo/:mid" element={<MovieDetail />} />
          {/* <Route path="/review/:mid" element={<ListComment />} /> */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/comment/list/:mid" element={<ListComment />} />
          <Route path="/comment/add/:mid" element={<AddComment />} />
          <Route path="/profile/:uid" element={<Profile />} />
        </Routes>
      {/* </div> */}
    </Router>
  );
}

export default App;
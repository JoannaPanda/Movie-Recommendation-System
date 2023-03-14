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
import ListComment from "./review/listComment";
import AddComment from "./review/addComment";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route exact path="/" component={index} /> */}
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
          <Route path="/comment/list/:mid" element={<ListComment />} />
          <Route path="/movieinfo/:mid" element={<MovieDetail />} />
          <Route path="/comment/add/:mid" element={<AddComment />} />
          {/*<Route path="/review/:mid" element={<ListComment />} />*/}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

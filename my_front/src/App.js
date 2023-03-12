// import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Header from "./components/header";
import Registerpage from "./components/registerpage";
import Loginpage from "./components/loginpage";
import WelcomePage from "./components/welcomePage";
import SearchPage from "./components/searchPage";
import MovieDetail from "./components/movieDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/notFound";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route exact path="/" component={Home} /> */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/404" element={<NotFound />} />
          {/* <Route
            path="/movieinfo/:id"
            element={<MovieDetail mid=id />}
          /> */}
          <Route path="/movieinfo/:mid" element={<MovieDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

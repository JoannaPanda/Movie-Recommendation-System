// import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Header from "./components/header";
import Registerpage from "./components/registerpage";
import Loginpage from "./components/loginpage";
import SetPreferenceGenre from "./components/prefgenre";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SetPreferenceTag from "./components/preftag";
import Homepage from "./components/homepage";

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Header from "./components/header";
import Registerpage from "./components/registerpage";
import Loginpage from "./components/loginpage";
import ListComment from "./review/listComment";
import AddComment from "./review/addComment";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route exact path="/" component={Home} /> */}
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/comment/list" element={<ListComment />} />
          <Route path="/comment/add" element={<AddComment />} />
          <Route path="/review/:mid" element={<ListComment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

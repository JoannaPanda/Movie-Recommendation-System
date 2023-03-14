import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [userinfo, setUserinfo] = useState(null);

  useEffect(() => {
    const storedUserinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (storedUserinfo) {
      setUserinfo(storedUserinfo);
    }
  }, []);

  const getUsername = () => {
    if (userinfo && userinfo.UserName) {
      return userinfo.UserName;
    } else {
      return "User";
    }
  };
  console.log(userinfo);

  return (
    <div
      style={{
        marginTop: "200px",
        marginLeft: "25%",
        color: "whitesmoke",
        maxWidth: "50%",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h1>{getUsername()}'s Dashboard</h1>
      {userinfo && (
        <div>
          <p>Name: {userinfo.UserName}</p>
          <p>Email: {userinfo.Email}</p>
          <p>Preference: {Object.keys(userinfo.PreferenceModels).join(" ")}</p>
          <p>Click the button below to change Preference.</p>
          <Link to="/setprefgenre" className="login-link">
            <button
              style={{
                backgroundColor: "transparent",
                border: "2px solid white",
                color: "white",
                padding: "12px 20px",
                fontSize: 12,
                borderRadius: 4,
                marginTop: 50,
                cursor: "pointer",
              }}
            >
              CHANGE PREFERENCE →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

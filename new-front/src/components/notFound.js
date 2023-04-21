import React from "react";
// this is a simple page that would be used if there is anuthing unfound
function NotFound() {
  return (
    <div
      style={{
        marginTop: 55,
        textAlign: "center",
        backgroundColor: "#400b0a",
        backgroundSize: `cover`,
        height: "900px",
      }}
    >
      <img src={require("../images/404.png")} alt="404" />
    </div>
  );
}

export default NotFound;

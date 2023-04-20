import React from "react";

function ContactPage() {
  return (
    <div
      style={{
        marginTop: "65",
        backgroundColor: "#400b0a",
        textAlign: "center",
        height: "900px",
      }}
    >
      {/* jus print the imformation about the website */}
      <img src={require("../images/contact.png")} alt="contact" />
    </div>
  );
}

export default ContactPage;

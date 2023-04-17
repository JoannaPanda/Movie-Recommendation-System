import React, { useState, useEffect } from "react";
import axios from "axios";

function UserProfileImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [token, setToken] = useState([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleUploadImage = async () => {
    try {
      const response = await axios.post(
        `http://lbosau.exlb.org:9900/UploadImage/User?token=${token}`,
        selectedImage,
        {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        }
      );

      const responseData = response.data;
      console.log("Image uploaded successfully", responseData);
      alert("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    }
  };

  const handleSelectMethod = (method) => {
    setUploadMethod(method);
  };

  const handleUploadMethod = async () => {
    if (uploadMethod === "local") {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = (event) => {
        setSelectedImage(event.target.files[0]);
        console.log(event.target.files[0]);
      };
      fileInput.click();
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: "30px" }}>Upload Profile Image</h2>
      <button onClick={() => handleSelectMethod("local")}>
        Upload from local
      </button>
      {selectedImage && (
        <div>
          {typeof selectedImage === "string" ? (
            <img src={selectedImage} alt="Profile" />
          ) : (
            <img
              src={URL.createObjectURL(selectedImage)}
              style={{ width: "30px", height: "30px" }}
              alt="Profile"
            />
          )}
          <button onClick={handleUploadImage} style={{ fontSize: "23px" }}>
            Upload
          </button>
        </div>
      )}
      {uploadMethod && (
        <div>
          <button onClick={handleUploadMethod} style={{ fontSize: "23px" }}>
            Select Image
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfileImageUpload;

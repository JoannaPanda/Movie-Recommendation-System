import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserProfileImageUpload(props) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [token, setToken] = useState([]);
  // get the token from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  //
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
      // if get the reponse then save the image
      const responseData = response.data;
      console.log("Image uploaded successfully", responseData);

      toast.success("Image uploaded successfully!", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      props.onImageUpload();
    } catch (error) {
      console.error(error);
      // alert the errors
      toast.error("Error uploading image, please try again!", {
        position: "bottom-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  const handleSelectMethod = (method) => {
    setUploadMethod(method);
  };
  // if the method is local then open the local storage
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
      {/* upload the user image based on its type */}
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
      {/* select the image based on the upload method */}
      {uploadMethod && (
        <div>
          <button onClick={handleUploadMethod} style={{ fontSize: "23px" }}>
            Select Image
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default UserProfileImageUpload;

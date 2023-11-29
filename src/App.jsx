import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Import your custom styles

const compressImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 800; // Set your desired maximum width
        const maxHeight = 600; // Set your desired maximum height
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
          },
          "image/jpeg",
          0.8,
        ); // Adjust the quality as needed (0.8 means 80% quality)
      };
    };

    reader.readAsDataURL(file);
  });
};

const CustomLoader = () => (
  <div className="custom-loader">
    <div className="loader-circle"></div>
    <div className="loader-line-mask">
      <div className="loader-line"></div>
    </div>
    <div className="loader-text">Loading...</div>
  </div>
);

const App = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [apiKey, setApiKey] = useState("hfv1khnr90teta0eoa73blheuc");
  const [apiSecret, setApiSecret] = useState("4epli6g6d2g13rd8t5c2fc1dn4");

  const handleFileChange = async (event) => {
    const compressedFile = await compressImage(event.target.files[0]);
    setFile(compressedFile);
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        alert("Please select a file");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("api_secret", apiSecret);
      formData.append("detect_all_feature_points", true);
      formData.append("attributes", "all");

      const response = await axios.post(
        "https://api.skybiometry.com/fc/faces/detect.json",
        formData,
      );

      setResponse(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error as needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload}>Upload</button>

      {loading && <CustomLoader />}

      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;

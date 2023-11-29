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
    <div className="app-container">
      <h2>HUMAN RACE DETECTOR</h2>
      <div className="buttons">
        <label className="custom-file-input">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          Choose Fhoto
        </label>
        <button className={`upload-button ${file ? "active" : ""}`} onClick={handleUpload}>
          Upload
        </button>
      </div>

      {loading && (
        <div className="loader-container">
          <CustomLoader type="ThreeDots" color="#fff" height={80} width={80} />
          <p>Uploading...</p>
        </div>
      )}

      {file && (
        <div className="image-preview-container">
          <h2>Uploaded Image</h2>
          <img src={URL.createObjectURL(file)} alt="Uploaded" />
        </div>
      )}

      {response && (
        <div className="response-container">
          <h1>Ethnicity</h1>
          <div className="response-content">
            <ul>
              <li>
                White: {response?.photos[0].tags[0].attributes?.ethnicity?.white?.confidence}%
              </li>
              <li>
                Black: {response?.photos[0].tags[0].attributes?.ethnicity?.black?.confidence}%
              </li>
              <li>
                Asian: {response?.photos[0].tags[0].attributes?.ethnicity?.asian?.confidence}%
              </li>
              <li>
                Indian: {response?.photos[0].tags[0].attributes?.ethnicity?.indian?.confidence}%
              </li>
              <li>
                Hispanic: {response?.photos[0].tags[0].attributes?.ethnicity?.hispanic?.confidence}%
              </li>
            </ul>
            <h1>Emotions</h1>
            <ul>
              <li>Smiling: {response?.photos[0].tags[0].attributes?.smiling?.confidence}%</li>
              <li>Mood: {response?.photos[0].tags[0].attributes?.mood?.confidence}%</li>
              <li>Anger: {response?.photos[0].tags[0].attributes?.anger?.confidence}%</li>
              <li>Disgust: {response?.photos[0].tags[0].attributes?.disgust?.confidence}%</li>
              <li>Fear: {response?.photos[0].tags[0].attributes?.fear?.confidence}%</li>
              <li>Hapiness: {response?.photos[0].tags[0].attributes?.hapiness?.confidence}%</li>
              <li>Sadness: {response?.photos[0].tags[0].attributes?.sadness?.confidence}%</li>
              <li>Sursprise {response?.photos[0].tags[0].attributes?.surprise?.confidence}%</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

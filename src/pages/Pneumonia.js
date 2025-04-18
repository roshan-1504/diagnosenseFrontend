import React, { useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

const Pneumonia = () => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setImageName(event.target.files[0]?.name || "");
    setPredictions(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setPredictions(null);

    if (!image) {
      setError("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    setLoading(true);

    try {
      const response = await axios.post("https://diagnosensebackend.onrender.com/predict_pneumonia", formData);
      setPredictions(response.data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error processing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPredictionClass = (result) => {
    return result === "PNEUMONIA" ? "result-positive" : "result-negative";
  };

  const prepareChartData = () => {
    if (!predictions) return [];

    return ["Random Forest", "KNN", "XGBoost"].map((model) => ({
      model,
      PNEUMONIA: predictions[model]["PNEUMONIA"],
      NORMAL: predictions[model]["NORMAL"]
    }));
  };

  const chartData = prepareChartData();

  return (
    <div>
      <h1 className="page-title">Pneumonia Detection</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="file-input-container">
            <label className="file-input-label">
              <div>
                <div className="card-icon">📁</div>
                <div>Drop your chest X-ray image here or click to browse</div>
                {imageName && <div className="file-name">{imageName}</div>}
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="file-input"
              />
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={loading}
          >
            {loading ? "Processing..." : "Analyze X-ray"}
          </button>
        </form>
      </div>

      {error && (
        <div className="results-container">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {predictions && (
        <div className="results-container">
          <h2 className="results-title">Analysis Results</h2>

          {/* Individual Predictions */}
          {["Random Forest", "KNN", "XGBoost"].map((model) => (
            <div key={model} className="prediction-card">
              <h3 className="prediction-title">{model}</h3>
              <div className={`prediction-result ${getPredictionClass(predictions[model].Prediction)}`}>
                {predictions[model].Prediction}
              </div>
              <div className="probability-details">
                Pneumonia: {(predictions[model].PNEUMONIA * 100).toFixed(2)}%
                Normal: {(predictions[model].NORMAL * 100).toFixed(2)}%
              </div>
            </div>
          ))}

          {/* Final Verdict */}
          <div className={`final-verdict ${getPredictionClass(predictions["Majority Vote Result"])}`}>
            Final Diagnosis: {predictions["Majority Vote Result"]}
          </div>

          {/* Bar Chart */}
          <div className="chart-container">
            <h3>Model Confidence (Bar Chart)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="PNEUMONIA" fill="#D2042D" name="PNEUMONIA Confidence" label={{ position: 'top' }} />
                <Bar dataKey="NORMAL" fill="#228B22" name="NORMAL Confidence" label={{ position: 'top' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="chart-container">
            <h3>Model-wise Class Confidence (Radar Chart)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="model" />
                <PolarRadiusAxis />
                <Radar name="PNEUMONIA" dataKey="PNEUMONIA" stroke="#D2042D" fill="#D2042D" fillOpacity={0.6} />
                <Radar name="NORMAL" dataKey="NORMAL" stroke="#228B22" fill="#228B22" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pneumonia;

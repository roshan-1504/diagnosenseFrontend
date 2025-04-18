import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import axios from 'axios';

const ProstateCancerPredictor = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile?.name || "");
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post("https://diagnosensebackend.onrender.com/prostate-cancer", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setResult(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please check your file format.");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (prediction) => {
    return prediction === "Cancer" ? 'result-positive' : 'result-negative';
  };

  const getChartData = () => {
    if (!result) return [];

    return [
      {
        model: "Logistic Regression",
        Cancer: result["Logistic Regression"].Probabilities["Cancer"],
        "Non-Cancer": result["Logistic Regression"].Probabilities["Non-Cancer"]
      },
      {
        model: "XGBoost",
        Cancer: result["XGBoost"].Probabilities["Cancer"],
        "Non-Cancer": result["XGBoost"].Probabilities["Non-Cancer"]
      },
      {
        model: "Random Forest",
        Cancer: result["Random Forest"].Probabilities["Cancer"],
        "Non-Cancer": result["Random Forest"].Probabilities["Non-Cancer"]
      }
    ];
  };

  const getRadarData = () => {
    if (!result) return [];

    return [
      {
        subject: "Logistic Regression",
        Cancer: result["Logistic Regression"].Probabilities["Cancer"] * 100,
        NonCancer: result["Logistic Regression"].Probabilities["Non-Cancer"] * 100,
      },
      {
        subject: "XGBoost",
        Cancer: result["XGBoost"].Probabilities["Cancer"] * 100,
        NonCancer: result["XGBoost"].Probabilities["Non-Cancer"] * 100,
      },
      {
        subject: "Random Forest",
        Cancer: result["Random Forest"].Probabilities["Cancer"] * 100,
        NonCancer: result["Random Forest"].Probabilities["Non-Cancer"] * 100,
      }
    ];
  };

  return (
    <div>
      <h1 className="page-title">Prostate Cancer Prediction</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="file-input-container">
            <label className="file-input-label">
              <div>
                <div className="card-icon">🧬</div>
                <div>Upload Gene Expression CSV File</div>
                {fileName && <div className="file-name">{fileName}</div>}
              </div>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange} 
                className="file-input"
              />
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Processing..." : "Analyze Gene Expression Data"}
          </button>
        </form>
      </div>

      {error && (
        <div className="results-container">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {result && (
        <div className="results-container">
          <h2 className="results-title">Analysis Results</h2>
          
          {["Logistic Regression", "XGBoost", "Random Forest"].map((model, idx) => (
            <div className="prediction-card" key={idx}>
              <h3 className="prediction-title">{model}</h3>
              <div>
                <span className={`prediction-result ${getBadgeClass(result[model].Prediction)}`}>
                  {result[model].Prediction}
                </span>
              </div>
              <div className="probability-details">
                <div>Non-Cancer: {(result[model].Probabilities["Non-Cancer"] * 100).toFixed(2)}%</div>
                <div>Cancer: {(result[model].Probabilities["Cancer"] * 100).toFixed(2)}%</div>
              </div>
            </div>
          ))}

          <div className={`final-verdict ${getBadgeClass(result["Majority Vote Result"])}`}>
            Final Diagnosis: {result["Majority Vote Result"]}
          </div>

          <div className="chart-container">
            <h2 className="results-title">Model Prediction Probabilities</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Non-Cancer" fill="#228B22" />
                <Bar dataKey="Cancer" fill="#D2042D" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container" style={{ marginTop: '2rem' }}>
            <h2 className="results-title">Radar Chart Comparison</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={getRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Cancer" dataKey="Cancer" stroke="#D2042D" fill="#D2042D" fillOpacity={0.6} />
                <Radar name="Non-Cancer" dataKey="NonCancer" stroke="#228B22" fill="#228B22" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProstateCancerPredictor;

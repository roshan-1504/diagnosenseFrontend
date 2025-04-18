import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import axios from "axios";


const ChronicKidney = () => {
  const [formData, setFormData] = useState({
    sg: "1.020",
    al: "0",
    sc: "1.2",
    bu: "15.0",
    hemo: "14.5",
    bgr: "100",
    htn: "no",
    dm: "no",
    pc: "normal"
  });

  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [responseDetails, setResponseDetails] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setResponseDetails(null);

    try {
      // Convert string inputs to appropriate numeric types
      const processedData = {
        sg: parseFloat(formData.sg),
        al: parseInt(formData.al),
        sc: parseFloat(formData.sc),
        bu: parseFloat(formData.bu),
        hemo: parseFloat(formData.hemo),
        bgr: parseFloat(formData.bgr),
        htn: formData.htn,
        dm: formData.dm,
        pc: formData.pc
      };

      console.log("Sending data:", processedData);

      const response = await axios.post("https://diagnosensebackend.onrender.com/predict_ckd", processedData);
      console.log("Response received:", response.data);
      
      if (response.data.status === "success") {
        setPredictions(response.data);
      } else {
        setError(`Server returned an error: ${response.data.message}`);
        setResponseDetails(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(`Error: ${error.message}`);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error response data:", error.response.data);
        console.log("Error response status:", error.response.status);
        setResponseDetails(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (prediction) => {
    return prediction === "There is a high risk of Chronic Kidney Disease" ? 'result-positive' : 'result-negative';
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Chronic Kidney Disease Prediction</h1>

      <div className="card p-4 mb-5 shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Specific Gravity (sg)</label>
              <input
                type="number"
                step="0.001"
                name="sg"
                className="form-control"
                placeholder="e.g., 1.020"
                value={formData.sg}
                onChange={handleChange}
                required
              />
              <small className="text-muted">Range: 1.005–1.030</small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Albumin Level (al)</label>
              <select
                name="al"
                className="form-control"
                value={formData.al}
                onChange={handleChange}
                required
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <small className="text-muted">Range: 0–5 (0 = normal, 5 = high)</small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Serum Creatinine (sc)</label>
              <input
                type="number"
                step="0.1"
                name="sc"
                className="form-control"
                placeholder="e.g., 1.2"
                value={formData.sc}
                onChange={handleChange}
                required
              />
              <small className="text-muted">Range: 0.6–1.2 mg/dL</small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Blood Urea (bu)</label>
              <input
                type="number"
                step="0.1"
                name="bu"
                className="form-control"
                placeholder="e.g., 18"
                value={formData.bu}
                onChange={handleChange}
                required
              />
              <small className="text-muted">Range: 7–20 mg/dL</small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Hemoglobin (hemo)</label>
              <input
                type="number"
                step="0.1"
                name="hemo"
                className="form-control"
                placeholder="e.g., 14.5"
                value={formData.hemo}
                onChange={handleChange}
                required
              />
              <small className="text-muted">Range: 12–18 g/dL</small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Blood Glucose Random (bgr)</label>
              <input
                type="number"
                step="1"
                name="bgr"
                className="form-control"
                placeholder="e.g., 100"
                value={formData.bgr}
                onChange={handleChange}
                required
              />
              <small className="text-muted">Range: 70–140 mg/dL fasting</small>
            </div>

            <div className="col-md-4">
              <label className="form-label">Hypertension (htn)</label>
              <select 
                name="htn" 
                className="form-control" 
                value={formData.htn}
                onChange={handleChange} 
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <small className="text-muted">Presence of hypertension</small>
            </div>

            <div className="col-md-4">
              <label className="form-label">Diabetes Mellitus (dm)</label>
              <select 
                name="dm" 
                className="form-control"
                value={formData.dm}
                onChange={handleChange} 
                required
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <small className="text-muted">Presence of diabetes</small>
            </div>

            <div className="col-md-4">
              <label className="form-label">Pus Cell (pc)</label>
              <select 
                name="pc" 
                className="form-control"
                value={formData.pc}
                onChange={handleChange} 
                required
              >
                <option value="normal">Normal</option>
                <option value="abnormal">Abnormal</option>
              </select>
              <small className="text-muted">Presence of pus cells in urine</small>
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Processing..." : "Analyze"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && (
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          {responseDetails && (
            <pre className="mt-3 p-3 bg-light">
              {JSON.stringify(responseDetails, null, 2)}
            </pre>
          )}
        </div>
      )}

      {predictions && (
        <div className="results-container">
          <h2 className="results-title">Analysis Results</h2>

          {Object.entries(predictions.predictions)
          .filter(([key]) => key !== "Majority Vote Result")
          .map(([modelName, result], idx) => (
            <div className="prediction-card" key={idx}>
              <h3 className="prediction-title">{modelName}</h3>
              <div>
                <span className={`prediction-result ${getBadgeClass(result.prediction)}`}>
                  {result.prediction}
                </span>
              </div>
              <div className="probability-details">
                <div>CKD: {(result.probability_ckd * 100).toFixed(2)}%</div>
                <div>No CKD: {((1 - result.probability_ckd) * 100).toFixed(2)}%</div>
              </div>
            </div>
        ))}


        <div className={`final-verdict ${getBadgeClass(predictions.predictions["Majority Vote Result"])}`}>
          Final Diagnosis: {predictions.predictions["Majority Vote Result"]}
        </div>


          <div className="chart-container">
            <h2 className="results-title">Model Prediction Probabilities</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={["Logistic Regression", "XGBoost", "Random Forest"].map(model => ({
                  model,
                  CKD: (predictions.predictions[model].probability_ckd * 100).toFixed(2),
                  NoCKD: ((1 - predictions.predictions[model].probability_ckd) * 100).toFixed(2)
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="NoCKD" fill="#228B22" />
                <Bar dataKey="CKD" fill="#D2042D" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container" style={{ marginTop: '2rem' }}>
            <h2 className="results-title">Radar Chart Comparison</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart
                data={["Logistic Regression", "XGBoost", "Random Forest"].map(model => ({
                  subject: model,
                  CKD: (predictions.predictions[model].probability_ckd * 100).toFixed(2),
                  NonCKD: ((1 - predictions.predictions[model].probability_ckd) * 100).toFixed(2)
                }))}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="CKD" dataKey="CKD" stroke="#D2042D" fill="#D2042D" fillOpacity={0.6} />
                <Radar name="No CKD" dataKey="NonCKD" stroke="#228B22" fill="#228B22" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChronicKidney;

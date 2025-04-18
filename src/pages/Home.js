import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
              
          </h1>
          <h2 className="hero-subtitle">
            AI-Powered Health Diagnostics
          </h2>
          <p className="hero-description">
            Empowering early disease detection through artificial intelligence
          </p>
          <div className="hero-buttons">
            <a href="#predictors" className="primary-button">Explore Predictors</a>
            <a href="#about" className="secondary-button">Learn More</a>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="section-container">
          <h2 className="section-title">About Diagnosense</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                Diagnosense is an AI-powered platform designed to assist with early disease detection 
                through simple, user-friendly interfaces. By allowing users to input clinical or diagnostic 
                data manually, our microservice-based system delivers accurate predictions for multiple 
                health conditions—helping users take proactive steps in their healthcare journey.
              </p>
              <p>
                Our platform leverages machine learning algorithms to analyze various types of medical data, 
                including images, clinical markers, and genetic information, to provide rapid and accurate 
                disease predictions. While our tools are designed to assist healthcare professionals, they 
                can also empower individuals to take control of their health through early detection.
              </p>
            </div>
            <div className="about-features">
              <div className="feature">
                <div className="feature-icon">🔍</div>
                <h3>Early Detection</h3>
                <p>Identify potential health issues before symptoms become severe</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🧠</div>
                <h3>AI-Powered</h3>
                <p>Advanced machine learning models trained on extensive medical datasets</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🔒</div>
                <h3>Private</h3>
                <p>Your data stays on your device</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🌐</div>
                <h3>24/7 Access</h3>
                <p>Access your health data anytime, anywhere across devices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="predictors" className="predictors-section">
        <div className="section-container">
          <h2 className="section-title">Disease Predictors</h2>
          <p className="section-description">
            Explore our specialized diagnostic tools designed to predict various health conditions
            using cutting-edge machine learning techniques.
          </p>
          
          <div className="cards-container">
            <Link to="/pneumonia" className="diagnostic-card pneumonia-card">
              <div className="card-header">
                <div className="card-icon">🫁</div>
                <h3>Pneumonia Detection</h3>
              </div>
              <div className="card-body">
                <p>Upload chest X-rays for AI-powered pneumonia diagnosis</p>
              </div>
            </Link>
            
            <Link to="/prostate-cancer" className="diagnostic-card prostate-card">
              <div className="card-header">
                <div className="card-icon">🧬</div>
                <h3>Prostate Cancer</h3>
              </div>
              <div className="card-body">
                <p>Analyze gene expression data to detect prostate cancer</p>
              </div>
            </Link>
            
            <Link to="/chronic-kidney" className="diagnostic-card kidney-card">
              <div className="card-header">
                <div className="card-icon">🦠</div>
                <h3>Chronic Kidney Disease</h3>
              </div>
              <div className="card-body">
                <p>Predict chronic kidney disease from clinical markers</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
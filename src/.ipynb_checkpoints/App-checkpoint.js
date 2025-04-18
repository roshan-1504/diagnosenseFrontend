import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Pneumonia from "./pages/Pneumonia";
import ProstateCancer from "./pages/ProstateCancer";
import ChronicKidney from "./pages/ChronicKidney";
import "./App.css";


import ScrollToTop from "./ScrollToTop";



function App() {
  useEffect(() => {
    // Handle hash links for smooth scrolling
    const handleHashLinkClick = (event) => {
      const href = event.target.getAttribute('href');
      
      // Only process hash links that start with #
      if (href && href.startsWith('#')) {
        event.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for header height
            behavior: "smooth"
          });
        }
      }
      // For links that start with /# (home page hash links)
      else if (href && href.startsWith('/#')) {
        event.preventDefault();
        
        // If we're already on home page
        if (window.location.pathname === '/') {
          const targetId = href.substring(2);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: "smooth"
            });
          }
        } 
        // If we're on another page, navigate to home page with hash
        else {
          window.location.href = href;
        }
      }
    };

    // Add event listeners to hash links
    const hashLinks = document.querySelectorAll('a[href^="#"], a[href^="/#"]');
    hashLinks.forEach(link => {
      link.addEventListener('click', handleHashLinkClick);
    });

    return () => {
      hashLinks.forEach(link => {
        link.removeEventListener('click', handleHashLinkClick);
      });
    };
  }, []);

  return (
    <Router>
      <ScrollToTop /> {/* <-- This line does the magic */}

      <div className="app-container">
        <header className="header">
          <nav className="navbar">
            <Link to="/#home" className="navbar-brand">
              <span className="brand-highlight">Diagnosense</span>
            </Link>
            <div className="nav-links">
              <a href="/#home" className="nav-link">Home</a>
              <a href="/#about" className="nav-link">About</a>
              <a href="/#predictors" className="nav-link">Disease Predictors</a>
            </div>
          </nav>
        </header>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pneumonia" element={<Pneumonia />} />
            <Route path="/prostate-cancer" element={<ProstateCancer />} />
            <Route path="/chronic-kidney" element={<ChronicKidney />} />
          </Routes>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Diagnosense</h3>
              <p>A Microservice-Based ML Framework for Predictive Health Diagnostics</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/#home">Home</a></li>
                <li><a href="/#about">About</a></li>
                <li><a href="/#predictors">Disease Predictors</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><Link to="">Privacy Policy</Link></li>
                <li><Link to="">Terms of Service</Link></li>
                <li><Link to="">Medical Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} Diagnosense. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
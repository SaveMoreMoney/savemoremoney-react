import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './FinancialSnapshot.css';

const FinancialSnapshot = ({ articles }) => {
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipRate, setSipRate] = useState(12);
  const [sipResult, setSipResult] = useState(null);
  const [showSipResult, setShowSipResult] = useState(false);

  const calculateSIP = (e) => {
    e.preventDefault();
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const futureValue = sipAmount * ((((1 + monthlyRate) ** months) - 1) / monthlyRate) * (1 + monthlyRate);
    setSipResult(Math.round(futureValue));
    setShowSipResult(true);
  };

  const closeSipResult = () => {
    setShowSipResult(false);
  };

  const trendingArticle = articles && articles.length > 0 
    ? articles[Math.floor(Math.random() * articles.length)] 
    : null;

  const extractExcerpt = (htmlContent, maxLength = 120) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <section className="financial-snapshot-grid">
      {/* SIP Calculator Card - Moved to the left */}
      <div className="snapshot-card sip-calculator">
        <h3>Quick SIP Calculator</h3>
        <form onSubmit={calculateSIP} className="sip-form">
          <div className="form-group">
            <label>Monthly Investment (₹)</label>
            <input 
              type="number" 
              value={sipAmount} 
              onChange={(e) => setSipAmount(e.target.value)}
              min="500"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Years</label>
              <input 
                type="number" 
                value={sipYears} 
                onChange={(e) => setSipYears(e.target.value)}
                min="1"
                max="50"
              />
            </div>
            <div className="form-group">
              <label>Return (%)</label>
              <input 
                type="number" 
                value={sipRate} 
                onChange={(e) => setSipRate(e.target.value)}
                min="1"
                max="30"
              />
            </div>
          </div>
          <button type="submit" className="calc-btn">Calculate Returns</button>
        </form>
        
        {showSipResult && (
          <div className="sip-overlay">
            <div className="sip-overlay-content">
              <button className="close-overlay-btn" onClick={closeSipResult}>✕</button>
              <h4>Projected Value</h4>
              <div className="result-value">₹ {sipResult.toLocaleString('en-IN')}</div>
              <div className="result-details">
                <p>Invested: ₹ {(sipAmount * sipYears * 12).toLocaleString('en-IN')}</p>
                <p>Returns: ₹ {(sipResult - (sipAmount * sipYears * 12)).toLocaleString('en-IN')}</p>
              </div>
              <button className="recalc-btn" onClick={closeSipResult}>Recalculate</button>
            </div>
          </div>
        )}
      </div>

      {/* Youtube Explore Card - Increased size and improved */}
      <a href="https://www.youtube.com/@savemoremoney-nishant/" target="_blank" rel="noopener noreferrer" className="snapshot-card youtube-card">
        <div className="youtube-content">
          <div className="youtube-header">
            <img 
              src="https://ui-avatars.com/api/?name=Nishant+Gupta&background=ff0000&color=fff&size=128&font-size=0.5" 
              alt="SaveMoreMoney Nishant" 
              className="youtube-avatar"
            />
            <div className="youtube-info">
              <h3>SaveMoreMoney - Nishant</h3>
              <span className="youtube-sub-text">Subscribe for Financial Wisdom</span>
            </div>
          </div>
          <p>Watch expert financial advice, tips, and strategies on our channel.</p>
          <span className="visit-channel-btn">
            <span className="play-icon">▶</span> Visit Channel
          </span>
        </div>
      </a>

      {/* Instagram Card */}
      <a href="https://instagram.com/savemoremoney.in" target="_blank" rel="noopener noreferrer" className="snapshot-card instagram-card">
        <div className="instagram-content">
          <div className="instagram-header">
            <div className="instagram-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="currentColor" height="2rem" width="2rem" className="instagram-icon"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
            </div>
            <div className="instagram-info">
              <h3>@savemoremoney.in</h3>
              <span className="instagram-sub-text">Join our community</span>
            </div>
          </div>
          <p>Get daily bite-sized financial tips, hacks, and updates on your feed.</p>
          <span className="visit-instagram-btn">
            Follow Us
          </span>
        </div>
      </a>
    </section>
  );
};

export default FinancialSnapshot;
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

  const extractExcerpt = (htmlContent, maxLength = 80) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <section className="financial-snapshot-grid">
      {/* SIP Calculator Card */}
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

      {/* Youtube Explore Card */}
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

      {/* Trending Now Card */}
      <div className="snapshot-card trending-now horizontal">
        {trendingArticle ? (
          <div className="trending-content">
            {trendingArticle.image_url && (
              <img src={trendingArticle.image_url} alt={trendingArticle.title} className="trending-img" />
            )}
            <div className="trending-text">
              <h3>Trending Now 🔥</h3>
              <h4>{trendingArticle.title}</h4>
              <p className="trending-excerpt">{extractExcerpt(trendingArticle.content)}</p>
              <Link to={`/${trendingArticle.slug}`} className="read-now-btn">Read Now →</Link>
            </div>
          </div>
        ) : (
          <p>Loading trending content...</p>
        )}
      </div>
    </section>
  );
};

export default FinancialSnapshot;

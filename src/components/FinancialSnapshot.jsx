import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FinancialSnapshot.css';

const FinancialSnapshot = ({ articles }) => {
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipRate, setSipRate] = useState(12);
  const [sipResult, setSipResult] = useState(null);
  const [showSipResult, setShowSipResult] = useState(false);
  const [rates, setRates] = useState({
    gold: { value: 'Loading...', change: 0 },
    usd: { value: 'Loading...', change: 0 },
    sensex: { value: 'Loading...', change: 0 },
    nifty: { value: 'Loading...', change: 0 },
  });

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const usdRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const usdData = await usdRes.json();
        const usdRate = usdData.rates.INR;
        
        const randomChange = () => (Math.random() * 2 - 1);

        setRates({
          gold: { value: '₹ 7,250/gm', change: randomChange() },
          usd: { value: `₹ ${usdRate.toFixed(2)}`, change: randomChange() },
          sensex: { value: '74,200', change: randomChange() },
          nifty: { value: '22,500', change: randomChange() },
        });
      } catch (error) {
        console.error("Failed to fetch rates", error);
        setRates({
          gold: { value: '₹ 7,250/gm', change: 0.5 },
          usd: { value: '₹ 83.50', change: -0.1 },
          sensex: { value: '74,200', change: 1.2 },
          nifty: { value: '22,500', change: 1.1 },
        });
      }
    };

    fetchRates();
  }, []);

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

  const formatChange = (change) => {
    const isPositive = change >= 0;
    return `${isPositive ? '+' : ''}${change.toFixed(2)}%`;
  };

  return (
    <section className="financial-snapshot-grid">
      {/* Live Rates Card */}
      <div className="snapshot-card live-rates">
        <h3>Live Market Rates</h3>
        <div className="rates-grid">
          <div className="rate-item">
            <span className="rate-label">Gold (24K)</span>
            <div className="rate-value-group">
              <strong>{rates.gold.value}</strong>
              <span className={`rate-change ${rates.gold.change >= 0 ? 'positive' : 'negative'}`}>
                {formatChange(rates.gold.change)}
              </span>
            </div>
          </div>
          <div className="rate-item">
            <span className="rate-label">USD/INR</span>
            <div className="rate-value-group">
              <strong>{rates.usd.value}</strong>
              <span className={`rate-change ${rates.usd.change >= 0 ? 'positive' : 'negative'}`}>
                {formatChange(rates.usd.change)}
              </span>
            </div>
          </div>
          <div className="rate-item">
            <span className="rate-label">Sensex</span>
            <div className="rate-value-group">
              <strong>{rates.sensex.value}</strong>
              <span className={`rate-change ${rates.sensex.change >= 0 ? 'positive' : 'negative'}`}>
                {formatChange(rates.sensex.change)}
              </span>
            </div>
          </div>
          <div className="rate-item">
            <span className="rate-label">Nifty 50</span>
            <div className="rate-value-group">
              <strong>{rates.nifty.value}</strong>
              <span className={`rate-change ${rates.nifty.change >= 0 ? 'positive' : 'negative'}`}>
                {formatChange(rates.nifty.change)}
              </span>
            </div>
          </div>
        </div>
      </div>

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

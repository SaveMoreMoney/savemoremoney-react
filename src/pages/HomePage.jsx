import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import { getCachedData, setCachedData } from '../utils/storage';
import FinancialSnapshot from '../components/FinancialSnapshot';
import './HomePage.css';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const cachedArticles = getCachedData('articles');

      if (cachedArticles) {
        setArticles(cachedArticles);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'publish')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
      } else {
        setArticles(data);
        setCachedData('articles', data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>SaveMoreMoney.in - Your Financial Wisdom Hub</title>
          <meta name="description" content="Expert financial advice, money-saving tips, and investment strategies to help you build wealth." />
        </Helmet>
        <div className="loader">Loading articles...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>SaveMoreMoney.in - Your Financial Wisdom Hub</title>
        </Helmet>
        <div className="error-message">{error}</div>
      </>
    );
  }

  const featuredArticle = articles.find(a => a.slug.includes('singapore'));
  const otherArticles = articles.filter(a => a.id !== (featuredArticle && featuredArticle.id)).slice(0, 2);

  return (
    <>
      <Helmet>
        <title>SaveMoreMoney.in - Your Financial Wisdom Hub</title>
        <meta name="description" content="Expert financial advice, money-saving tips, and investment strategies to help you build wealth." />
        <meta property="og:title" content="SaveMoreMoney.in - Your Financial Wisdom Hub" />
        <meta property="og:description" content="Expert financial advice, money-saving tips, and investment strategies." />
      </Helmet>
      
      <div className="home-page">
        <section className="home-hero">
          <div className="home-hero-content">
            <h1>💰 Master Your Money</h1>
            <p>
              Expert financial advice, proven strategies, and actionable tips to help you 
              save more, invest smarter, and build lasting wealth.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">{articles.length}+</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Readers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5+</span>
                <span className="stat-label">Years of Exp</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free</span>
              </div>
            </div>
          </div>
        </section>

        <FinancialSnapshot articles={articles} />

        <section className="latest-insights-section">
          <div className="section-header">
            <h2>Latest Financial Insights</h2>
            <p>Stay updated with the latest tips and strategies to grow your wealth</p>
          </div>

          {articles.length > 0 ? (
            <div className="bento-grid">
              {featuredArticle && (
                <Link to={`/${featuredArticle.slug}`} className="bento-box featured">
                  {featuredArticle.image_url ? (
                    <img src={featuredArticle.image_url} alt={featuredArticle.title} />
                  ) : (
                    <div className="bento-placeholder"></div>
                  )}
                  <div className="bento-content">
                    <span className="bento-badge">New</span>
                    <h3>{featuredArticle.title}</h3>
                    <div className="bento-meta">
                      <span className="bento-date">{formatDate(featuredArticle.created_at)}</span>
                      <span className="bento-stats">
                        {featuredArticle.views || 0} views • {featuredArticle.likes || 0} likes
                      </span>
                    </div>
                  </div>
                </Link>
              )}
              {otherArticles.map(article => (
                <Link to={`/${article.slug}`} key={article.id} className="bento-box">
                  {article.image_url ? (
                    <img src={article.image_url} alt={article.title} />
                  ) : (
                    <div className="bento-placeholder"></div>
                  )}
                  <div className="bento-content">
                    <h3>{article.title}</h3>
                    <div className="bento-meta">
                      <span className="bento-date">{formatDate(article.created_at)}</span>
                      <span className="bento-stats">
                        {article.views || 0} views
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No Articles Yet</h3>
              <p>Check back soon for expert financial advice and money-saving tips!</p>
            </div>
          )}
          <div className="explore-more">
            <Link to="/articles" className="explore-btn">Explore All Articles</Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;

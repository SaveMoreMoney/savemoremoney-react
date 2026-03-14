import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import { getCachedData, setCachedData } from '../utils/storage';
import { extractExcerpt, decodeHTMLEntities } from '../utils/textUtils';
import FinancialSnapshot from '../components/FinancialSnapshot';
import HeroAnimation from '../components/HeroAnimation';
import './HomePage.css';

const CATEGORIES = ['Latest', 'Personal Finance', 'General', 'Investing', 'Credit Cards', 'Travel', 'Insurance', 'Tax', 'Other'];

const HomePage = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [displayArticles, setDisplayArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Latest');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const cachedArticles = getCachedData('articles');

      if (cachedArticles) {
        setAllArticles(cachedArticles);
        setDisplayArticles(cachedArticles);
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
        setAllArticles(data);
        setDisplayArticles(data);
        setCachedData('articles', data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (activeCategory === 'Latest') {
      setDisplayArticles(allArticles);
    } else {
      const filtered = allArticles.filter(article => 
        article.category === activeCategory || 
        (activeCategory === 'Other' && !CATEGORIES.includes(article.category) && article.category !== 'Latest')
      );
      setDisplayArticles(filtered);
    }
  }, [activeCategory, allArticles]);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (showAnimation) {
    return <HeroAnimation onComplete={handleAnimationComplete} articleCount={allArticles.length} loading={loading} />;
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

  let featuredArticle = null;
  let otherArticles = [];

  if (displayArticles.length > 0) {
    if (activeCategory === 'Latest') {
      featuredArticle = displayArticles.find(a => a.slug.includes('singapore')) || displayArticles[0];
    } else {
      featuredArticle = displayArticles[0];
    }
    
    otherArticles = displayArticles.filter(a => a.id !== (featuredArticle && featuredArticle.id)).slice(0, 2);
  }

  return (
    <>
      <Helmet>
        <title>SaveMoreMoney.in - Your Financial Wisdom Hub</title>
        <meta name="description" content="Expert financial advice, money-saving tips, and investment strategies to help you build wealth." />
        <meta property="og:title" content="SaveMoreMoney.in - Your Financial Wisdom Hub" />
        <meta property="og:description" content="Expert financial advice, money-saving tips, and investment strategies." />
      </Helmet>
      
      <div className="home-page fade-in-up">
        {/* Latest Financial Insights Section - Moved to top */}
        <section className="latest-insights-section">
          <div className="section-header">
            <h2>Financial Insights</h2>
            <p>Stay updated with the latest tips and strategies to grow your wealth</p>
          </div>

          {/* Category Filter */}
          <div className="category-filter-container">
            <div className="category-filter">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {displayArticles.length > 0 ? (
            <div className="bento-grid">
              {featuredArticle && (
                <Link to={`/${featuredArticle.slug}`} className={`bento-box featured ${displayArticles.length === 1 ? 'full-width' : ''}`}>
                  {featuredArticle.image_url ? (
                    <img src={featuredArticle.image_url} alt={featuredArticle.title} />
                  ) : (
                    <div className="bento-placeholder">📊</div>
                  )}
                  <div className="bento-content">
                    {activeCategory === 'Latest' && <span className="bento-badge">New</span>}
                    <h3>{decodeHTMLEntities(featuredArticle.title)}</h3>
                    <p className="bento-excerpt">{featuredArticle.excerpt ? extractExcerpt(featuredArticle.excerpt, 120) : extractExcerpt(featuredArticle.content, 120)}</p>
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
                    <div className="bento-placeholder">📊</div>
                  )}
                  <div className="bento-content">
                    <h3>{decodeHTMLEntities(article.title)}</h3>
                    <p className="bento-excerpt">{article.excerpt ? extractExcerpt(article.excerpt, 80) : extractExcerpt(article.content, 80)}</p>
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
              <div className="empty-state-icon">🔍</div>
              <h3>No Articles Found</h3>
              <p>We haven't published any articles in the "{activeCategory}" category yet.</p>
              <button className="explore-btn" onClick={() => setActiveCategory('Latest')} style={{marginTop: '1rem'}}>
                View Latest Articles
              </button>
            </div>
          )}
          <div className="explore-more">
            <Link to="/articles" className="explore-btn outline">Explore All Articles</Link>
          </div>
        </section>

        {/* Financial Snapshot Section */}
        <FinancialSnapshot articles={allArticles} />

      </div>
    </>
  );
};

export default HomePage;

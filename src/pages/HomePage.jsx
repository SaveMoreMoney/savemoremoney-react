import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import './HomePage.css';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles. Please try again later.');
      } else {
        setArticles(data);
      }
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // Helper function to extract text from HTML content
  const extractExcerpt = (htmlContent, maxLength = 150) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Helper function to get author initials
  const getAuthorInitials = (name) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
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

  return (
    <>
      <Helmet>
        <title>SaveMoreMoney.in - Your Financial Wisdom Hub</title>
        <meta name="description" content="Expert financial advice, money-saving tips, and investment strategies to help you build wealth." />
        <meta property="og:title" content="SaveMoreMoney.in - Your Financial Wisdom Hub" />
        <meta property="og:description" content="Expert financial advice, money-saving tips, and investment strategies." />
      </Helmet>
      
      <div className="home-page">
        {/* Hero Section */}
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
                <span className="stat-number">100%</span>
                <span className="stat-label">Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section>
          <div className="section-header">
            <h2>Latest Financial Insights</h2>
            <p>Stay updated with the latest tips and strategies to grow your wealth</p>
          </div>

          {articles.length > 0 ? (
            <div className="articles-grid">
              {articles.map(article => (
                <Link to={`/${article.slug}`} key={article.id} className="article-card">
                  <div className="article-card-image">
                    {article.image_url ? (
                      <img src={article.image_url} alt={article.title} />
                    ) : (
                      <span>📊</span>
                    )}
                  </div>
                  <div className="card-content">
                    {article.category && (
                      <span className="card-category">{article.category}</span>
                    )}
                    <h2>{article.title}</h2>
                    <p className="card-excerpt">
                      {extractExcerpt(article.content)}
                    </p>
                    <div className="card-footer">
                      <div className="card-author">
                        <div className="author-avatar">
                          {getAuthorInitials(article.author_name || 'Mausaji')}
                        </div>
                        <span>{article.author_name || 'Mausaji'}</span>
                      </div>
                      <span className="card-date">{formatDate(article.created_at)}</span>
                    </div>
                    <span className="read-more">
                      Read Article <span>→</span>
                    </span>
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
        </section>
      </div>
    </>
  );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import { getCachedData, setCachedData } from '../utils/storage';
import './ArticlesPage.css';

const ArticlesPage = () => {
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
        .eq('is_published', true)
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

  const extractExcerpt = (htmlContent, maxLength = 100) => {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loader">Loading articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>All Articles | SaveMoreMoney.in</title>
        <meta name="description" content="Browse all articles on financial advice, money-saving tips, and investment strategies." />
      </Helmet>
      <div className="articles-page container">
        <div className="section-header">
          <h1>All Articles</h1>
          <p>Your complete guide to financial wisdom. Dive in!</p>
        </div>
        
        <div className="all-articles-grid">
          {articles.map(article => (
            <Link to={`/${article.slug}`} key={article.id} className="article-list-item">
              <div className="list-item-image-wrapper">
                {article.image_url ? (
                  <img src={article.image_url} alt={article.title} className="list-item-image" />
                ) : (
                  <div className="list-item-placeholder">📊</div>
                )}
              </div>
              <div className="list-item-content">
                {article.category && <span className="list-item-category">{article.category}</span>}
                <h2>{article.title}</h2>
                <p>{extractExcerpt(article.content)}</p>
                <span className="list-item-date">{formatDate(article.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default ArticlesPage;

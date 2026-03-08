import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './HomePage.css';
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
        .select('id, title, slug, snippet') // Assuming you have a 'snippet' column for previews
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

  if (loading) {
    return <div className="loader">Loading articles...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Latest Articles</h1>
        <p>Your daily dose of financial wisdom.</p>
      </header>
      <div className="articles-grid">
        {articles.length > 0 ? (
          articles.map(article => (
            <Link to={`/${article.slug}`} key={article.id} className="article-card">
              <div className="card-content">
                <h2>{article.title}</h2>
                <p>{article.snippet || 'Click to read more...'}</p>
                <span className="read-more">Read Article &rarr;</span>
              </div>
            </Link>
          ))
        ) : (
          <p>No articles found. Check back soon!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;

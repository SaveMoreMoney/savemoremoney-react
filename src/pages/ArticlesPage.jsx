import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import { getCachedData, setCachedData } from '../utils/storage';
import './ArticlesPage.css';

const ARTICLES_PER_PAGE = 9;

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      
      // Try to get cached articles first
      // Note: For pagination, caching all articles might be heavy if there are thousands.
      // But for a blog with < 1000 articles, it's fine to fetch all and paginate client-side for speed
      // or implement server-side pagination. Here we'll stick to client-side pagination for simplicity with existing cache logic.
      
      let allArticles = getCachedData('articles');

      if (!allArticles) {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'publish')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching articles:', error);
          setError('Failed to load articles. Please try again later.');
          setLoading(false);
          return;
        } else {
          allArticles = data;
          setCachedData('articles', data);
        }
      }

      setTotalPages(Math.ceil(allArticles.length / ARTICLES_PER_PAGE));
      
      // Slice articles for current page
      const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
      const endIndex = startIndex + ARTICLES_PER_PAGE;
      setArticles(allArticles.slice(startIndex, endIndex));
      
      setLoading(false);
      window.scrollTo(0, 0);
    };

    fetchArticles();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

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
                <div className="list-item-top">
                  {article.category && <span className="list-item-category">{article.category}</span>}
                  <div className="list-item-stats">
                    <span>👁️ {article.views || 0}</span>
                    <span>❤️ {article.likes || 0}</span>
                  </div>
                </div>
                <h2>{article.title}</h2>
                <p>{article.excerpt || extractExcerpt(article.content)}</p>
                <span className="list-item-date">{formatDate(article.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-btn" 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ArticlesPage;

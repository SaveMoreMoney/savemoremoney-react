import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import { getCachedData, setCachedData } from '../utils/storage';
import './ArticlesPage.css';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [totalPages, setTotalPages] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(9); // Default to 3 columns

  // Determine articles per page based on screen width
  useEffect(() => {
    const updateArticlesPerPage = () => {
      const width = window.innerWidth;
      // Based on minmax(300px, 1fr) and some padding/gap assumptions
      // Container max-width is 1400px
      if (width > 1250) {
        setArticlesPerPage(8); // 4 columns * 2 rows
      } else if (width > 950) {
        setArticlesPerPage(9); // 3 columns * 3 rows
      } else {
        setArticlesPerPage(8); // 2 columns * 4 rows or 1 column * 8 rows
      }
    };

    updateArticlesPerPage();
    window.addEventListener('resize', updateArticlesPerPage);
    return () => window.removeEventListener('resize', updateArticlesPerPage);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      
      let fetchedArticles = getCachedData('articles');

      if (!fetchedArticles) {
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
          fetchedArticles = data;
          setCachedData('articles', data);
        }
      }

      setAllArticles(fetchedArticles);
      setLoading(false);
    };

    fetchArticles();
  }, []);

  // Handle pagination whenever page, articles, or articlesPerPage changes
  useEffect(() => {
    if (allArticles.length === 0) return;

    setTotalPages(Math.ceil(allArticles.length / articlesPerPage));
    
    // Slice articles for current page
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    setArticles(allArticles.slice(startIndex, endIndex));
    
    window.scrollTo(0, 0);
  }, [currentPage, allArticles, articlesPerPage]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const extractExcerpt = (htmlContent, maxLength = 100) => {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get text content (handles entities mostly automatically in browser DOM)
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Explicitly decode some common entities if browser DOM doesn't catch them all from innerHTML source
    const decodeEntities = (str) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = str;
      return textarea.value;
    };
    
    text = decodeEntities(text);

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
                <p>{article.excerpt ? extractExcerpt(article.excerpt) : extractExcerpt(article.content)}</p>
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

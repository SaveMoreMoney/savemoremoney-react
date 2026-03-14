import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import { getCachedData, setCachedData } from '../utils/storage';
import { decodeHTMLEntities, extractExcerpt } from '../utils/textUtils';
import './ArticlesPage.css';

const CATEGORIES = ['All', 'Personal Finance', 'General', 'Investing', 'Credit Cards', 'Travel', 'Insurance', 'Tax', 'Other'];

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const activeCategory = searchParams.get('category') || 'All';
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

  // Handle filtering and pagination whenever page, category, articles, or articlesPerPage changes
  useEffect(() => {
    if (allArticles.length === 0) return;

    let filteredArticles = allArticles;

    if (activeCategory !== 'All') {
      filteredArticles = allArticles.filter(article => 
        article.category === activeCategory || 
        (activeCategory === 'Other' && !CATEGORIES.includes(article.category) && article.category !== 'All')
      );
    }

    setTotalPages(Math.ceil(filteredArticles.length / articlesPerPage) || 1); // Avoid 0 total pages
    
    // Ensure current page is valid after filtering
    let safePage = currentPage;
    if (currentPage > Math.ceil(filteredArticles.length / articlesPerPage) && filteredArticles.length > 0) {
        safePage = 1;
        // Updating search params here might cause a re-render loop if not careful, 
        // but it's okay since we control the inputs.
        // Actually better to just set it to 1 internally for display and let user click next.
        // I will update the URL if they are out of bounds.
        setSearchParams({ category: activeCategory, page: 1 });
        return; // Let the next effect run
    }

    // Slice articles for current page
    const startIndex = (safePage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    setArticles(filteredArticles.slice(startIndex, endIndex));
    
    window.scrollTo(0, 0);
  }, [currentPage, activeCategory, allArticles, articlesPerPage, setSearchParams]);

  const handlePageChange = (newPage) => {
    setSearchParams({ category: activeCategory, page: newPage });
  };

  const handleCategoryChange = (category) => {
    setSearchParams({ category, page: 1 });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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

        {/* Category Filter */}
        <div className="category-filter-container">
          <div className="category-filter">
            {CATEGORIES.map(category => (
              <button
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {articles.length > 0 ? (
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
                  <h2>{decodeHTMLEntities(article.title)}</h2>
                  <p>{article.excerpt ? extractExcerpt(article.excerpt, 100) : extractExcerpt(article.content, 100)}</p>
                  <span className="list-item-date">{formatDate(article.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No Articles Found</h3>
            <p>We haven't published any articles in the "{activeCategory}" category yet.</p>
            <button className="explore-btn" onClick={() => handleCategoryChange('All')} style={{marginTop: '1rem'}}>
              View All Articles
            </button>
          </div>
        )}

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

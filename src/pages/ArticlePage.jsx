import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import ReadingProgress from '../components/ReadingProgress';
import TableOfContents from '../components/TableOfContents';
import { decodeHTMLEntities, extractExcerpt } from '../utils/textUtils';
import './ArticlePage.css';

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'publish')
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load the article.');
      } else if (data) {
        setArticle(data);
        incrementViewCount(data.id, data.views);
      } else {
        setError('Article not found.');
      }
      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

  const incrementViewCount = async (articleId, currentViews) => {
    try {
      await supabase
        .from('articles')
        .update({ views: (currentViews || 0) + 1 })
        .eq('id', articleId);
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }
  };

  const handleLike = async () => {
    if (!article) return;
    
    const likedArticles = JSON.parse(localStorage.getItem('liked_articles') || '[]');
    if (likedArticles.includes(article.id)) return;

    try {
      const newLikes = (article.likes || 0) + 1;
      const { error } = await supabase
        .from('articles')
        .update({ likes: newLikes })
        .eq('id', article.id);
        
      if (!error) {
        setArticle(prev => ({ ...prev, likes: newLikes }));
        localStorage.setItem('liked_articles', JSON.stringify([...likedArticles, article.id]));
      }
    } catch (err) {
      console.error('Error liking article:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getAuthorInitials = (name) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  if (loading) {
    return <div className="loader">Loading article...</div>;
  }

  if (error || !article) {
    return (
      <div className="article-page-container">
        <div className="error-message">
          <p>{error || 'Article not found'}</p>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const createMarkup = (htmlString) => {
    // Basic fix to ensure standard text doesn't show entities, though HTML parsing usually handles it.
    // React's dangerouslySetInnerHTML expects a string.
    return { __html: htmlString };
  };

  return (
    <>
      <Helmet>
        <title>{decodeHTMLEntities(article.title)} | SaveMoreMoney.in</title>
        <meta name="description" content={article.excerpt ? decodeHTMLEntities(article.excerpt) : extractExcerpt(article.content, 160)} />
        <meta property="og:title" content={decodeHTMLEntities(article.title)} />
        <meta property="og:description" content={article.excerpt ? decodeHTMLEntities(article.excerpt) : extractExcerpt(article.content, 160)} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta property="og:type" content="article" />
      </Helmet>
      
      <ReadingProgress />
      
      <div className="article-page-container">
        <div className="article-layout">
          <main className="article-main-content">
            <Link to="/" className="back-to-home">
              <span>←</span> Back to Home
            </Link>

            <article className="article-container">
              <header className="article-header">
                <div className="article-header-content">
                  {article.category && (
                    <span className="article-category">{article.category}</span>
                  )}
                  <h1>{decodeHTMLEntities(article.title)}</h1>
                  <div className="article-meta">
                    <div className="meta-item author-info">
                      <div className="author-avatar-large">
                        {getAuthorInitials(article.author || 'Mausaji')}
                      </div>
                      <span>By {article.author || 'Mausaji'}</span>
                    </div>
                    <div className="meta-item">
                      <span>📅</span>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    <div className="meta-item">
                      <span>👁️</span>
                      <span>{article.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </header>

              {article.image_url && (
                <img 
                  src={article.image_url} 
                  alt={decodeHTMLEntities(article.title)}
                  className="article-banner-image" 
                />
              )}

              <div className="article-body">
                <div 
                  ref={contentRef}
                  className="article-content"
                  dangerouslySetInnerHTML={createMarkup(article.content)}
                />

                <div className="article-share">
                  <h3>Found this helpful?</h3>
                  <p>Share this article with your friends and family to help them save more money too!</p>
                  <button 
                    className="like-button" 
                    onClick={handleLike}
                    disabled={JSON.parse(localStorage.getItem('liked_articles') || '[]').includes(article.id)}
                  >
                    ❤️ {article.likes || 0} Likes
                  </button>
                </div>
              </div>
            </article>
          </main>
          
          <aside className="article-sidebar">
            <TableOfContents contentRef={contentRef} />
          </aside>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;

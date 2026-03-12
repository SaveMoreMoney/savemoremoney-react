import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import './AdminPage.css';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const getCachedAdminData = (key) => {
    const item = sessionStorage.getItem(`admin_${key}`);
    if (!item) return null;
    try {
      const { data, timestamp } = JSON.parse(item);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const setCachedAdminData = (key, data) => {
    sessionStorage.setItem(`admin_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    
    if (activeTab === 'articles') {
      const cached = getCachedAdminData('articles');
      if (cached) {
        setArticles(cached);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setArticles(data);
        setCachedAdminData('articles', data);
      }
    } else {
      const cached = getCachedAdminData('subscribers');
      if (cached) {
        setSubscribers(cached);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });
      
      if (data) {
        setSubscribers(data);
        setCachedAdminData('subscribers', data);
      }
    }
    setLoading(false);
  };

  const forceRefresh = () => {
    sessionStorage.removeItem(`admin_${activeTab}`);
    fetchData();
  };

  const deleteArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await supabase.from('articles').delete().eq('id', id);
      // Invalidate cache and refresh
      sessionStorage.removeItem('admin_articles');
      if (activeTab === 'articles') fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.clear(); // Clear admin cache
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="admin-container">
      <Helmet>
        <title>Admin Dashboard | SaveMoreMoney.in</title>
      </Helmet>
      
      <div className="admin-header">
        <div className="header-title">
          <h1>Admin Dashboard</h1>
          <button onClick={forceRefresh} className="refresh-btn" title="Refresh Data">↻</button>
        </div>
        <div className="admin-actions">
          <Link to="/admin/articles/new" className="create-btn">
            + New Article
          </Link>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          Articles ({articles.length || 0})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'subscribers' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          Subscribers ({subscribers.length || 0})
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="admin-loader">
            <div className="spinner"></div>
            <span>Loading data...</span>
          </div>
        ) : activeTab === 'articles' ? (
          <div className="admin-grid-view">
            {articles.map(article => (
              <div key={article.id} className="admin-card">
                <div className="card-status-bar">
                  <span className={`status-dot ${article.status}`}></span>
                  <span className="status-text">{article.status}</span>
                </div>
                <h3 title={article.title}>{article.title}</h3>
                <div className="card-meta">
                  <span>/{article.slug}</span>
                  <span>{formatDate(article.created_at)}</span>
                </div>
                <div className="card-stats">
                  <span>👁️ {article.views || 0}</span>
                  <span>❤️ {article.likes || 0}</span>
                </div>
                <div className="card-actions">
                  <Link to={`/admin/articles/edit/${article.slug}`} className="card-btn edit">Edit</Link>
                  <button onClick={() => deleteArticle(article.id)} className="card-btn delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.email}</td>
                    <td>{formatDate(sub.subscribed_at)}</td>
                    <td>
                      <span className={`status-badge ${sub.is_active ? 'active' : 'inactive'}`}>
                        {sub.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

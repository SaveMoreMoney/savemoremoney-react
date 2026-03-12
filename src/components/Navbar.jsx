import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme, searchArticles } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Filter articles based on search query
  const filteredArticles = searchQuery.length > 0 
    ? searchArticles.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Limit to 5 results
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.querySelector('input')?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSearchResults(true);
  };

  const handleSearchResultClick = (slug) => {
    navigate(`/${slug}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="navbar-container">
        <NavLink to="/" className="nav-logo" onClick={closeMenu}>
          <span className="nav-logo-icon">💰</span>
          SaveMoreMoney.in
        </NavLink>
        
        <div className="nav-center">
          <div className="search-container" ref={searchRef}>
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search for 'Tax' or 'Credit Cards'..." 
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchResults(true)}
              />
              <span className="search-shortcut">⌘K</span>
            </div>
            
            {showSearchResults && searchQuery.length > 0 && (
              <div className="search-results">
                {filteredArticles.length > 0 ? (
                  <ul>
                    {filteredArticles.map(article => (
                      <li key={article.id}>
                        <button onClick={() => handleSearchResultClick(article.slug)}>
                          {article.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="no-results">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </button>
        
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'active' : ''} 
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Dark Mode">
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </li>
          <li>
            <NavLink 
              to="/consult" 
              className="nav-cta" 
              onClick={closeMenu}
            >
              Book 1:1
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

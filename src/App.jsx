import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import ArticlesPage from './pages/ArticlesPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage'; // Now acts as Dashboard
import AdminAuth from './pages/AdminAuth';
import ArticleEditor from './pages/ArticleEditor';
import ConsultPage from './pages/ConsultPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <HelmetProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/consult" element={<ConsultPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminAuth />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminPage />} />
              <Route path="/admin/articles/new" element={<ArticleEditor />} />
              <Route path="/admin/articles/edit/:slug" element={<ArticleEditor />} />
            </Route>

            {/* Dynamic Routes (Must be last) */}
            <Route path="/:slug" element={<ArticlePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;

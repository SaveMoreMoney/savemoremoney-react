import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import AdminPage from './pages/AdminPage';
import ConsultPage from './pages/ConsultPage';
import NotFoundPage from './pages/NotFoundPage';
import ArticlesPage from './pages/ArticlesPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <HelmetProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/consult" element={<ConsultPage />} />
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

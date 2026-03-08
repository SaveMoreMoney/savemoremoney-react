import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: email.toLowerCase().trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setMessage({ text: 'You are already subscribed!', type: 'error' });
        } else {
          setMessage({ text: 'Something went wrong. Please try again.', type: 'error' });
        }
      } else {
        setMessage({ text: 'Successfully subscribed! 🎉', type: 'success' });
        setEmail('');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage({ text: 'Failed to subscribe. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <span>💰</span>
              SaveMoreMoney.in
            </div>
            <p>
              Your trusted source for expert financial advice, money-saving tips, 
              and investment strategies to help you build lasting wealth.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">📘</a>
              <a href="#" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#" className="social-link" aria-label="LinkedIn">💼</a>
              <a href="#" className="social-link" aria-label="Instagram">📷</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/consult">Book Consultation</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter for the latest financial tips and insights.</p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                disabled={isSubmitting}
                required
              />
              <button 
                type="submit" 
                className="newsletter-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message.text && (
              <div className={`newsletter-message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} SaveMoreMoney.in. All rights reserved. 
            Made with ❤️ for financial freedom.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} SaveMoreMoney.in. All rights reserved.</p>
        {/* Newsletter subscription form will go here */}
      </div>
    </footer>
  );
};

export default Footer;

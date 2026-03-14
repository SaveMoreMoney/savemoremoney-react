import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext'; // Or AppContext where isDarkMode is stored
import { useApp } from '../contexts/AppContext'; // Using AppContext as per previous changes
import './ConsultPage.css';

const ConsultPage = () => {
  const { isDarkMode } = useApp();
  const calendlyRef = useRef(null);

  useEffect(() => {
    // We use standard script injection instead of React-Calendly package for simplicity 
    // without running npm install, but we will configure the URL properly to match theme.
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // It's safer not to aggressively remove the script as it might be cached or in use,
      // but if we do, we should ensure the widget instance is destroyed. 
      // For a simple SPA, leaving the script tag is usually fine, but removing is cleaner.
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Calendly URL parameters for styling:
  // background_color, text_color, primary_color
  // We use hex codes without the # symbol.
  const getCalendlyUrl = () => {
    const baseUrl = 'https://calendly.com/savemoremoney/free-consultation-call';
    
    // Default light theme colors based on index.css
    let bgColor = 'ffffff';
    let textColor = '1f2937';
    const primaryColor = '2563eb'; // Brand primary blue

    if (isDarkMode) {
      bgColor = '111827';   // Matches --bg-primary in dark mode
      textColor = 'f9fafb'; // Matches --text-primary in dark mode
    }

    return `${baseUrl}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=${bgColor}&text_color=${textColor}&primary_color=${primaryColor}`;
  };

  return (
    <>
      <Helmet>
        <title>Book 1:1 Consultation | SaveMoreMoney.in</title>
        <meta name="description" content="Book a personalized 1:1 financial consultation with Nishant Gupta to discuss your financial goals, investments, and strategies." />
      </Helmet>
      
      <div className="consult-page-container container">
        <div className="consult-header">
          <h1>Book a 1:1 Consultation</h1>
          <p>
            Get personalized advice on personal finance, investments, tax planning, and credit card strategies tailored to your unique situation.
          </p>
        </div>

        <div className="consult-content">
          <div className="consult-info">
            <div className="info-card">
              <div className="info-icon">🎯</div>
              <h3>Goal Oriented</h3>
              <p>We'll focus strictly on your financial goals and create actionable steps.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>100% Confidential</h3>
              <p>Your financial data and discussions are kept strictly private.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">💡</div>
              <h3>Expert Insights</h3>
              <p>Leverage 7+ years of hands-on experience in personal finance.</p>
            </div>
          </div>

          <div className="calendly-wrapper" ref={calendlyRef}>
            {/* The widget script will transform this div into an iframe.
                To prevent internal double scrollbars, we use a specific height and overflow strategy in CSS.
                We also dynamically inject the URL to pass the current theme colors. */}
            <div 
              className="calendly-inline-widget" 
              data-url={getCalendlyUrl()}
              style={{ minWidth: '320px', height: '100%', width: '100%' }} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultPage;

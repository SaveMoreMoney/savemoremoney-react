import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ submitting: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const contentType = response.headers.get('content-type');
      
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.warning) {
             console.log(data.warning);
          }
        }
        setStatus({ submitting: false, success: true, error: null });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to send message.');
        } else {
          // If Vercel returned a 404 HTML page or 500 error page
          const text = await response.text();
          console.error("Non-JSON Error Response:", text);
          throw new Error(`Server returned ${response.status}: Failed to reach email service.`);
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Fallback for local testing or if API is consistently failing
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Local environment detected: Simulating email send.', formData);
        setStatus({ submitting: false, success: true, error: null });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
         setStatus({ submitting: false, success: false, error: error.message || 'An error occurred. Please try again later.' });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Me | SaveMoreMoney.in</title>
        <meta name="description" content="Get in touch for suggestions, feedback, help, or questions regarding personal finance." />
      </Helmet>
      
      <div className="contact-page-container container">
        <div className="contact-header">
          <h1>Get in Touch</h1>
          <p>
            Have a suggestion, feedback, or need help with personal finance? Drop me a message!
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-info-card">
              <div className="info-icon">📧</div>
              <h3>Email Me</h3>
              <p>Directly reach out to:</p>
              <a href="mailto:hello@savemoremoney.in" className="contact-link">hello@savemoremoney.in</a>
            </div>
            
            <div className="contact-info-card">
              <div className="info-icon">🤝</div>
              <h3>Connect</h3>
              <p>Follow for daily updates:</p>
              <div className="social-links-contact">
                <a href="https://instagram.com/savemoremoney.in" target="_blank" rel="noopener noreferrer">Instagram</a>
                <span>•</span>
                <a href="https://www.youtube.com/@savemoremoney-nishant/" target="_blank" rel="noopener noreferrer">YouTube</a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {status.success ? (
              <div className="success-message-card">
                <div className="success-icon">✨</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button onClick={() => setStatus({ ...status, success: false })} className="send-another-btn">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="Question">Question</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Suggestion">Article Suggestion</option>
                    <option value="Collab">Collaboration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="How can I help you today?"
                  ></textarea>
                </div>

                {status.error && <div className="error-message">{status.error}</div>}

                <button type="submit" className="submit-btn" disabled={status.submitting}>
                  {status.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

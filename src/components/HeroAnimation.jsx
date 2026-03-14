import React, { useState, useEffect, useCallback } from 'react';
import './HeroAnimation.css';

const HeroAnimation = ({ onComplete, articleCount, loading }) => {
  const [phase, setPhase] = useState(0); // 0: initial typing, 1: stats appear, 2: fade out
  const [text, setText] = useState('');
  const fullText = "Master Your Money";
  const [isSkipped, setIsSkipped] = useState(false);

  const skipAnimation = useCallback(() => {
    if (!isSkipped) {
      setIsSkipped(true);
      setPhase(2);
      setTimeout(onComplete, 400); // Shorter fade out if skipped
    }
  }, [isSkipped, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        skipAnimation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skipAnimation]);

  // Typing effect
  useEffect(() => {
    if (phase === 0 && !isSkipped) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setText(fullText.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => !isSkipped && setPhase(1), 500); // Wait half a sec before showing stats
        }
      }, 80); // Typing speed
      return () => clearInterval(interval);
    }
  }, [phase, isSkipped]);

  // Transition to next phase
  useEffect(() => {
    if (phase === 1 && !loading && !isSkipped) {
      // Once stats are shown and articles are loaded, wait a bit then complete
      const timer = setTimeout(() => {
        setPhase(2);
        setTimeout(onComplete, 800); // 800ms for fade out animation
      }, 2000); // Show stats for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [phase, loading, onComplete, isSkipped]);

  return (
    <div className={`hero-animation-container ${phase === 2 ? 'fade-out' : ''}`}>
      <button className="skip-btn" onClick={skipAnimation}>Skip ⏭</button>
      <div className="hero-animation-content">
        <h1 className="typing-text">
          💰 {text}
          <span className="cursor"></span>
        </h1>
        
        <p className={`hero-subtitle ${phase >= 1 || isSkipped ? 'visible' : ''}`}>
          Expert financial advice, proven strategies, and actionable tips to help you save more, invest smarter, and build lasting wealth.
        </p>

        <div className="animated-stats">
          <div className={`stat-item ${phase >= 1 && !isSkipped ? 'pop-in delay-1' : ''} ${isSkipped ? 'visible' : ''}`}>
            <span className="stat-number">{articleCount || '50'}+</span>
            <span className="stat-label">Articles</span>
          </div>
          <div className={`stat-item ${phase >= 1 && !isSkipped ? 'pop-in delay-2' : ''} ${isSkipped ? 'visible' : ''}`}>
            <span className="stat-number">10K+</span>
            <span className="stat-label">Readers</span>
          </div>
          <div className={`stat-item ${phase >= 1 && !isSkipped ? 'pop-in delay-3' : ''} ${isSkipped ? 'visible' : ''}`}>
            <span className="stat-number">7+</span>
            <span className="stat-label">Years Exp</span>
          </div>
          <div className={`stat-item ${phase >= 1 && !isSkipped ? 'pop-in delay-4' : ''} ${isSkipped ? 'visible' : ''}`}>
            <span className="stat-number">100%</span>
            <span className="stat-label">Free</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;

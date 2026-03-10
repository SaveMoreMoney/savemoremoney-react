import React, { useState, useEffect } from 'react';
import './ReadingProgress.css';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="reading-progress-container">
      <div 
        className="reading-progress-bar" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;

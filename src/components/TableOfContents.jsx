import React, { useState, useEffect } from 'react';
import './TableOfContents.css';

const TableOfContents = ({ contentRef }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!contentRef.current) return;

    // Wait for content to render if needed, but typically refs are available after mount
    // Find all H2 and H3 elements within the content
    const elements = Array.from(contentRef.current.querySelectorAll('h2, h3'));
    
    if (elements.length === 0) {
      setHeadings([]);
      return;
    }

    // Add IDs if missing and prepare data
    const headingData = elements.map((elem, index) => {
      if (!elem.id) {
        // Generate a slug-like ID from text or fallback to index
        const text = elem.innerText;
        const slug = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        elem.id = slug || `heading-${index}`;
      }
      return {
        id: elem.id,
        text: elem.innerText,
        level: elem.tagName.toLowerCase()
      };
    });

    setHeadings(headingData);

    // Scroll Spy Logic
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80% 0px', // Trigger when element is near top
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, [contentRef]); // Re-run if ref changes, might need to depend on content if dynamic

  if (headings.length === 0) return null;

  return (
    <nav className="table-of-contents">
      <h3 className="toc-title">On this page</h3>
      <ul className="toc-list">
        {headings.map((heading) => (
          <li 
            key={heading.id} 
            className={`toc-item toc-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
          >
            <a 
              href={`#${heading.id}`} 
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(heading.id);
                if (el) {
                  // Offset for sticky navbar (70px) + some breathing room
                  const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                  setActiveId(heading.id);
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;

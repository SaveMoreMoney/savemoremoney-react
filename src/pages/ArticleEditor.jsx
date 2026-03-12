import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Helmet } from 'react-helmet-async';
import './ArticleEditor.css';

const ArticleEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Personal Finance',
    author: 'Nishant',
    image_url: '',
    excerpt: '',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Auto-generate slug from title if creating new
      if (name === 'title' && !slug && !prev.slug) {
        newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      return newData;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Remove fields not in schema if they exist in state but not DB
      // The error was specifically about 'updated_at' not being in schema cache/definition
      const payload = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        author: formData.author,
        image_url: formData.image_url,
        excerpt: formData.excerpt,
        content: formData.content,
        status: formData.status
      };

      let error;
      if (slug) {
        // Update
        const { error: updateError } = await supabase
          .from('articles')
          .update(payload)
          .eq('slug', slug);
        error = updateError;
      } else {
        // Create
        const { error: insertError } = await supabase
          .from('articles')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      
      alert('Article saved successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error saving article:', err);
      alert('Failed to save article: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simple formatting helper
  const insertFormat = (tag) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    
    let newText = '';
    if (tag === 'link') {
      newText = `${before}<a href="url">${selection || 'link text'}</a>${after}`;
    } else if (tag === 'img') {
      newText = `${before}<img src="url" alt="alt" />${after}`;
    } else if (tag === 'h2') {
      newText = `${before}<h2>${selection}</h2>${after}`;
    } else if (tag === 'h3') {
      newText = `${before}<h3>${selection}</h3>${after}`;
    } else {
      newText = `${before}<${tag}>${selection}</${tag}>${after}`;
    }
    
    setFormData(prev => ({ ...prev, content: newText }));
    
    // Restore focus and cursor position (approximate)
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length - text.length; // rough calc
      // simpler: just focus back
    }, 0);
  };

  return (
    <div className="editor-container">
      <Helmet>
        <title>{slug ? 'Edit Article' : 'New Article'} | Admin</title>
      </Helmet>

      <div className="editor-header">
        <div className="header-left">
          <button type="button" className="back-btn" onClick={() => navigate('/admin/dashboard')}>← Back</button>
          <h1>{slug ? 'Edit Article' : 'New Article'}</h1>
        </div>
        <div className="editor-actions">
          <button 
            type="button" 
            className="preview-toggle-btn" 
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button type="submit" form="article-form" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>

      <div className={`editor-layout ${showPreview ? 'split-view' : 'single-view'}`}>
        <form id="article-form" className="editor-form" onSubmit={handleSave}>
          <div className="form-card main-info">
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                placeholder="Enter article title"
                className="title-input"
              />
            </div>
            
            <div className="form-row three-col">
              <div className="form-group">
                <label>Slug</label>
                <input 
                  type="text" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Personal Finance">Personal Finance</option>
                  <option value="Investing">Investing</option>
                  <option value="Credit Cards">Credit Cards</option>
                  <option value="Travel">Travel</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="draft">Draft</option>
                  <option value="publish">Publish</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-card content-area">
            <div className="editor-toolbar">
              <button type="button" onClick={() => insertFormat('b')} title="Bold"><b>B</b></button>
              <button type="button" onClick={() => insertFormat('i')} title="Italic"><i>I</i></button>
              <button type="button" onClick={() => insertFormat('h2')}>H2</button>
              <button type="button" onClick={() => insertFormat('h3')}>H3</button>
              <button type="button" onClick={() => insertFormat('p')}>P</button>
              <button type="button" onClick={() => insertFormat('ul')}>• List</button>
              <button type="button" onClick={() => insertFormat('link')}>🔗 Link</button>
              <button type="button" onClick={() => insertFormat('img')}>🖼️ Image</button>
            </div>
            <textarea 
              id="content-editor"
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              placeholder="Write your article content here (HTML supported)..."
              className="content-textarea"
            />
          </div>

          <div className="form-card meta-info">
            <div className="form-group">
              <label>Excerpt</label>
              <textarea 
                name="excerpt" 
                value={formData.excerpt} 
                onChange={handleChange} 
                rows={2}
                placeholder="Short description for SEO and previews"
              />
            </div>
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Featured Image URL</label>
                <input 
                  type="text" 
                  name="image_url" 
                  value={formData.image_url} 
                  onChange={handleChange} 
                  placeholder="https://..."
                />
              </div>
              <div className="form-group flex-1">
                <label>Author</label>
                <input 
                  type="text" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
        </form>

        {showPreview && (
          <div className="editor-preview">
            <div className="preview-label">Live Preview</div>
            <div className="article-page preview-mode">
              <article className="article-container">
                <header className="article-header">
                  <div className="article-header-content">
                    <span className="article-category">{formData.category}</span>
                    <h1>{formData.title || 'Untitled Article'}</h1>
                    <div className="article-meta">
                      <span>By {formData.author}</span>
                      <span>📅 {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </header>
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="article-banner-image" />
                )}
                <div className="article-body">
                  <div 
                    className="article-content"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleEditor;

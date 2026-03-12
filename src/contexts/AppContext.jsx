import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import { getCachedData, setCachedData } from '../utils/storage';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Articles State for Search
  const [searchArticles, setSearchArticles] = useState([]);

  // Auth Session State
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
      // 1. Try to get full articles cache
      const fullArticles = getCachedData('articles');
      if (fullArticles) {
        setSearchArticles(fullArticles);
        return;
      }

      // 2. Try to get search articles cache
      const cachedSearch = getCachedData('search_articles');
      if (cachedSearch) {
        setSearchArticles(cachedSearch);
        return;
      }

      // 3. Fetch from API
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug')
        .eq('status', 'publish')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setSearchArticles(data);
        setCachedData('search_articles', data);
      }
    };

    fetchSearchData();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <AppContext.Provider value={{ isDarkMode, toggleTheme, searchArticles, session, loadingSession }}>
      {children}
    </AppContext.Provider>
  );
};

// This is a backend script to migrate WordPress data to Supabase using the admin service_role key.
// Run this script from your terminal with: node migration-script.mjs

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseServiceKey || supabaseServiceKey === 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
  console.error('Error: Supabase URL or Service Key is not set.');
  console.error('Please fill in your project details in the .env.local file.');
  process.exit(1);
}

// Initialize Supabase client with the service_role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('Supabase client initialized for backend migration.');

const migrateData = async () => {
  let wpData;
  try {
    const jsonData = fs.readFileSync('wp-data.json', 'utf-8');
    wpData = JSON.parse(jsonData);
    if (wpData.length === 0 || !Array.isArray(wpData)) {
        console.error('Error: wp-data.json is empty or not a valid JSON array.');
        return;
    }
    console.log(`Found ${wpData.length} articles to migrate from wp-data.json.`);
  } catch (err) {
    console.error('Error reading or parsing wp-data.json:', err.message);
    return;
  }

  console.log("Starting Migration...");

  const formattedData = wpData.map(post => ({
    title: post.title.rendered,
    content: post.content.rendered,
    slug: post.slug,
    is_published: post.status === 'publish',
    created_at: new Date(post.date).toISOString(),
    author_name: 'Mausaji',
    category: 'General'
  }));

  const { data, error } = await supabase
    .from('articles')
    .insert(formattedData, { returning: 'minimal' }); // 'minimal' is more efficient

  if (error) {
    console.error("Migration Error:", error.message);
    console.error("Full error object:", error);
  } else {
    // Note: 'data' will be null with `returning: 'minimal'`. Success is indicated by the absence of an error.
    console.log(`Migration Successful! ${formattedData.length} articles were prepared for insertion.`);
    console.log("Please check your Supabase 'articles' table to verify the data.");
  }
};

migrateData();

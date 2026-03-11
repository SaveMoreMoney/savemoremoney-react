import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient('https://pkgmgyexopjaxrbjxmkb.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrZ21neWV4b3BqYXhyYmp4bWtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjkwNzY2NiwiZXhwIjoyMDg4NDgzNjY2fQ.-v_2Zw8bzzRvJph-HP2xAeF0qSczyhYxOQXaYth8Fq0');

const migrate = async () => {
  const wpData = JSON.parse(fs.readFileSync('./all_articles.json', 'utf8'));
  const finalArticles = [];

  console.log(`🔍 Processing ${wpData.length} articles and fetching images...`);

  for (const post of wpData) {
    let imageUrl = null;

    // 1. Fetch the actual image URL from the WP Media API
    if (post.featured_media > 0) {
      try {
        const mediaRes = await fetch(`https://savemoremoney.in/wp-json/wp/v2/media/${post.featured_media}`);
        const mediaData = await mediaRes.json();
        imageUrl = mediaData.source_url;
      } catch (e) {
        console.log(`⚠️ Could not fetch image for post: ${post.title.rendered}`);
      }
    }

    // 2. Logic for Likes/Views
    const randomLikes = Math.floor(Math.random() * 200) + 100;
    const randomViews = Math.floor(Math.random() * 3000) + 5000;

    finalArticles.push({
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').substring(0, 160) + "...",
      slug: post.slug,
      author: "Nishant", // Or post._embedded?.author[0]?.name if available
      category: "Finance", // You can map post.categories[0] to a string name here
      image_url: imageUrl,
      likes: randomLikes,
      views: randomViews,
      status: post.status,
      created_at: post.date
    });
  }

  // 3. Batch insert to Supabase
  const { error } = await supabase.from('articles').insert(finalArticles);

  if (error) console.error('❌ Error:', error.message);
  else console.log('✅ Migration Complete! Your site is now populated with images.');
};

migrate();
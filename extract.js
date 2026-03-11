import fs from 'fs';

async function fetchAllPosts() {
    let allPosts = [];
    let page = 1;
    let totalPages = 1;

    console.log("Starting extraction from savemoremoney.in...");

    try {
        do {
            const response = await fetch(`https://savemoremoney.in/wp-json/wp/v2/posts?per_page=100&page=${page}`);

            // WordPress sends the total number of pages in the headers
            totalPages = response.headers.get('x-wp-totalpages');
            const posts = await response.json();

            allPosts = allPosts.concat(posts);
            console.log(`Fetched page ${page} of ${totalPages}`);
            page++;
        } while (page <= totalPages);

        fs.writeFileSync('all_articles.json', JSON.stringify(allPosts, null, 2));
        console.log(`Success! ${allPosts.length} articles saved to all_articles.json`);
    } catch (err) {
        console.error("Extraction failed. The API might be restricted.", err);
    }
}

fetchAllPosts();
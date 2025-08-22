// loader.js - Real news loading functionality
const NEWS_CATEGORIES = ['business', 'finance', 'technology', 'economics', 'crypto'];

// Initialize news loading
async function loadNews(category = 'business') {
    const container = document.querySelector('.news-container');
    if (!container) return;
    
    // Show loading state
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading news...
        </div>
    `;
    
    try {
        // Try to fetch real news data from News API
        const news = await fetchNewsData(category);
        
        if (news && news.length > 0) {
            renderNews(container, news);
        } else {
            // Fallback to NewsData.io if News API fails
            const newsData = await fetchNewsDataIO(category);
            if (newsData && newsData.length > 0) {
                renderNews(container, newsData);
            } else {
                container.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i>
                        Failed to load news
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading news:', error);
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                Error loading news
            </div>
        `;
    }
}

// Fetch news data from News API (requires API key)
async function fetchNewsData(category) {
    try {
        // You need to sign up at https://newsapi.org/ and get an API key
        const apiKey = '4bdb0fe752094e7daff91062f5513534'; // Replace with your actual API key
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`);
        
        if (!response.ok) {
            throw new Error(`News API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.articles || [];
    } catch (error) {
        console.error('Error fetching from News API:', error);
        return null;
    }
}

// Alternative news source: NewsData.io (free tier available)
async function fetchNewsDataIO(category) {
    try {
        // Sign up at https://newsdata.io/ for API key
        const apiKey = '4bdb0fe752094e7daff91062f5513534'; // Replace with your actual API key
        const response = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&category=${category}`);
        
        if (!response.ok) {
            throw new Error(`NewsData.io error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching from NewsData.io:', error);
        return null;
    }
}

// Render news to the page
function renderNews(container, news) {
    const newsHTML = `
        <div class="news-grid">
            ${news.slice(0, 6).map(item => `
                <div class="news-card">
                    <div class="news-image">
                        <img src="${item.urlToImage || item.image_url || 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                        <span class="news-category">${item.category || 'General'}</span>
                    </div>
                    <div class="news-content">
                        <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
                        <p>${item.description || 'No description available.'}</p>
                        <div class="news-meta">
                            <span class="news-time">${formatTimeAgo(item.publishedAt || item.pubDate)}</span>
                            <span class="news-source">${item.source?.name || 'Unknown Source'}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = newsHTML;
}

// News category filtering
function setupNewsFilters() {
    const filterButtons = document.querySelectorAll('.news-filter-btn');
    const newsContainer = document.querySelector('.news-container');
    
    if (filterButtons && newsContainer) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Load news for selected category
                loadNews(category);
            });
        });
    }
}

// Initialize news filters if they exist
if (document.querySelector('.news-filters')) {
    setupNewsFilters();
}

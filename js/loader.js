// loader.js - News loading functionality
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
        // Try to fetch real news data
        const news = await fetchNewsData(category);
        
        if (news && news.length > 0) {
            renderNews(container, news);
        } else {
            // Fallback to demo news if API fails
            renderDemoNews(container);
        }
    } catch (error) {
        console.error('Error loading news:', error);
        // Fallback to demo news
        renderDemoNews(container);
    }
}

// Fetch news data from API
async function fetchNewsData(category) {
    try {
        // Using News API (you would need to get your own API key)
        // For now, we'll use a placeholder approach with demo data
        // In a real implementation, you would use:
        // const apiKey = 'YOUR_NEWS_API_KEY';
        // const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return demo news data for now
        return getDemoNewsData(category);
    } catch (error) {
        console.error('Error fetching news:', error);
        return null;
    }
}

// Get demo news data
function getDemoNewsData(category) {
    const allNews = [
        {
            title: 'Bitcoin Surges Past $40,000 as Institutional Adoption Grows',
            description: 'Major financial institutions continue to expand cryptocurrency offerings, driving prices higher amid increasing adoption.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1620336655055-bd87ca8f1370?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Financial Times' },
            category: 'crypto'
        },
        {
            title: 'Federal Reserve Holds Rates Steady, Signals Caution on Inflation',
            description: 'The Federal Reserve maintained interest rates at current levels while acknowledging persistent inflationary pressures in the economy.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Bloomberg' },
            category: 'finance'
        },
        {
            title: 'Tech Stocks Rally as Earnings Season Exceeds Expectations',
            description: 'Technology companies report stronger-than-expected earnings, driving a broad rally in tech stocks across major indices.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            source: { name: 'CNBC' },
            category: 'business'
        },
        {
            title: 'Oil Prices Volatile Amid Middle East Tensions and Supply Concerns',
            description: 'Crude oil prices swing wildly as geopolitical tensions rise and OPEC+ considers production adjustments.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1603665274855-b4f1e5e0ba27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Reuters' },
            category: 'business'
        },
        {
            title: 'Euro Strengthens Against Dollar as ECB Hints at Policy Shift',
            description: 'The European Central Bank signals a more hawkish stance, boosting the euro against major currencies.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Financial Times' },
            category: 'finance'
        },
        {
            title: 'New AI Trading Platform Promises Revolution in Algorithmic Trading',
            description: 'A startup unveils a new artificial intelligence platform that claims to predict market movements with unprecedented accuracy.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1677442135135-416f8aa26a5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            source: { name: 'TechCrunch' },
            category: 'technology'
        },
        {
            title: 'Housing Market Shows Signs of Cooling After Record Year',
            description: 'After unprecedented growth, housing market indicators suggest a return to more normal patterns.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Bloomberg' },
            category: 'economics'
        },
        {
            title: 'Central Banks Explore Digital Currencies as Crypto Adoption Grows',
            description: 'Major central banks worldwide are accelerating research into central bank digital currencies (CBDCs) as cryptocurrency adoption continues to expand.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Wall Street Journal' },
            category: 'crypto'
        }
    ];
    
    // Filter by category if specified
    if (category && category !== 'all') {
        return allNews.filter(item => item.category === category);
    }
    
    return allNews;
}

// Render news to the page
function renderNews(container, news) {
    const newsHTML = `
        <div class="news-grid">
            ${news.map(item => `
                <div class="news-card">
                    <div class="news-image">
                        <img src="${item.urlToImage || 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${item.title}" onerror="this.src='https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                        <span class="news-category">${item.category || 'General'}</span>
                    </div>
                    <div class="news-content">
                        <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>
                        <p>${item.description}</p>
                        <div class="news-meta">
                            <span class="news-time">${formatTimeAgo(item.publishedAt)}</span>
                            <span class="news-source">${item.source.name}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = newsHTML;
}

// Render demo news as fallback
function renderDemoNews(container) {
    const demoNews = [
        {
            title: 'Stock Markets Reach Record Highs Amid Economic Recovery',
            description: 'Global stock markets continue their upward trajectory as economic indicators show strong recovery signals.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: { name: 'MarketWatch' },
            category: 'business'
        },
        {
            title: 'Cryptocurrency Regulations Expected to Tighten Following G20 Meeting',
            description: 'Finance ministers from G20 countries discuss coordinated approach to cryptocurrency regulation.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1620336655055-bd87ca8f1370?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Reuters' },
            category: 'crypto'
        },
        {
            title: 'Housing Market Shows Signs of Cooling After Record Year',
            description: 'After unprecedented growth, housing market indicators suggest a return to more normal patterns.',
            url: '#',
            urlToImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Bloomberg' },
            category: 'economics'
        }
    ];
    
    renderNews(container, demoNews);
    
    // Add a warning that demo data is being shown
    const warning = document.createElement('div');
    warning.className = 'demo-warning';
    warning.innerHTML = `<i class="fas fa-info-circle"></i> Showing demo news. Real-time news unavailable.`;
    container.appendChild(warning);
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

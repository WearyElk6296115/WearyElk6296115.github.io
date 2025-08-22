// news-loader.js - News loading functionality
const NEWS_CATEGORIES = ['business', 'finance', 'technology', 'economics', 'crypto'];

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
        // Using News API (you'll need to get your own API key)
        // For demo purposes, we'll use a placeholder approach
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

async function fetchNewsData(category) {
    // In a real implementation, you would use a news API like NewsAPI.org
    // This is a placeholder function that returns demo data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return demo news data
    return [
        {
            title: 'Bitcoin Surges Past $40,000 as Institutional Adoption Grows',
            description: 'Major financial institutions continue to expand cryptocurrency offerings, driving prices higher amid increasing adoption.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Crypto+News',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Financial Times' },
            category: 'crypto'
        },
        {
            title: 'Federal Reserve Holds Rates Steady, Signals Caution on Inflation',
            description: 'The Federal Reserve maintained interest rates at current levels while acknowledging persistent inflationary pressures in the economy.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Economy',
            publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Bloomberg' },
            category: 'finance'
        },
        {
            title: 'Tech Stocks Rally as Earnings Season Exceeds Expectations',
            description: 'Technology companies report stronger-than-expected earnings, driving a broad rally in tech stocks across major indices.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Stocks',
            publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            source: { name: 'CNBC' },
            category: 'business'
        },
        {
            title: 'Oil Prices Volatile Amid Middle East Tensions and Supply Concerns',
            description: 'Crude oil prices swing wildly as geopolitical tensions rise and OPEC+ considers production adjustments.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Commodities',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Reuters' },
            category: 'business'
        },
        {
            title: 'Euro Strengthens Against Dollar as ECB Hints at Policy Shift',
            description: 'The European Central Bank signals a more hawkish stance, boosting the euro against major currencies.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Forex',
            publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Financial Times' },
            category: 'finance'
        },
        {
            title: 'New AI Trading Platform Promises Revolution in Algorithmic Trading',
            description: 'A startup unveils a new artificial intelligence platform that claims to predict market movements with unprecedented accuracy.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Technology',
            publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            source: { name: 'TechCrunch' },
            category: 'technology'
        }
    ];
}

function renderNews(container, news) {
    const newsHTML = `
        <div class="news-grid">
            ${news.map(item => `
                <div class="news-card">
                    <div class="news-image">
                        <img src="${item.urlToImage || 'https://via.placeholder.com/400x200?text=News'}" alt="${item.title}">
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

function renderDemoNews(container) {
    const demoNews = [
        {
            title: 'Stock Markets Reach Record Highs Amid Economic Recovery',
            description: 'Global stock markets continue their upward trajectory as economic indicators show strong recovery signals.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Market+News',
            publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            source: { name: 'MarketWatch' },
            category: 'business'
        },
        {
            title: 'Cryptocurrency Regulations Expected to Tighten Following G20 Meeting',
            description: 'Finance ministers from G20 countries discuss coordinated approach to cryptocurrency regulation.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Crypto+Regulation',
            publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Reuters' },
            category: 'crypto'
        },
        {
            title: 'Housing Market Shows Signs of Cooling After Record Year',
            description: 'After unprecedented growth, housing market indicators suggest a return to more normal patterns.',
            url: '#',
            urlToImage: 'https://via.placeholder.com/400x200?text=Housing',
            publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            source: { name: 'Bloomberg' },
            category: 'economics'
        }
    ];
    
    renderNews(container, demoNews);
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
        return `${diffMins} min ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hr ago`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
}

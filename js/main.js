// main.js - Main JavaScript functionality for trading website
document.addEventListener('DOMContentLoaded', function() {
    console.log('MarketPulse Pro initialized');
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Tab functionality for market data
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to current button and content
            this.classList.add('active');
            const tabContent = document.getElementById(tabId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            // Load data for the selected tab
            if (typeof loadMarketData === 'function') {
                loadMarketData(tabId);
            }
        });
    });

    // Initialize market data if on homepage or markets page
    if (document.querySelector('.market-table') && typeof loadMarketData === 'function') {
        // Load crypto data by default
        loadMarketData('crypto');
    }

    // Initialize news if on news page
    if (document.querySelector('.news-container') && typeof loadNews === 'function') {
        loadNews();
    }

    // Initialize signals if on signals page
    if (document.querySelector('.signals-container') && typeof loadSignals === 'function') {
        loadSignals();
    }

    // Initialize generator iframe if on generator page
    if (document.getElementById('generator-frame')) {
        initGenerator();
    }
});

// Initialize the signal generator iframe
function initGenerator() {
    const frame = document.getElementById('generator-frame');
    if (frame) {
        frame.src = 'http://localhost:8501';
        
        // Add error handling for the iframe
        frame.addEventListener('load', function() {
            console.log('Signal generator loaded successfully');
        });
        
        frame.addEventListener('error', function() {
            console.error('Failed to load signal generator');
            frame.innerHTML = `
                <div class="error-message">
                    <h3>Signal Generator Unavailable</h3>
                    <p>Please ensure your signal generator server is running at http://localhost:8501</p>
                    <button onclick="initGenerator()">Retry Connection</button>
                </div>
            `;
        });
    }
}

// Utility function for API calls
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Format numbers with commas and decimals
function formatNumber(num, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

// Format currency
function formatCurrency(amount, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(amount);
}

// Format percentage
function formatPercent(percent, decimals = 2) {
    return (percent / 100).toLocaleString('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Format time ago
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

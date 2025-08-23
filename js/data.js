// data.js - Forex Factory data integration with proxy server
const PROXY_BASE_URL = 'http://localhost:3001/api';

// Forex Factory data functions
async function loadRealForexFactoryData() {
    try {
        console.log('Loading real Forex Factory data...');
        
        // Test if proxy server is available
        try {
            const healthResponse = await fetch(`${PROXY_BASE_URL}/health`);
            if (!healthResponse.ok) {
                throw new Error('Proxy server not responding correctly');
            }
            console.log('✓ Proxy server is running');
        } catch (healthError) {
            throw new Error('Proxy server is not available. Please make sure it\'s running on port 3001.');
        }

        // Load calendar data
        const response = await fetch(`${PROXY_BASE_URL}/forexfactory/calendar`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✓ Successfully loaded Forex Factory data');
        return processForexFactoryData(data);
        
    } catch (error) {
        console.error('Error loading Forex Factory data:', error);
        
        // Show user-friendly error message
        if (error.message.includes('Proxy server is not available')) {
            showProxyError();
        } else {
            showLoadError(error.message);
        }
        
        // Fall back to sample data
        return generateSampleData();
    }
}

// Process Forex Factory XML data
function processForexFactoryData(data) {
    const events = [];
    
    try {
        // The actual structure will depend on Forex Factory's XML format
        // This is a generic implementation that may need adjustment
        
        if (data && data.weeklyevents && data.weeklyevents.event) {
            const eventsData = Array.isArray(data.weeklyevents.event) ? 
                data.weeklyevents.event : [data.weeklyevents.event];
            
            eventsData.forEach(event => {
                try {
                    // Parse event data based on Forex Factory's XML structure
                    const eventData = {
                        id: event.$.id || generateId(),
                        date: parseDate(event.$.date, event.$.time),
                        time: event.$.time,
                        currency: event.$.currency || 'USD',
                        title: event.title || 'Economic Event',
                        impact: parseImpact(event.impact),
                        actual: event.actual || null,
                        forecast: event.forecast || null,
                        previous: event.previous || null,
                        country: event.$.country || ''
                    };
                    
                    events.push(eventData);
                } catch (parseError) {
                    console.warn('Error parsing individual event:', parseError);
                }
            });
        }
        
        console.log(`Processed ${events.length} events from Forex Factory`);
        return events;
    } catch (error) {
        console.error('Error processing Forex Factory data:', error);
        return generateSampleData();
    }
}

// Load different weeks
async function loadCalendarWeek(week) {
    try {
        const weekParam = week || 'this';
        const response = await fetch(`${PROXY_BASE_URL}/forexfactory/calendar?week=${weekParam}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${week} week data`);
        }
        
        const data = await response.json();
        return processForexFactoryData(data);
    } catch (error) {
        console.error(`Error loading ${week} week data:`, error);
        showLoadError(`Failed to load ${week} week data: ${error.message}`);
        return generateSampleData();
    }
}

// Get event details
async function getEventDetails(eventId) {
    try {
        const response = await fetch(`${PROXY_BASE_URL}/forexfactory/event/${eventId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load event ${eventId}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error loading event ${eventId}:`, error);
        throw error;
    }
}

// Get event history
async function getEventHistory(eventId) {
    try {
        const response = await fetch(`${PROXY_BASE_URL}/forexfactory/history/${eventId}`);
        
        if (!response.ok) {
            throw new Error(`Failed to load history for event ${eventId}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error loading history for event ${eventId}:`, error);
        throw error;
    }
}

// Helper functions
function parseDate(dateString, timeString) {
    try {
        if (!dateString) return new Date();
        
        // Parse Forex Factory date format (adjust as needed based on actual format)
        let date;
        if (dateString.includes('/')) {
            const [month, day, year] = dateString.split('/');
            date = new Date(year, month - 1, day);
        } else {
            date = new Date(dateString);
        }
        
        // Parse time if available
        if (timeString) {
            const [time, period] = timeString.split(' ');
            if (time) {
                const [hours, minutes] = time.split(':');
                let hour = parseInt(hours);
                
                if (period === 'pm' && hour < 12) hour += 12;
                if (period === 'am' && hour === 12) hour = 0;
                
                date.setHours(hour, parseInt(minutes || 0), 0, 0);
            }
        }
        
        return date;
    } catch (error) {
        console.warn('Error parsing date:', error);
        return new Date();
    }
}

function parseImpact(impact) {
    if (!impact) return 'Low';
    
    const impactStr = String(impact).toLowerCase();
    if (impactStr.includes('high')) return 'High';
    if (impactStr.includes('medium')) return 'Medium';
    if (impactStr.includes('low')) return 'Low';
    return 'Low';
}

function generateId() {
    return 'event-' + Math.random().toString(36).substr(2, 9);
}

// Error display functions
function showProxyError() {
    const errorHtml = `
        <div class="error">
            <i class="fas fa-server fa-2x"></i>
            <h3>Proxy Server Required</h3>
            <p>To view real Forex Factory data, you need to run the proxy server:</p>
            <div class="error-instructions">
                <ol>
                    <li>Open a terminal/command prompt</li>
                    <li>Navigate to the <code>backend</code> directory</li>
                    <li>Run <code>npm install</code> to install dependencies</li>
                    <li>Run <code>npm start</code> to start the server</li>
                    <li>Refresh this page</li>
                </ol>
                <p>The server will run on <code>http://localhost:3001</code></p>
            </div>
            <button onclick="location.reload()" class="btn-primary">
                <i class="fas fa-sync-alt"></i> Retry Connection
            </button>
        </div>
    `;
    
    const container = document.querySelector('.news-container') || 
                     document.querySelector('.tab-content.active') || 
                     document.querySelector('.market-container');
    if (container) {
        container.innerHTML = errorHtml;
    }
}

function showLoadError(message) {
    const errorHtml = `
        <div class="error">
            <i class="fas fa-exclamation-triangle fa-2x"></i>
            <h3>Data Load Error</h3>
            <p>${message}</p>
            <p>Showing sample data for demonstration.</p>
            <button onclick="loadRealForexFactoryData()" class="btn-primary">
                <i class="fas fa-sync-alt"></i> Try Again
            </button>
        </div>
    `;
    
    const container = document.querySelector('.news-container') || 
                     document.querySelector('.tab-content.active') || 
                     document.querySelector('.market-container');
    if (container) {
        container.innerHTML = errorHtml;
    }
}

// Sample data generator (for demonstration when proxy is not available)
function generateSampleData() {
    console.log('Generating sample data for demonstration');
    
    const events = [];
    const impacts = ['High', 'Medium', 'Low'];
    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'NZD', 'CHF'];
    const eventTypes = [
        'Interest Rate Decision', 'GDP', 'CPI', 'Employment Change', 
        'Retail Sales', 'PMI', 'Trade Balance', 'Central Bank Speech'
    ];
    
    // Generate events for the current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        // Add 2-5 events per day
        const eventsCount = 2 + Math.floor(Math.random() * 4);
        for (let j = 0; j < eventsCount; j++) {
            const impact = impacts[Math.floor(Math.random() * impacts.length)];
            const currency = currencies[Math.floor(Math.random() * currencies.length)];
            const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            
            // Random time between 8am and 5pm
            const hour = 8 + Math.floor(Math.random() * 9);
            const minutes = Math.random() > 0.5 ? '30' : '00';
            const period = hour >= 12 ? 'pm' : 'am';
            const displayHour = hour > 12 ? hour - 12 : hour;
            
            events.push({
                id: `sample-${i}-${j}`,
                date: new Date(date),
                time: `${displayHour}:${minutes} ${period}`,
                currency: currency,
                title: `${currency} ${eventType}`,
                impact: impact,
                actual: impact === 'High' ? (Math.random() * 5).toFixed(1) : null,
                forecast: impact === 'High' ? (Math.random() * 5).toFixed(1) : null,
                previous: impact === 'High' ? (Math.random() * 5).toFixed(1) : null,
                country: currency === 'USD' ? 'US' : 
                         currency === 'EUR' ? 'EU' : 
                         currency === 'GBP' ? 'UK' : 
                         currency === 'JPY' ? 'JP' : 
                         currency === 'CAD' ? 'CA' : 
                         currency === 'AUD' ? 'AU' : 
                         currency === 'NZD' ? 'NZ' : 'CH'
            });
        }
    }
    
    return events;
}

// Initialize market data
async function initMarketData() {
    // Load crypto data by default on homepage
    if (document.getElementById('crypto')) {
        await loadMarketData('crypto');
    }
}

// Load market data for a specific category
async function loadMarketData(marketType) {
    const container = document.getElementById(marketType);
    if (!container) return;
    
    // Show loading state
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading ${marketType} data...
        </div>
    `;
    
    try {
        const symbols = MARKET_SYMBOLS[marketType];
        const data = await fetchMarketData(symbols);
        
        if (data && data.length > 0) {
            renderMarketData(container, data, marketType);
        } else {
            container.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    Failed to load ${marketType} data
                </div>
            `;
        }
    } catch (error) {
        console.error(`Error loading ${marketType} data:`, error);
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                Error loading ${marketType} data
            </div>
        `;
    }
}

// Market symbols
const MARKET_SYMBOLS = {
    crypto: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD', 'AVAX-USD'],
    forex: ['EURUSD=X', 'GBPUSD=X', 'JPY=X', 'AUDUSD=X', 'CADUSD=X', 'CHFUSD=X', 'CNYUSD=X', 'NZDUSD=X'],
    indices: ['^GSPC', '^DJI', '^IXIC', '^RUT', '^FTSE', '^N225', '^HSI', '^STOXX50E'],
    commodities: ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'ZC=F', 'ZS=F', 'KE=F', 'HG=F']
};

// Fetch market data from Yahoo Finance
async function fetchMarketData(symbols) {
    try {
        // Using Yahoo Finance API
        const promises = symbols.map(symbol => {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
            
            return fetch(url)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (!data.chart || !data.chart.result) return null;
                    
                    const result = data.chart.result[0];
                    const meta = result.meta;
                    const previousClose = meta.previousClose;
                    const currentPrice = meta.regularMarketPrice;
                    const change = currentPrice - previousClose;
                    const changePercent = (change / previousClose) * 100;
                    
                    return {
                        symbol: symbol,
                        name: getSymbolName(symbol),
                        price: currentPrice,
                        change: change,
                        changePercent: changePercent,
                        previousClose: previousClose,
                        volume: meta.regularMarketVolume || 0
                    };
                })
                .catch(error => {
                    console.error(`Error fetching data for ${symbol}:`, error);
                    return null;
                });
        });
        
        const results = await Promise.all(promises);
        return results.filter(item => item !== null);
        
    } catch (error) {
        console.error('Error in fetchMarketData:', error);
        return null;
    }
}

// Get display name for symbol
function getSymbolName(symbol) {
    const symbolNames = {
        'BTC-USD': 'Bitcoin',
        'ETH-USD': 'Ethereum',
        'SOL-USD': 'Solana',
        'BNB-USD': 'Binance Coin',
        'XRP-USD': 'Ripple',
        'ADA-USD': 'Cardano',
        'DOGE-USD': 'Dogecoin',
        'AVAX-USD': 'Avalanche',
        'EURUSD=X': 'EUR/USD',
        'GBPUSD=X': 'GBP/USD',
        'JPY=X': 'USD/JPY',
        'AUDUSD=X': 'AUD/USD',
        'CADUSD=X': 'CAD/USD',
        'CHFUSD=X': 'CHF/USD',
        'CNYUSD=X': 'CNY/USD',
        'NZDUSD=X': 'NZD/USD',
        '^GSPC': 'S&P 500',
        '^DJI': 'Dow Jones',
        '^IXIC': 'NASDAQ',
        '^RUT': 'Russell 2000',
        '^FTSE': 'FTSE 100',
        '^N225': 'Nikkei 225',
        '^HSI': 'Hang Seng',
        '^STOXX50E': 'STOXX 50',
        'GC=F': 'Gold',
        'SI=F': 'Silver',
        'CL=F': 'Crude Oil',
        'NG=F': 'Natural Gas',
        'ZC=F': 'Corn',
        'ZS=F': 'Soybeans',
        'KE=F': 'Wheat',
        'HG=F': 'Copper'
    };
    
    return symbolNames[symbol] || symbol;
}

// Render market data to the page
function renderMarketData(container, data, marketType) {
    const tableHTML = `
        <div class="market-table">
            <div class="table-row header">
                <div class="table-cell">Symbol</div>
                <div class="table-cell">Price</div>
                <div class="table-cell">Change</div>
                <div class="table-cell">Change %</div>
                <div class="table-cell">Volume</div>
            </div>
            ${data.map(item => `
                <div class="table-row">
                    <div class="table-cell">
                        <span class="symbol-name">${item.name}</span>
                        <span class="symbol-ticker">${item.symbol}</span>
                    </div>
                    <div class="table-cell">${formatCurrency(item.price, item.symbol.includes('=X') || item.symbol.includes('JPY=') ? 4 : 2)}</div>
                    <div class="table-cell ${item.change >= 0 ? 'positive' : 'negative'}">
                        ${item.change >= 0 ? '+' : ''}${formatCurrency(item.change, item.symbol.includes('=X') || item.symbol.includes('JPY=') ? 4 : 2)}
                    </div>
                    <div class="table-cell ${item.changePercent >= 0 ? 'positive' : 'negative'}">
                        ${item.changePercent >= 0 ? '+' : ''}${formatNumber(item.changePercent)}%
                    </div>
                    <div class="table-cell">${formatNumber(item.volume)}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = tableHTML;
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

// Export functions for use in main.js
window.ForexFactoryAPI = {
    loadRealForexFactoryData,
    loadCalendarWeek,
    getEventDetails,
    getEventHistory
};

window.MarketData = {
    initMarketData,
    loadMarketData
};
// data.js - Yahoo Finance data fetching functionality
const MARKET_SYMBOLS = {
    crypto: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD', 'AVAX-USD'],
    forex: ['EURUSD=X', 'GBPUSD=X', 'JPY=X', 'AUDUSD=X', 'CADUSD=X', 'CHFUSD=X', 'CNYUSD=X', 'NZDUSD=X'],
    indices: ['^GSPC', '^DJI', '^IXIC', '^RUT', '^FTSE', '^N225', '^HSI', '^STOXX50E'],
    commodities: ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'ZC=F', 'ZS=F', 'KE=F', 'HG=F']
};

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
            // Fallback to demo data if API fails
            renderDemoMarketData(container, marketType);
        }
    } catch (error) {
        console.error(`Error loading ${marketType} data:`, error);
        // Fallback to demo data
        renderDemoMarketData(container, marketType);
    }
}

// Fetch market data from Yahoo Finance
async function fetchMarketData(symbols) {
    try {
        // Using Yahoo Finance API through a proxy to avoid CORS issues
        const promises = symbols.map(symbol => {
            // Using a CORS proxy
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
            
            return fetch(proxyUrl + targetUrl, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
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

// Fallback demo data if API fails
function renderDemoMarketData(container, marketType) {
    const demoData = {
        crypto: [
            { symbol: 'BTC-USD', name: 'Bitcoin', price: 37428.90, change: 823.45, changePercent: 2.25, volume: 24567893210 },
            { symbol: 'ETH-USD', name: 'Ethereum', price: 2045.67, change: 34.21, changePercent: 1.70, volume: 14235678901 },
            { symbol: 'SOL-USD', name: 'Solana', price: 41.23, change: -0.45, changePercent: -1.08, volume: 1789654321 },
            { symbol: 'BNB-USD', name: 'Binance Coin', price: 312.56, change: 5.78, changePercent: 1.88, volume: 9876543210 }
        ],
        forex: [
            { symbol: 'EURUSD=X', name: 'EUR/USD', price: 1.0924, change: -0.0045, changePercent: -0.41, volume: 0 },
            { symbol: 'GBPUSD=X', name: 'GBP/USD', price: 1.2678, change: 0.0023, changePercent: 0.18, volume: 0 },
            { symbol: 'JPY=X', name: 'USD/JPY', price: 112.34, change: 0.56, changePercent: 0.50, volume: 0 },
            { symbol: 'AUDUSD=X', name: 'AUD/USD', price: 0.7567, change: -0.0034, changePercent: -0.45, volume: 0 }
        ],
        indices: [
            { symbol: '^GSPC', name: 'S&P 500', price: 4567.23, change: 36.45, changePercent: 0.80, volume: 3456789000 },
            { symbol: '^DJI', name: 'Dow Jones', price: 35421.89, change: 123.67, changePercent: 0.35, volume: 2345678000 },
            { symbol: '^IXIC', name: 'NASDAQ', price: 14235.67, change: 89.12, changePercent: 0.63, volume: 4567890000 },
            { symbol: '^FTSE', name: 'FTSE 100', price: 7564.32, change: -23.45, changePercent: -0.31, volume: 1234567000 }
        ],
        commodities: [
            { symbol: 'GC=F', name: 'Gold', price: 1980.50, change: 12.30, changePercent: 0.62, volume: 0 },
            { symbol: 'SI=F', name: 'Silver', price: 24.56, change: -0.23, changePercent: -0.93, volume: 0 },
            { symbol: 'CL=F', name: 'Crude Oil', price: 78.90, change: 1.23, changePercent: 1.58, volume: 0 },
            { symbol: 'NG=F', name: 'Natural Gas', price: 3.45, change: -0.12, changePercent: -3.36, volume: 0 }
        ]
    };
    
    const data = demoData[marketType] || [];
    renderMarketData(container, data, marketType);
    
    // Add a warning that demo data is being shown
    const warning = document.createElement('div');
    warning.className = 'demo-warning';
    warning.innerHTML = `<i class="fas fa-info-circle"></i> Showing demo data. Real-time data unavailable.`;
    container.appendChild(warning);
}

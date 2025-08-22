// data.js - Real market data from Yahoo Finance
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
        const data = await fetchYahooFinanceData(symbols);
        
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

// Fetch data from Yahoo Finance API
async function fetchYahooFinanceData(symbols) {
    try {
        // Using Yahoo Finance API through a CORS proxy
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
        console.error('Error in fetchYahooFinanceData:', error);
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

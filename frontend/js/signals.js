// signals.js - Trading signals functionality
async function loadSignals() {
    const container = document.querySelector('.signals-container');
    if (!container) return;
    
    // Show loading state
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            Loading trading signals...
        </div>
    `;
    
    try {
        // Try to fetch signals from your server
        const signals = await fetchSignalsFromServer();
        
        if (signals && signals.length > 0) {
            renderSignals(container, signals);
        } else {
            container.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    No signals available at this time
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading signals:', error);
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                Error loading signals
            </div>
        `;
    }
}

// Fetch signals from your server
async function fetchSignalsFromServer() {
    try {
        const response = await fetch('http://localhost:8501/api/signals');
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching signals from server:', error);
        return null;
    }
}

// Render signals to the page
function renderSignals(container, signals) {
    const signalsHTML = `
        <div class="signals-grid">
            ${signals.map(signal => `
                <div class="signal-card ${signal.type.toLowerCase().replace('_', '-')}">
                    <div class="signal-header">
                        <span class="signal-type">${signal.type.replace('_', ' ')}</span>
                        <span class="signal-time">${formatTimeAgo(signal.timestamp)}</span>
                    </div>
                    <div class="signal-body">
                        <h3>${signal.name} (${signal.symbol})</h3>
                        <p>Current Price: ${formatCurrency(signal.currentPrice, signal.symbol.includes('=X') ? 4 : 2)}</p>
                        <div class="signal-details">
                            ${signal.entryPrice ? `
                                <div class="detail">
                                    <span class="label">Entry</span>
                                    <span class="value">${formatCurrency(signal.entryPrice, signal.symbol.includes('=X') ? 4 : 2)}</span>
                                </div>
                                <div class="detail">
                                    <span class="label">Stop</span>
                                    <span class="value">${formatCurrency(signal.stopLoss, signal.symbol.includes('=X') ? 4 : 2)}</span>
                                </div>
                                <div class="detail">
                                    <span class="label">Target</span>
                                    <span class="value">${formatCurrency(signal.takeProfit, signal.symbol.includes('=X') ? 4 : 2)}</span>
                                </div>
                            ` : `
                                <div class="detail full-width">
                                    <span class="label">Status</span>
                                    <span class="value">Waiting for breakout</span>
                                </div>
                            `}
                        </div>
                        <div class="signal-meta">
                            <div class="meta-item">
                                <span class="label">Strength</span>
                                <div class="strength-bar">
                                    <div class="strength-fill" style="width: ${signal.strength * 100}%"></div>
                                </div>
                                <span class="value">${Math.round(signal.strength * 100)}%</span>
                            </div>
                            <div class="meta-item">
                                <span class="label">Timeframe</span>
                                <span class="value">${signal.timeframe}</span>
                            </div>
                            <div class="meta-item">
                                <span class="label">Risk</span>
                                <span class="value ${signal.riskLevel.toLowerCase()}">${signal.riskLevel}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = signalsHTML;
}

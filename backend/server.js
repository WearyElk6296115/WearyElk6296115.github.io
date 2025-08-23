// server.js - Forex Factory Proxy Server
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend (optional, for development)
app.use(express.static(path.join(__dirname, '../frontend')));

// Forex Factory endpoints
const FOREX_FACTORY_BASE_URL = 'https://www.forexfactory.com';

// Helper function to fetch and parse XML
async function fetchForexFactoryData(url) {
    try {
        console.log('Fetching from Forex Factory:', url);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/xml, text/xml, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.forexfactory.com/'
            },
            timeout: 10000
        });
        
        // Parse XML to JSON
        const parser = new xml2js.Parser({
            explicitArray: false,
            mergeAttrs: true,
            ignoreAttrs: false
        });
        
        return new Promise((resolve, reject) => {
            parser.parseString(response.data, (err, result) => {
                if (err) {
                    console.error('XML parsing error:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching Forex Factory data:', error.message);
        throw error;
    }
}

// Routes
app.get('/api/forexfactory/calendar', async (req, res) => {
    try {
        const { week } = req.query;
        let url;
        
        switch(week) {
            case 'next':
                url = `${FOREX_FACTORY_BASE_URL}/ffcal_week_next.xml`;
                break;
            case 'last':
                url = `${FOREX_FACTORY_BASE_URL}/ffcal_week_last.xml`;
                break;
            default:
                url = `${FOREX_FACTORY_BASE_URL}/ffcal_week_this.xml`;
        }
        
        console.log('Fetching calendar data from:', url);
        const data = await fetchForexFactoryData(url);
        res.json(data);
    } catch (error) {
        console.error('Calendar fetch error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch calendar data',
            message: error.message,
            details: 'Make sure the Forex Factory URL is correct and accessible'
        });
    }
});

// Additional endpoints would go here...

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Forex Factory proxy server is running'
    });
});

// Serve frontend for any other requests (for development)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Forex Factory Proxy Server`);
    console.log(`=================================`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
    console.log(`Calendar data: http://localhost:${PORT}/api/forexfactory/calendar`);
    console.log(`=================================`);
    console.log(`Note: This server proxies requests to Forex Factory`);
    console.log(`and requires an internet connection to work properly.`);
    console.log(`=================================`);
});
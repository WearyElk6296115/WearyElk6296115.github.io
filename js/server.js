// server.js - Forex Factory Proxy Server
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Forex Factory endpoints
const FOREX_FACTORY_BASE_URL = 'https://www.forexfactory.com';

// Helper function to fetch and parse XML
async function fetchForexFactoryData(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        // Parse XML to JSON
        const parser = new xml2js.Parser({
            explicitArray: false,
            mergeAttrs: true
        });
        
        return new Promise((resolve, reject) => {
            parser.parseString(response.data, (err, result) => {
                if (err) reject(err);
                else resolve(result);
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
        const url = week ? 
            `${FOREX_FACTORY_BASE_URL}/ffcal_week_${week}.xml` :
            `${FOREX_FACTORY_BASE_URL}/ffcal_week_this.xml`;
        
        const data = await fetchForexFactoryData(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch calendar data',
            message: error.message 
        });
    }
});

app.get('/api/forexfactory/event/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const url = `${FOREX_FACTORY_BASE_URL}/event/${eventId}`;
        
        const data = await fetchForexFactoryData(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch event data',
            message: error.message 
        });
    }
});

app.get('/api/forexfactory/history/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const url = `${FOREX_FACTORY_BASE_URL}/history/${eventId}`;
        
        const data = await fetchForexFactoryData(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch event history',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Forex Factory proxy server running on port ${PORT}`);
    console.log(`Endpoints:`);
    console.log(`- GET /api/health - Health check`);
    console.log(`- GET /api/forexfactory/calendar - Current week's calendar`);
    console.log(`- GET /api/forexfactory/calendar?week=next - Next week's calendar`);
    console.log(`- GET /api/forexfactory/calendar?week=last - Last week's calendar`);
    console.log(`- GET /api/forexfactory/event/:eventId - Specific event details`);
    console.log(`- GET /api/forexfactory/history/:eventId - Event history`);
});

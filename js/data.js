// data.js - Real Forex Factory data integration
const PROXY_BASE_URL = 'http://localhost:3001/api';

// Forex Factory data functions
async function loadRealForexFactoryData() {
    try {
        // Test proxy connection first
        const healthCheck = await fetch(`${PROXY_BASE_URL}/health`);
        if (!healthCheck.ok) {
            throw new Error('Proxy server is not running');
        }

        // Load calendar data
        const response = await fetch(`${PROXY_BASE_URL}/forexfactory/calendar`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return processForexFactoryData(data);
        
    } catch (error) {
        console.error('Error loading Forex Factory data:', error);
        throw error;
    }
}

// Process Forex Factory XML data
function processForexFactoryData(data) {
    // The structure will depend on the actual XML format from Forex Factory
    // This is a generic implementation that may need adjustment
    
    const events = [];
    
    try {
        // Extract events from the XML structure
        // Note: This structure might need adjustment based on the actual XML format
        if (data && data.weeklyevents && data.weeklyevents.event) {
            const eventsData = Array.isArray(data.weeklyevents.event) ? 
                data.weeklyevents.event : [data.weeklyevents.event];
            
            eventsData.forEach(event => {
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
            });
        }
        
        return events;
    } catch (error) {
        console.error('Error processing Forex Factory data:', error);
        return [];
    }
}

// Helper functions
function parseDate(dateString, timeString) {
    try {
        // Parse Forex Factory date format (adjust as needed)
        const [month, day, year] = dateString.split('/');
        const [time, period] = timeString.split(' ');
        const [hours, minutes] = time.split(':');
        
        let hour = parseInt(hours);
        if (period === 'pm' && hour < 12) hour += 12;
        if (period === 'am' && hour === 12) hour = 0;
        
        return new Date(year, month - 1, day, hour, parseInt(minutes || 0));
    } catch (error) {
        console.warn('Error parsing date:', error);
        return new Date();
    }
}

function parseImpact(impact) {
    const impactStr = String(impact || '').toLowerCase();
    if (impactStr.includes('high')) return 'High';
    if (impactStr.includes('medium')) return 'Medium';
    if (impactStr.includes('low')) return 'Low';
    return 'Low';
}

function generateId() {
    return 'event-' + Math.random().toString(36).substr(2, 9);
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
        throw error;
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

// Export functions for use in main.js
window.ForexFactoryAPI = {
    loadRealForexFactoryData,
    loadCalendarWeek,
    getEventDetails,
    getEventHistory
};

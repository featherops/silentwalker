const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let devices = [];

// API Routes
app.post('/api/device', (req, res) => {
    try {
        const { deviceFingerprint, password, timestamp, deviceInfo } = req.body;
        
        // Check if device already exists
        const existingDeviceIndex = devices.findIndex(d => d.deviceFingerprint === deviceFingerprint);
        
        const deviceData = {
            deviceFingerprint,
            password,
            timestamp,
            deviceInfo,
            isLocked: true,
            lastSeen: new Date().toISOString()
        };
        
        if (existingDeviceIndex >= 0) {
            // Update existing device
            devices[existingDeviceIndex] = deviceData;
        } else {
            // Add new device
            devices.push(deviceData);
        }
        
        console.log(`Device registered/updated: ${deviceFingerprint}`);
        res.status(200).json({ success: true, message: 'Device registered successfully' });
    } catch (error) {
        console.error('Error registering device:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/api/devices', (req, res) => {
    res.json(devices);
});

app.post('/api/unlock/:fingerprint', (req, res) => {
    try {
        const { fingerprint } = req.params;
        const device = devices.find(d => d.deviceFingerprint === fingerprint);
        
        if (device) {
            device.isLocked = false;
            console.log(`Device unlocked: ${fingerprint}`);
            res.json({ success: true, message: 'Device unlocked' });
        } else {
            res.status(404).json({ success: false, message: 'Device not found' });
        }
    } catch (error) {
        console.error('Error unlocking device:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.delete('/api/device/:fingerprint', (req, res) => {
    try {
        const { fingerprint } = req.params;
        const deviceIndex = devices.findIndex(d => d.deviceFingerprint === fingerprint);
        
        if (deviceIndex >= 0) {
            devices.splice(deviceIndex, 1);
            console.log(`Device removed: ${fingerprint}`);
            res.json({ success: true, message: 'Device removed' });
        } else {
            res.status(404).json({ success: false, message: 'Device not found' });
        }
    } catch (error) {
        console.error('Error removing device:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Silent Walker Server is running',
        timestamp: new Date().toISOString(),
        devices: devices.length
    });
});

// Serve the web interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Silent Walker Server running on port ${PORT}`);
    console.log(`Web interface available at: http://localhost:${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
}); 
// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const Service = require('./models/Service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// API Endpoints

// Add a new service
app.post('/services', async (req, res) => {
    const { name, description, price } = req.body;
    if (!name || !description || price == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const service = new Service({ name, description, price });
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all services
app.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a service
app.put('/services/:id', async (req, res) => {
    const { name, description, price } = req.body;
    if (!name || !description || price == null) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, { name, description, price }, { new: true });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a service
app.delete('/services/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

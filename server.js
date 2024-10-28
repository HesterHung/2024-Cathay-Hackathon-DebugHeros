const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to serve static files (if needed)
app.use(express.static('public'));

// Route to fetch items from Django API
app.get('/api/items', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/api/items/');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from Django API');
    }
});

app.listen(port, () => {
    console.log(`Node.js server running at http://localhost:5500`);
});
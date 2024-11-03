import express from 'express';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from root directory
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    },
    extensions: ['js']
}));

// Route to fetch items from Django API
app.get('/api/items', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/api/items/');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching data from Django API');
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Node.js server running at http://localhost:${port}`);
});
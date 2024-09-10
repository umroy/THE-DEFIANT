const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// Fetch DeFi News from Gaianet API
app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get('https://newsapi.org/v2/everything?q=cryptocurrency&apiKey=189ca8e614444c369784296dd2009b4d'); // Replace with real API endpoint
        const news = response.data;
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching news' });
    }
});

// Fetch Protocols Information from Gaianet API
app.get('/api/protocols', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/defi'); // Replace with real API endpoint
        const protocols = response.data;
        res.json(protocols);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching protocols' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

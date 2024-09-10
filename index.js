const express = require('express');
const axios = require('axios');
const llamaEdgeBaseUrl = process.env.LLAMAEDGE_BASE_URL;
const llamaEdgeModelName = process.env.LLAMAEDGE_MODEL_NAME;
const llamaEdgeApiKey = process.env.LLAMAEDGE_API_KEY;
require('dotenv').config(); // Make sure this line is included to load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// Base URL and API Key for Gaianet API
const BASE_URL = 'https://llamatool.us.gaianet.network/v1';
const API_KEY = process.env.GAIANET_API_KEY; // Fetch the API key from environment variables
const options = {
    headers: {
        'Authorization': `Bearer ${process.env.LLAMAEDGE_API_KEY}`
    }
};

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/ask', async (req, res) => {
    const { question } = req.body;
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: question,
            max_tokens: 150,
        });
        res.json(completion.data.choices[0].text);
    } catch (error) {
        res.status(500).json({ error: 'Failed to answer question' });
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('The Defiant Research Assistant API is running.');
});

// Route to fetch protocol details from Gaianet API
app.get('/protocol/:name', async (req, res) => {
    const protocolName = req.params.name;
    const url = `${BASE_URL}/protocols/${protocolName}`;
    try {
        
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${API_KEY}` // Set the API key in the headers
            }
        });
        const protocol = {
            name: response.data.name,
            symbol: response.data.symbol,
            market_data: response.data.market_data
        };
        res.json(protocol);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch protocol data' });
    }
});

async function getLlamaResponse(prompt) {
    const url = `${process.env.LLAMAEDGE_BASE_URL}/models/${process.env.LLAMAEDGE_MODEL_NAME}`/predict;
    try {
        const response = await axios.post(url, { prompt }, options);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


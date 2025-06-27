
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { onRequest } = require('firebase-functions/v2/https'); 

const app = express();


app.use(cors({ origin: true }));
app.use(express.json());

app.post('/api/get-place-image-data', async (req, res) => {
    const { searchQuery } = req.body;


    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_KEY;

    if (!UNSPLASH_ACCESS_KEY) {
        console.error("Unsplash Access Key not configured in Firebase Functions config.");
        return res.status(500).json({ message: "Server configuration error: Unsplash Access Key missing." });
    }

    if (!searchQuery) {
        return res.status(400).json({ message: "Search query is required." });
    }

    try {
        const unsplashResponse = await axios.get('https://api.unsplash.com/search/photos', {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
            },
            params: {
                query: searchQuery,
                per_page: 1,
            },
        });

        if (unsplashResponse.data.results && unsplashResponse.data.results.length > 0) {
            res.json({ imageUrl: unsplashResponse.data.results[0].urls.regular });
        } else {
            res.json({ imageUrl: 'N/A' });
        }
    } catch (error) {
        console.error("Error fetching image from Unsplash:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to fetch image from Unsplash." });
    }
});


exports.api = onRequest(
    { secrets: ["UNSPLASH_KEY"], region: 'us-central1' },
    app
);
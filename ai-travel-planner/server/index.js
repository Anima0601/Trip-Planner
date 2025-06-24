const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // Make sure this is at the very top to load environment variables

const app = express();
const port = 3001; // Ensure this matches the port your frontend fetches from

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// This endpoint will now accept a 'searchQuery' in its request body
app.post('/api/get-place-image-data', async (req, res) => {
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
    const { searchQuery } = req.body; // Expecting 'searchQuery' from the frontend

    // Basic validation for API key
    if (!UNSPLASH_ACCESS_KEY) {
        console.error('Error: UNSPLASH_ACCESS_KEY is not set!');
        return res.status(500).json({ error: 'Server configuration error: API key missing.' });
    }

    // Fallback or error if no search query is provided by the client
    if (!searchQuery) {
        console.warn('No searchQuery provided for /api/get-place-image-data. Returning generic placeholder.');
        return res.json({ imageUrl: `https://via.placeholder.com/400?text=Image+Query+Missing` });
    }

    try {
        // Make the API call to Unsplash using the provided searchQuery
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: searchQuery, // Use the query from the frontend
                orientation: 'squarish', // You can change this (e.g., 'landscape', 'portrait')
                per_page: 30 // Number of results to fetch, higher count increases randomness
            },
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` // Use your Unsplash Access Key
            }
        });

        const photos = response.data.results;

        if (photos && photos.length > 0) {
            // Pick a random image from the results
            const randomIndex = Math.floor(Math.random() * photos.length);
            const imageUrl = photos[randomIndex].urls.regular; // 'regular' is a good size

            res.json({ imageUrl });
        } else {
            // Fallback if Unsplash finds no images for the given query
            console.warn(`No images found on Unsplash for query: "${searchQuery}"`);
            res.json({ imageUrl: `https://via.placeholder.com/400?text=No+Image+for+${encodeURIComponent(searchQuery)}` });
        }

    } catch (error) {
        console.error(`Error fetching image for "${searchQuery}" from Unsplash API:`, error.message);
        // Provide a generic fallback in case of any network or API error
        res.status(500).json({ imageUrl: `https://via.placeholder.com/400?text=Error+Loading+Image` });
    }
});

app.listen(port, () => {
  console.log(`Backend proxy listening on port ${port}`);
});
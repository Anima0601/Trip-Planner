const express = require('express');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

app.post('/api/auth/google', async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: 'No access token provided.' });
  }

  try {
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const payload = userInfoResponse.data;

    const userId = payload['sub'];
    const userEmail = payload['email'];
    const userName = payload['name'];
    const userPicture = payload['picture'];

    const jwtToken = jwt.sign(
      { userId: userId, email: userEmail, name: userName },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Google authentication successful',
      token: jwtToken,
      user: { userId, userEmail, userName, userPicture }
    });

  } catch (error) {
    console.error('Error fetching Google user info or verifying access token:', error.response?.data || error.message);
    res.status(401).json({ message: `Authentication failed: ${error.response?.data?.error_description || error.message}` });
  }
});

app.post('/api/get-place-image-data', async (req, res) => {
  const { searchQuery } = req.body;
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  if (!UNSPLASH_ACCESS_KEY) {
    return res.status(500).json({ message: "Unsplash Access Key not configured." });
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

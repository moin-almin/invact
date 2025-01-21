const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: process.env.MICROSERVICE_BASE_URL,
    headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
    },
})

const searchImages = async (req, res) => {
    try {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({message: 'No query found.'});
        }

        if (!process.env.UNSPLASH_ACCESS_KEY) {
            return res.status(400).json({message: 'Please configure Access Key in .env.'});
        }

        const response = await axiosInstance.get(`/search/photos?query=${query}`, {
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });

        if (response.data.results.length === 0) {
            return res.status(404).json({message: 'No images found for the given query.'});
        }

        const photos = response.data.results.map((photo) => ({
            imageUrl: photo.urls.raw,
            description: photo.description,
            alt_description: photo.alt_description
        }));

        res.json({ photos });
    } catch {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
}

module.exports = { searchImages };
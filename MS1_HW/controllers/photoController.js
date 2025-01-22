const axios = require('axios');
const { validatePhoto, validateTags} = require('../validations');
const {
    photo: photoModel,
    tag: tagModel,
} = require('../models');

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
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch images." });
    }
}

const savePhoto = async (req, res) => {
    const photoData = req.body;
    const errors = validatePhoto(photoData);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        const newPhoto = await photoModel.create({
            imageUrl: photoData.imageUrl,
            description: photoData.description,
            alt_description: photoData.alt_description,
            userId: photoData.userId,
        });

        const tagErrors = await validateTags(photoData.tags, newPhoto.id);
        if (tagErrors.length > 0) return res.status(400).json({ tagErrors });

        if (photoData.tags && photoData.tags.length > 0) {
            for (const tag of photoData.tags) {
                const savedTag = await tagModel.create({
                    name: tag,
                    photoId: newPhoto.id,
                })
            }
        }

        res.status(200).json({message: "Photo saved successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to save photo." });
    }
}

module.exports = { searchImages, savePhoto };
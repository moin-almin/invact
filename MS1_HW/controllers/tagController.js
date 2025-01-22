const {validateTags} = require("../validations");

const {
    tag: tagModel,
    photo: photoModel,
    searchHistory: searchHistoryModel,
} = require("../models");

const addTags = async (req, res) => {
    const { tags } = req.body;
    const photoId = parseInt(req.params.photoId);

    if(!photoId || typeof photoId !== "number") {
        return res.status(400).json({ error: "Invalid photoId." });
    }

    const errors = await validateTags(tags, photoId);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                const savedTag = await tagModel.create({
                    name: tag,
                    photoId
                })
            }
        }

        res.status(200).json({message: "Tags added successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to add tag." });
    }
}

const searchByTag = async (req, res) => {
    try {
        let tags = req.query.tags;
        let sort = req.query.sort;
        let userId = parseInt(req.query.userId);

        let existingtags = await tagModel.findAll({
            where: {name: tags},
            order: [['createdAt', 'DESC']],
        });

        let photos = [];

        for (let tag of existingtags) {
            let photo = await photoModel.findOne({ where: { id: tag.photoId}});
            photos.push({photo});
        }

        if (sort === 'DESC') {
            photos.sort((photo1, photo2) => {
                return photo2.photo.dateSaved - photo1.photo.dateSaved;
            });
        } else {
            photos.sort((photo1, photo2) => {
                return photo1.photo.dateSaved - photo2.photo.dateSaved;
            });
        }

        if (userId) {
            await searchHistoryModel.create({
                query: tags,
                userId
            })
        }

        res.status(200).json({photos});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to find image by tag." });
    }
}

module.exports = { addTags, searchByTag };
const { validateUserId } = require("../validations");

const {
    searchHistory: searchHistoryModel
} = require("../models");

const getSearchHistory = async (req, res) => {
    try {
        let userId = parseInt(req.query.userId);

        let errors = validateUserId(userId);
        if (errors.length > 0) return res.status(400).json({ errors });

        let results = await searchHistoryModel.findAll({
            where: {userId}
        });

        if (results.length === 0) {
            return res.status(404).json({error: "No search history found"});
        }

        const searchHistory = results.map((searchHist) => ({
            query: searchHist.query,
            timestamp: searchHist.timestamp,
        }));

        res.status(200).json({searchHistory});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Failed to get search history."});
    }
}

module.exports = {
    getSearchHistory
}
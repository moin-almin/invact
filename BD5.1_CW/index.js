const express = require('express');
let {track} = require('./models/track.model');
let {sequelize} = require('./lib/index');
const app = express();

const PORT = 8080;
app.use(express.json());

let movieData = [
    {
        name: "Raabta",
        genre: "Romantic",
        release_year: 2012,
        artist: "Arijit Singh",
        album: "Agent Vinod",
        duration: 4
    },
    {
        name: "Naina Da Kya Kasoor",
        genre: "Pop",
        release_year: 2018,
        artist: "Amit Trivedi",
        album: "Andhadhun",
        duration: 3
    }
];

app.get('/seed_db', async (req, res) => {
    try {
        await sequelize.sync({force: true});

        await track.bulkCreate(movieData);

        res.status(200).json({message: "Database seeding successful."});
    } catch (error) {
        res.status(500).json({
            message: "Error seeding the data.",
            error: error.message });
    }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
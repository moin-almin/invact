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

async function fetchAllTracks(){
    let tracks = await track.findAll();
    return { tracks };
}

app.get('/tracks', async (req, res) => {
    try {
        let response = await fetchAllTracks();

        if (response.tracks.length === 0) {
            return res.status(404).json({ message: "No tracks found." });
        }
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: 'Error while fetching data.', error: error.message });
    }
})

async function fetchTrackById(id) {
    return await track.findOne({where: {id}});
}

app.get('/tracks/details/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let result = await fetchTrackById(id);
        if (result === null) {
            return res.status(404).json({message: "No track with id " + id});
        }
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: 'Error while fetching data.', error: error.message });
    }
});

async function fetchTracksByArtist(artist) {
    return await track.findAll({ where: {artist}});
}

app.get('/tracks/artist/:artist', async (req, res) => {
    try {
        let artist = req.params.artist;

        let result = await fetchTracksByArtist(artist);
        if (result.length === 0) {
            return res.status(404).json({message: "No track by artist " + artist});
        }
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: 'Error while fetching data.', error: error.message });
    }
});

async function sortTracksByReleaseYear(order) {
    let sortedTracks = await track.findAll({
        order: [['release_year', order]],
    });
    return { tracks: sortedTracks };
}
app.get('/tracks/sort/release_year', async (req, res) => {
    try {
        let order = req.query.order;
        let result = await sortTracksByReleaseYear(order);
        if (result.tracks.length === 0) {
            return res.status(404).json({message: "No tracks found."});
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message: 'Error while fetching data.', error: error.message });
    }
});

async function addNewTrack(trackData) {
    let newTrack = await track.create(trackData);
    return { newTrack }
}

app.post('/tracks/new', async (req, res) => {
    try {
        let newTrack = req.body.newTrack;
        let response = await addNewTrack(newTrack);
        return res.status(200).json(response);

    } catch (error) {
        res.status(500).json({message: 'Error while adding new track.', error: error.message });
    }
});

async function updateTrackById(updatedTrackData, id) {
    let trackDetails = await track.findOne({ where: { id }});
    if (!trackDetails) {
        return {};
    }

    trackDetails.set(updatedTrackData);
    let updatedTrack = await trackDetails.save();
    return { message: "Track updated successfully.", updatedTrack };

}

app.post('/tracks/update/:id', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let newTrackData = req.body;

        let response = await updateTrackById(newTrackData, id);
        if (!response.message) {
            return res.status(404).json({message: "No track with id " + id});
        }
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: 'Error while updating track.', error: error.message });
    }
})

async function deleteTrackById(trackId) {
    let destroyedTrack = await track.destroy({ where: { id: trackId }});

    if (destroyedTrack === 0) return {};

    return {message: "Track record deleted."};
}

app.post('/tracks/delete/', async (req, res) => {
    try {
        let id = parseInt(req.body.id);

        let response = await deleteTrackById(id);

        if (!response.message) {
            return res.status(404).json({message: "No track with id " + id});
        }
        return res.status(200).json(response);
    } catch (error) {
        res.status(500).json({message: 'Error while deleting track.', error: error.message });
    }
})
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
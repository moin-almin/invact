const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createItinerary, getItinerary } = require("./controllers/dataController");
const { getFlights, getHotels, getSites, getFlightsByOriginAndDestination } = require("./controllers/itineraryController");
const { sequelize } = require("./models");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/itinerary", createItinerary);
app.get("/itinerary", getItinerary);

app.get("/data/flights", getFlights);
app.get("/data/hotels", getHotels);
app.get("/data/sites", getSites);
app.get("/flights/search", getFlightsByOriginAndDestination);

sequelize.authenticate().then(() => {
    console.log('Database connected')
}).catch(error => {
    console.log('Unable to connect to database', error);
});

app.listeb(3000, () => {
    console.log('Server is running on port 3000')
})
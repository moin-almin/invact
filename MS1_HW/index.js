const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createNewUser } = require("./controllers/userController");
const { searchImages, savePhoto} = require("./controllers/photoController");
const { addTags, searchByTag} = require("./controllers/tagController");
const { sequelize } = require("./models");
const {getSearchHistory} = require("./controllers/searchHistoryController");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/users", createNewUser);

app.get('/api/photos/search', searchImages);
app.post('/api/photos', savePhoto);
app.post('/api/photos/:photoId/tags', addTags);
app.get('/api/photos/tag/search', searchByTag);
app.get('/api/search-history', getSearchHistory);


sequelize.authenticate().then(() => {
    console.log('Database connected')
}).catch(error => {
    console.log('Unable to connect to database', error);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
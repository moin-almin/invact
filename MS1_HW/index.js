const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createNewUser } = require("./controllers/userController");
const { searchImages } = require("./controllers/photoController");

const { sequelize } = require("./models");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/users", createNewUser);

app.get('/api/photos/search', searchImages);

sequelize.authenticate().then(() => {
    console.log('Database connected')
}).catch(error => {
    console.log('Unable to connect to database', error);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
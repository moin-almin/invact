require('dotenv').config()
const express = require("express");
const cors = require("cors");
const sequelize = require("./lib/sequelize");
const userModel = require("./models/user");
const {parse} = require("dotenv");
const app = express();
app.use(cors());
app.use(express.json());

sequelize.sync().then(() => {
    console.log('Database connected and synced.')
}).catch((err) => {
    console.error("Unable to connect to databse", err);
})

app.get('/users', async (req, res) => {
    try {
        const users =  await userModel.findAll();
        res.json({users});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "failed to fetch all users"});
    }
})

app.get('/users/:id', async (req, res) => {
    let userId = parseInt(req.params.id);
    try {
        let user = await userModel.findByPk(userId);
        if (user) {
            res.json({user});
        } else {
            res.status(404).json({ message: "User Not Found" });
        }
    } catch (error){
        console.error(error);
        res.status(500).json({error: "failed to fetch user"});
    }
})

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, () => console.log("Listening on 3000"));
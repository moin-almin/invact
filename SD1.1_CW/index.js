const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const users = [
    {
        id: 1,
        username: "moinalmin",
        name: "Moin Almin",
        repoCount: 42,
        location: "Jharkhand"
    },
    {
        id: 1,
        username: "moinalmin",
        name: "Moin Almin",
        repoCount: 42,
        location: "Jharkhand"
    }
];

app.get('/users', (req, res) => {
    res.json({users});
})

app.get('/users/:id', (req, res) => {
    let user = users.find(user => user.id === parseInt(req.params.id));
    if (user) {
        res.json({user});
    } else {
        res.status(404).json({ message: "User Not Found" });
    }
    
})

app.listen(3000, () => console.log("Listening on 3000"));
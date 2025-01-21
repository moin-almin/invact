const {
    user: userModel
} = require('../models');

async function doesUserExist(email) {
    let user = await userModel.findOne({ where: { email } });
    if (!user) { return false; }
    return true;
}

function validateUser(user) {
    if (!user.username || typeof user.username !== 'string') {
        return "username is required and must be a string.";
    }

    if (!user.email || typeof user.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        return "Email is required, must be a string, and must be a valid email address.";
    }

    return null;
}

const createNewUser = async (req, res) => {
    try {
        const userData = req.body;

        let error = validateUser(userData);
        if (error) return res.status(400).send(error);

        if (await doesUserExist(userData.email)) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const newUser = await userModel.create(userData);
        res.status(201).json({message: 'User created successfully', user: newUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create user." });
    }
}

module.exports = {
    createNewUser,
}
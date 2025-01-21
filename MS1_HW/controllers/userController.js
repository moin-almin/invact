const {
    user: userModel
} = require('../models');
const {validateUser} = require('../validations');

async function doesUserExist(email) {
    let user = await userModel.findOne({ where: { email } });
    if (!user) { return false; }
    return true;
}

const createNewUser = async (req, res) => {
    const userData = req.body;

    let errors = validateUser(userData);
    if (errors.length > 0) return res.status(400).json({ errors });

    try {
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
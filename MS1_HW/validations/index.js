function validateUser(user) {
    let errors = [];
    if (!user.username || typeof user.username !== 'string') {
        errors.push("username is required and must be a string.");
    }

    if (!user.email || typeof user.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.push("email is required, must be a string, and must be a valid email address.");
    }

    return errors;
}

module.exports = {validateUser};
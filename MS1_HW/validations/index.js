const {
    tag: tagModel
} = require("../models");

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

function validatePhoto(photo) {
    let errors = [];
    if (!photo.imageUrl.startsWith('https://images.unsplash.com/')) {
        errors.push("Invalid image URL");
    }

    return errors;
}

async function validateTags(tags, photoId) {
    let errors = [];
    let existingTagsCount = await tagModel.count({
        where: { photoId }
    });

    let newTagCount = tags.length;

    if (existingTagsCount + newTagCount > 5) {
        errors.push("Number of tags cannot be greater than 5.")
    }

    for (const tag of tags) {
        if (tag.length === 0 || typeof tag !== 'string') {
            errors.push("Tags must be non-empty strings");
        } else if (tag.length > 20) {
            errors.push("Tags must be less than 20 characters long");
        }
    }

    return errors;
}

function validateUserId(userId) {
    let errors = [];

    if (!userId || typeof userId !== "number") {
        errors.push("userId is required and must be a number.");
    }

    return errors;

}

module.exports = {validateUser, validatePhoto, validateTags, validateUserId};
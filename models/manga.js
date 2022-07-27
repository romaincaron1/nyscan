const mongoose = require('mongoose');
require('dotenv').config();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Manga Schema
const mangaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    synopsis: {
        type: String,
        max: 1000,
    },
    image: {
        type: String,
    },
    scans: {
        type: [mongoose.Types.ObjectId],
        ref: 'Scan',
    }
})

const Manga = mongoose.model('Manga', mangaSchema);

// Verify format
function validateManga(manga) {
    const schema = Joi.object({
        name: Joi.string().required().max(50),
        author: Joi.string().required().min(3).max(50),
        synopsis: Joi.string(),
        image: Joi.string(),
        scans: Joi.array().items(Joi.objectId())
    })
    return schema.validate(manga)
}

exports.Manga = Manga;
exports.validate = validateManga;
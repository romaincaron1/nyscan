const mongoose = require('mongoose');
require('dotenv').config();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Stat Schema
const statSchema = new mongoose.Schema({
    manga: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    watching: {
        type: Number,
        default: 0,
    },
    watched : {
        type: Number,
        default: 0,
    }
})

const Stat = mongoose.model('Stat', statSchema);

// Verify format
function validateStat(stat) {
    const schema = Joi.object({
        manga: Joi.objectId().required(),
        likes: Joi.number(),
        watching: Joi.number(),
        watched: Joi.number(),
    });
    return schema.validate(stat);
}

exports.Stat = Stat;
exports.validate = validateStat;
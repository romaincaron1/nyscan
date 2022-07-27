const mongoose = require('mongoose');
require('dotenv').config();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Selection schema
const selectionSchema = new mongoose.Schema({
    mangas: {
        type: [mongoose.Types.ObjectId],
        required: true,
        ref: 'Manga'
    }
}, { timestamps: true })

const Selection = mongoose.model('Selection', selectionSchema);

// Verify format
function validateSelection(selection) {
    const schema = Joi.object({
        mangas: Joi.array().items(Joi.objectId()),
    })
    return schema.validate(selection)
}

exports.Selection = Selection;
exports.validate = validateSelection;
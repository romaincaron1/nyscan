const mongoose = require('mongoose');
require('dotenv').config();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Scan Schema
const scanSchema = new mongoose.Schema({
    manga: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    number : {
        type: Number,
        required: true,
    },
    pages: {
        type: [String],
        required: true,
    }
}, { timestamps: true })

const Scan = mongoose.model('Scan', scanSchema);

// Verify format
function validateScan(scan) {
    const schema = Joi.object({
        manga: Joi.objectId().required(),
        number: Joi.number().required(),
        pages: Joi.array().items(Joi.string()),
    })
    return schema.validate(scan)
}

exports.Scan = Scan;
exports.validate = validateScan;
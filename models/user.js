const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
require('dotenv').config();
const Joi = require('joi');

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    list: {
        type: [mongoose.Types.ObjectId],
        ref: 'Scan',
    },
    ended: {
        type: [mongoose.Types.ObjectId],
        ref: 'Scan',
    },
    stopped: {
        type: [[String]]
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

userSchema.methods.generateAuthToken = function() {
    const user = _.pick(this, ["name", "email", "list", "ended", "stopped", "isAdmin", "createdAt"]);
    const token = jwt.sign({ user: user }, process.env.jwtPrivateKey, { expiresIn: '3600s' })
    return token
}

const User = mongoose.model('User', userSchema)

// Verify format
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(25),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(6).max(1024),
        list: Joi.array().items(Joi.string()),
        ended: Joi.array().items(Joi.string()),
        stopped: Joi.array().items(Joi.array().items(Joi.string())),
        isAdmin: Joi.boolean()
    })
    return schema.validate(user)
}

exports.User = User;
exports.validate = validateUser;
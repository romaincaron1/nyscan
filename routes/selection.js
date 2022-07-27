const express = require('express');
const _ = require('lodash');
const { Selection, validate } = require('../models/selection');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

// GET selection
router.get('/', async (_, res) => {
    const selection = await Selection.find();
    res.send(selection[0]);
})

// POST selection
router.post('/', auth, admin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const selection = new Selection(_.pick(req.body, ["mangas"]));
    await selection.save();

    res.send(selection);
})

// PUT selection
router.put('/:id', auth, admin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const selection = await Selection.findByIdAndUpdate(
        req.params.id,
        _.pick(req.body, ["mangas"]), { new: true }
    );
    if (!selection) return res.status(400).send("Selection not found");

    res.send(selection);
})

module.exports = router;
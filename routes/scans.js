const express = require('express');
const { Scan, validate } = require('../models/scan');
const _ = require('lodash');
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();

// GET scans
router.get('/', async (req, res) => {
	const scans = await Scan.find();
	res.send(scans);
})

// GET scans BY manga id
router.get('/:id/:number', async (req, res) => {
	if (!ObjectId.isValid(req.params.id)) return res.status(400).send("Invalid argument");
    const scan = await Scan.findOne({ manga: req.params.id, number: req.params.number })
    if (!scan) return res.status(404).send("Scan not found");
    res.send(scan);
})

// POST scan
router.post('/', auth, admin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    scan = new Scan(_.pick(req.body, ["manga", "number", "pages"]));
    await scan.save();

    res.send(scan);
})

// PUT scan
router.put("/:id", auth, admin, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const scan = await Scan.findByIdAndUpdate(
		req.params.id,
		_.pick(req.body, ["manga", "number", "pages"]),
		{ new: true }
	);
	if (!scan) return res.status(400).send("Scan not found");

	res.send(scan);
});

// DELETE scan
router.delete("/:id", auth, admin, async (req, res) => {
	const scan = await Scan.findByIdAndRemove(req.params.id);
	if (!scan) return res.status(404).send("Scan not found");
	res.send(scan);
});

module.exports = router;
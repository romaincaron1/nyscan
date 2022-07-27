const express = require('express');
const { Stat, validate } = require('../models/statistics');
const _ = require('lodash');
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();

// GET statistics
router.get('/', async (_, res) => {
    const statistics = await Stat.find();
    res.send(statistics);
})

// GET statistics BY Manga ID
router.get('/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) return res.status(400).send("Invalid argument");
	
    const scan = await Stat.findOne({ manga: req.params.id })
    if (!scan) return res.status(404).send("Scan not found");
    
    res.send(scan);
})

// POST statistics
router.post('/', auth, admin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let stat = await Stat.findOne({ manga: req.body.manga });
    if (stat) return res.status(409).send("Stat already exists");

    stat = new Stat(_.pick(req.body, ["manga"]));
    await stat.save();

    res.send(stat);
})

// PUT statistics
router.put("/:id", auth, admin, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const stat = await Stat.findByIdAndUpdate(
		req.params.id,
		_.pick(req.body, ["manga"]),
		{ new: true }
	);
	if (!stat) return res.status(400).send("Stat not found");

	res.send(stat);
});

// DELETE stat
router.delete("/:id", auth, admin, async (req, res) => {
	const stat = await Stat.findByIdAndRemove(req.params.id);
	if (!stat) return res.status(404).send("Stat not found");
	res.send(stat);
});

// PATCH stat
router.patch("/", auth, async (req, res) => {
	const stat = await Stat.findOneAndUpdate(
		{ manga: req.body.manga },
		req.body,
		{ new: true }
	);
	if (!stat) return res.status(404).send("Stat not found");

	res.send(stat);
});

module.exports = router;
const express = require('express');
const { Manga, validate } = require('../models/manga');
const _ = require('lodash');
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ObjectId = require('mongoose').Types.ObjectId;
const router = express.Router();

// GET mangas
router.get('/', async (_, res) => {
    const mangas = await Manga.find();
    res.send(mangas);
})

// GET manga BY id
router.get('/:id', async (req, res) => {
	// if (!ObjectId.isValid(req.params.id)) return res.status(400).send("Invalid argument");
	// console.log(req.params.id);
	
	const manga = await Manga.findById(req.params.id);
    if (!manga) return res.status(404).send("Manga not found");
    res.send(manga);
})

// POST manga
router.post('/', auth, admin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let manga = await Manga.findOne({ name: req.body.name });
    if (manga) return res.status(409).send("Manga already exists");

    manga = new Manga(_.pick(req.body, ["name", "author", "synopsis", "image", "scans"]));
    await manga.save();

    res.send(manga);
})

// PUT manga
router.put("/:id", auth, admin, async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const manga = await Manga.findByIdAndUpdate(
		req.params.id,
		_.pick(req.body, ["name", "author", "synopsis", "image", "scans", "likes"]),
		{ new: true }
	);
	if (!manga) return res.status(400).send("Manga not found");

	res.send(manga);
});

// DELETE manga
router.delete("/:id", auth, admin, async (req, res) => {
	const manga = await Manga.findByIdAndRemove(req.params.id);
	if (!manga) return res.status(404).send("Manga not found");
	res.send(manga);
});

// PATCH manga
router.patch("/:id", auth, async (req, res) => {
	const manga = await Manga.findByIdAndUpdate(req.params.id, req.body, { new: true });
	if (!manga) return res.status(404).send("Manga not found");

	res.send(manga);
});

module.exports = router;
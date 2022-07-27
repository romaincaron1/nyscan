const express = require("express");
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

// GET user
router.get("/me", auth, async (req, res) => {
	res.send(req.user);
});

// GET users
router.get("/", auth, admin, async (_, res) => {
	const users = await User.find();
	res.send(users);
});

// GET user BY id
router.get("/:id", auth, admin, async (req, res) => {
	const user = await User.findById(req.params.id);
	if (!user) return res.status(404).send("User not found");
	res.send(user);
});

// POST user
router.post("/", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user) return res.status(409).send("User already exists");

	user = new User(_.pick(req.body, ["name", "email", "password"]));
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();

	res.send(_.pick(user, ["_id", "name", "email"]));
});

// PUT user
router.put("/:id", async (req, res) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findByIdAndUpdate(
		req.params.id,
		_.pick(req.body, ["name", "email", "password", "list", "ended", "stopped"]),
		{ new: true }
	);
	if (!user) return res.status(400).send("User not found");

	res.send(user);
});

// DELETE user
router.delete("/:id", auth, admin, async (req, res) => {
	const user = await User.findByIdAndRemove(req.params.id);
	if (!user) return res.status(404).send("User not found");
	res.send(user);
});

// PATCH user
router.patch("/", auth, async (req, res) => {
	if (req.body.email) {
		let user = await User.findOne({ email: req.body.email });
		if (user) return res.status(409).send("User already exists");
	}
	const user = await User.findOneAndUpdate(	
		{ email: req.user.user.email },
		req.body,
		{ new: true }
	);
	if (!user) return res.status(404).send("User not found");
	const newToken = user.generateAuthToken();

	res.send(newToken);
});

module.exports = router;

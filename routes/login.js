const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
	if (req.body.email) {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			res.status(404).send("Invalid credentials");
		} else {
			if (req.body.password) {
				bcrypt.compare(req.body.password, user.password, function (err, response) {
					if (err) res.send(err);
					if (response) {
						const token = user.generateAuthToken();
						res.send(token);
					} else {
						res.status(406).send("Password doesn't match with email")
					}
				});
			} else {
				res.status(401).send("Password required");
			}
		}
	} else {
		res.status(401).send("Email required");
	}
});

module.exports = router;

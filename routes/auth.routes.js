const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");


// Sign up routes
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.send("Username already taken.");
    }

    if (req.body.password.length <= 6) {
      return res.send("Password must be longer than 6 characters.");
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match");
    }

    await User.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 10)
    })
    res.redirect("/auth/sign-in");
  } catch (error) {
    console.log(error)
    res.redirect("/auth/sign-up")
  }
});


// Sign in routes
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});


router.post("/sign-in", async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if (!validPassword) {
      return res.send("Login failed. Please try again.");
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }
    res.redirect("/");
  } catch (error) {
    res.redirect("/auth/sigin-in")
  }
});

// Sign out
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");


// Sign up routes
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs", { error: null, username: "" });
});

router.post("/sign-up", async (req, res) => {
  const { username, password, confirmPassword } = req.body
  try {
    const userInDatabase = await User.findOne({ username });
    if (userInDatabase) {
      return res.render("auth/sign-up.ejs", { error: "That username is already taken.", username });
    }

    if (password.length <= 6) {
      return res.render("auth/sign-up.ejs", { error: "Password must be longer than 6 characters.", username });
    }

    if (password !== confirmPassword) {
      return res.render("auth/sign-up.ejs", { error: "Passwords do not match.", username });
    }

    await User.create({ username, password: bcrypt.hashSync(req.body.password, 10) })
    res.redirect("/auth/sign-in");
  } catch (error) {
    console.log(error)
    res.render("auth/sign-up.ejs", { error: "Something went wrong. Please try again.", username })
  }
});


// Sign in routes
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs", { error: null, username: "" })
});

router.post("/sign-in", async (req, res) => {
  const { username, password } = req.body

  try {
    const userInDatabase = await User.findOne({ username });
    const validPassword = userInDatabase && bcrypt.compareSync(password, userInDatabase.password);

    if (!validPassword) {
      return res.render("auth/sign-in.ejs", { error: "Incorrect username or password.", username })

    }


    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }
    res.redirect("/");
  } catch (error) {
    res.render("auth/sign-in.ejs", { error: "Something went wrong. Please try again.", username })
  }
});


// Sign out
router.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


module.exports = router;

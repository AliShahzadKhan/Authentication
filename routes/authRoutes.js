const express = require("express");
const { signup, login, loginGoogle, logout, home } = require("../controllers/authController");
const passport = require("passport");
const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/signup", (req, res) => {
    res.render("signup");
});
router.get("/google/callback",
    passport.authenticate("google", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true
    })
);
//  router.get("/auth/failure", (req, res) => {
//      res.status(401).send("something went wrong")
//  });
router.post("/signup", signup);
router.post("/login", login);
router.get("/auth/google", loginGoogle);
router.get("/logout", logout);
router.get("/home", home);

module.exports = router;
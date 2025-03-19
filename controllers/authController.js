const passport = require("passport");
const {createUser, findByUsername} = require("../models/userModel");
const { name } = require("ejs");

const signup = async (req, res) => {
    const {username, password} = req.body;
    const existingUser = await findByUsername(username);
    if(existingUser) {
        res.send("Username already exists!");
    }
    await createUser(username, password);
    res.redirect("/login");
};

const login = passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true
});

const loginGoogle = passport.authenticate("google", {
 scope: ["email", "profile"]
});

const logout = async (req, res) => {
    req.logout(() => {
        res.redirect("/login");
    });
};

const home = async (req, res) => {
    if(!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    const username = req.user.username || req.user.name || req.user.displayName;
    res.render("home", { username });
};

module.exports = { signup, login, loginGoogle, logout, home };
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const flash = require("express-flash");
require("./middleware/authMiddleware");
require("dotenv").config();
const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.use(authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on the Port: ${process.env.PORT}`);
});
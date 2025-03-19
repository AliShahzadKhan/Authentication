const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const { findByUsername } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { name } = require("ejs");
require("dotenv").config();

//passport local authentication using usernames and passwords
passport.use(
    new LocalStrategy(async (username, password, done) => {
        const user = await findByUsername(username);
        if(!user) {
            return done(null, false, {message: "User not found!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return done(null, false, 
                {message: "Incorrect password, please try again."})
        }
        return done(null, user);
    })
);

//Oauth google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
      try {

        const googleId = profile.id;
        const email = profile.emails[0].value;
        const name = profile.displayName;

        let user = await pool.query(
            "SELECT * FROM users WHERE oauth_id = $1", [googleId]
        );

        if(user.rows.length === 0) {
            const newUser = await pool.query(
                "INSERT INTO users (email, oauth_id, provider) VALUES ($1, $2, $3)",
                [email, googleId, "google"]
            );

            user = newUser;
        }

        done(null, user.rows[0]);
      } catch (error) {
        done(null, error);
      }
  }

));

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return done(null, false);  
        }
        done(null, result.rows[0]);  
    } catch (err) {
        done(err, null);
    }
});
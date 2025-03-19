const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        "INSERT INTO users (username, password, provider, email) VALUES ($1, $2, $3, $4) RETURNING *",
        [username, hashedPassword, "local", "test@example.com"]
    );
    return result.rows[0];
};

const findByUsername = async (username) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE username = $1", [username]
    );
    return result.rows[0];
};

module.exports = {createUser, findByUsername};
// login.js
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const configureDatabase = require("../../db/db");

router.get("/", (_request, response) => {
    response.render("login.ejs", { loginFailed: false });
});

router.post("/", async (request, response) => {
    console.log("Login Request Body:", request.body);
    const { username, password } = request.body;

    const db = configureDatabase();
    await db.connect();

    try {
        // Query the database to check if the username and password match
        const user = await getUserByUsernameAndPassword(db, username, password);

        if (user) {
            // Authentication successful
            response.redirect("/"); // redirect
        } else {
            // Auth failed
            response.render("login.ejs", { loginFailed: true });
        }
    } catch (error) {
        console.error("Error during login:", error);
        response.status(500).send("Internal server error.");
    } finally {
        db.end();
    }
});

async function getUserByUsernameAndPassword(db, username, password) {
    const query = {
        text: "SELECT * FROM users WHERE username = $1 AND password = $2",
        values: [username, password],
    };

    console.log("SQL Query:", query);

    const result = await db.query(query);

    if (result.rows.length > 0) {
        // User found
        return new User(result.rows[0]); 
    } else {
        // User not found
        return null;
    }
}

module.exports = router;

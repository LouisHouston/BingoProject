const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const configureDatabase = require("../../db/db");

const db = configureDatabase
router.get("/", (_request, response) => {
    const user = _request.session.user;
    response.render("create_game.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user});
});

router.post("/", async (request,response) =>  {
    const {gamename, max_players, password} = request.body;
    console.log(request.body);
    
    const gamecode = generateRandomCode(8);

    try {
        await create_game(gamecode, gamename, max_players, password);
        
        response.redirect(`/game/${gamecode}`);
    } catch (error) {
        console.error("Error creating game :(", error);
        response.status(500).send("Internal server error.");
    }
});

module.exports = router;

function generateRandomCode(len) {
    const bytes = crypto.randomBytes(Math.ceil(len/2));
    const code = bytes.toString('hex').slice(0, len);
    return code;
}

async function create_game(gamecode, gamename, max_players, password) {

    const db = configureDatabase();
    await db.connect();
    console.log("Code, Name, max players, password:", gamecode, gamename, max_players, password);
    const query = {
        text: "INSERT INTO game (game_code, game_name, max_players, password) VALUES ($1, $2, $3, $4)",
        values: [gamecode, gamename, max_players, password],
    };

    const result = await db.query(query);
    console.log("Game created successfully!");
}

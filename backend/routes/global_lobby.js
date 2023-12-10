const express = require("express");
const { Games } = require("../db");
const router = express.Router();

router.get("/", async (request, response) => {
  const availableGames = await Games.getAvailableGames();
  //const availableGames = await Games.getAvailableGamesPerUser(request.session.user.id);

  response.render("global_lobby", { availableGames});
});


module.exports = router;
 
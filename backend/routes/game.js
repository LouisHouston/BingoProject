const express = require("express");
const router = express.Router();

router.get("/", (_request, response) => {
    response.render("game.ejs");
});


module.exports = router;

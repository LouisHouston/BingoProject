const express = require("express");
const router = express.Router();
const socketio = require("socket.io");
const requireLogin = require("../middleware/reqLogin");
const configureDatabase = require("../../db/db");


const io = socketio(); 
const db = configureDatabase();

router.get("/", requireLogin, (_request, response) => {
    const user = _request.session.user;

    response.render("global_lobby.ejs", { pageTitle: "Home", pageContent: "Welcome", loggedIn: _request.session.loggedIn, user });

    db.query("SELECT * FROM messages", (error, results) => {
        if (error) {
            console.error("error db query messages:", error);
        } else {
            io.emit("start messages", results);
        }
    });  
    if(user == null){
        return response.redirect("/login");
    }
});

io.on("message", (data) => {
    const { content, sender, timestamp } = data;

    const db = configureDatabase();

    db.query("INSERT INTO messages (player_name, message_time, message_content) VALUES ($1, $2, $3)", [sender, timestamp, content], (error, result) => {
        if (error) {
            console.error("Error saving message to the database:", error);
        } else {
            // Fetch the inserted message from the database
            db.query("SELECT * FROM messages WHERE message_id = $1", [result.rows[0].message_id], (err, res) => {
                if (err) {
                    console.error("Error fetching the inserted message:", err);
                } else {
                    const insertedMessage = res.rows[0];

                    // Emit the new message to all connected clients
                    io.emit("newMessage", insertedMessage);
                }
            });
        }
    });

    

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

router.io = io;

module.exports = router;

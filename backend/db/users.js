const db = require("./connection");

const USER_EXISTENCE = "SELECT email FROM users WHERE email=$1";
const ADD_USER =
  "INSERT INTO users (email, password , username, gamesplayed, gameswon) VALUES ($1, $2 , $3, 0, 0) RETURNING id, email, username, gamesplayed, gameswon";
const UPDATE_USER_GAMESTATS = "UPDATE users SET gamesplayed = $2, gameswon = $3 WHERE email = $1 RETURNING id, email, username, gamesplayed, gameswon";
const SIGN_USER_IN = "SELECT * FROM users WHERE email=$1";
const GET_USER_SOCKET =
  "select sid from session where sess->'user'->>'id'='$1';";

const email_exists = (email) =>
  db
    .one(USER_EXISTENCE, [email])
    .then((_) => true)
    .catch((_) => false);

const create = (email, password , username, gamesplayed , gameswon) => db.one(ADD_USER, [email, password , username , gamesplayed , gameswon]);

const updatestats = (email, gamesplayed , gameswon) => db.one(UPDATE_USER_GAMESTATS , [email , gamesplayed, gameswon]);

const find_by_email = (email) => db.one(SIGN_USER_IN, [email]);

const getUserSocket = (userId) => db.one(GET_USER_SOCKET, userId);

module.exports = {
  email_exists,
  create,
  updatestats,
  find_by_email,
  getUserSocket,
};

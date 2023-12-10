const db = require("./connection");

const CREATE = "INSERT INTO games (game_socket_id,game_over) VALUES ($1,0) RETURNING id";
const GAME_OVER = "UPDATE games SET game_over=1 WHERE id = $1";
const ADD_USER = "INSERT INTO game_users (user_id, game_id) VALUES ($1, $2)";
const CREATE_BINGO_GAME = "UPDATE games SET user_y_card_id =$2 , drawn_numbers_id = $3  WHERE id =$1 "
const UPDATE_USER = "UPDATE games SET user_ids = user_ids || ARRAY[$2], user_x_card_ids = user_x_card_ids || ARRAY[$3] WHERE id = $1;"

const GET_GAME = "SELECT * FROM games WHERE id=$1";
const GET_AVAILABLE_GAMES = "SELECT * FROM games";
const GET_AVAILABLE_GAMES_PER_USER = "SELECT games.* FROM games JOIN game_users ON games.id = game_users.game_id WHERE game_users.user_id = $1";

const CREATE_CARD = "SELECT generate_bingo_card() AS card_id";
const UPDATE_CARD = "UPDATE bingo_cards SET game_id = $2, user_id = $3 WHERE card_id = $1";
const CARD_EXISTENCE = "SELECT card_id FROM bingo_cards WHERE game_id=$1 AND user_id = $2";
const GET_CARD = "SELECT * FROM bingo_cards WHERE card_id = $1";
const GET_CARD_BY_GAME_AND_USER = "SELECT * FROM bingo_cards WHERE game_id = $1 and user_id=$2";
const GET_AI_CARD = "SELECT bingo_cards.* FROM bingo_cards JOIN games ON bingo_cards.card_id = games.user_y_card_id WHERE games.id = $1 LIMIT 1";
const UPDATE_SELECTED_ARRAY = "UPDATE bingo_cards SET selected[$3][$4] = $2 WHERE card_id = $1";

const ADD_DRAWN_NUMBERS = "SELECT generate_drawn_numbers($1) AS draw_id";
const UPDATE_DRAWN_NUMBERS = "UPDATE drawn_numbers SET numbers = array_append(numbers, new_number) WHERE  drawn_numbers.game_id = $1";
const UPDATE_DRAWN_INDEX = "UPDATE drawn_numbers SET drawn_index = $2 WHERE drawn_numbers.game_id=$1";
const GET_DRAWN_NUMBERS = "SELECT * FROM drawn_numbers WHERE game_id=$1";

const DELETE_CARD = "DELETE FROM bingo_cards WHERE game_id = $1";
const DELETE_DRAWN_NUMBERS = "DELETE FROM drawn_numbers WHERE game_id = $1";
const DELETE_GAME = "DELETE FROM games WHERE id = $1" ;
const DELETE_GAME_USERS = "DELETE FROM game_users WHERE game_id = $1";

const create = (gameSocketId) => db.one(CREATE, [gameSocketId]);

const game_over =(id) => db.none(GAME_OVER , id );

const addUser = (userId, gameId) => db.none(ADD_USER, [userId, gameId]);

const create_bingo_game = (id , user_y_card_id , drawn_numbers_id) => db.none(CREATE_BINGO_GAME , [id ,user_y_card_id , drawn_numbers_id] );

const  update_user = (id , user_id , user_x_card_id) => db.none(UPDATE_USER, [id, user_id , user_x_card_id]);

const get_game = (gameId) => db.one(GET_GAME, gameId);

const getAvailableGames = () => db.any(GET_AVAILABLE_GAMES);

const getAvailableGamesPerUser = (userId) => db.any(GET_AVAILABLE_GAMES_PER_USER ,userId);

const create_card = () => db.one(CREATE_CARD);

const update_card = (card_id, game_id,user_id) => db.none(UPDATE_CARD , [card_id , game_id, user_id]);

const update_selected = (card_id, selected_value , i , j) => db.none(UPDATE_SELECTED_ARRAY ,[card_id, selected_value ,i , j] );

const game_exists = (id) =>
  db
    .one(GET_GAME, [id])
    .then((_) => true)
    .catch((_) => false);


const card_exists = (game_id , user_id) =>
  db
    .one(CARD_EXISTENCE, [game_id , user_id])
    .then((_) => true)
    .catch((_) => false);

const get_card = (card_id) => db.one(GET_CARD , card_id);

const get_card_by_game_and_user = (game_id , user_id) => db.one(GET_CARD_BY_GAME_AND_USER , [game_id , user_id]);

const get_AI_card = (game_id) => db.one(GET_AI_CARD , game_id);

const add_drawn_numbers = (game_id) => db.one(ADD_DRAWN_NUMBERS , [game_id]);

const update_drawn_numbers = (game_id , number) => db.one(UPDATE_DRAWN_NUMBERS , [game_id , number]);
 
const update_drawn_index = (game_id , drawn_index) => db.none(UPDATE_DRAWN_INDEX , [game_id , drawn_index]);


const get_drawn_numbers = (game_id) => db.one(GET_DRAWN_NUMBERS , game_id);

const delete_card = (game_id) => db.none(DELETE_CARD , game_id);

const delete_drawn_numbers = (game_id) => db.none(DELETE_DRAWN_NUMBERS , game_id);

const delete_game = (id) => db.none(DELETE_GAME , id);

const delete_game_users = (game_id) => db.none(DELETE_GAME_USERS , game_id);


module.exports = {
  create,
  game_over,
  addUser,
  create_bingo_game,
  update_user,
  get_game,
  game_exists,
  getAvailableGames,
  getAvailableGamesPerUser,
  create_card,
  update_card,
  card_exists,
  get_card,
  get_card_by_game_and_user,
  get_AI_card,
  update_selected,
  add_drawn_numbers,
  update_drawn_numbers,
  update_drawn_index,
  delete_card,
  delete_game,
  delete_game_users,
  delete_drawn_numbers,
  get_drawn_numbers,

};

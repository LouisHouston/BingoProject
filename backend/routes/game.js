const crypto = require("crypto");
const express = require("express");
const router = express.Router();

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const { Games, Users } = require("../db");

router.get("/create", async (request, response) => {
  const { id: userId } = request.session.user;
  const io = request.app.get("io");

  const { id: gameId } = await Games.create(
    crypto.randomBytes(20).toString("hex"),
  );
  
  await Games.addUser(userId, gameId);
  
  
  
  var { card_id : user_y_card_id} = await Games.create_card();
  const drawn_number = await Games.add_drawn_numbers(gameId);
  const draw_id = drawn_number.draw_id;
  await Games.create_bingo_game(gameId , user_y_card_id , draw_id);

  io.emit("game:created", { id: gameId });

  response.redirect(`/games/${gameId}`);
});

router.get("/:id/join", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId, email: userEmail } = request.session.user;
  const io = request.app.get("io");

  await Games.addUser(userId, gameId);

  io.emit("game:user_added", { userId, userEmail, gameId });


  console.log("Games Id: " + gameId);
 
  response.redirect(`/games/${gameId}`);
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;
  
  console.log("Game Session: " + request.session.id);

  const game_exists = await Games.game_exists(id);
  if (game_exists)
  {
  const { game_socket_id: gameSocketId } = await Games.get_game(id);

  console.log("Game Scoket: " + gameSocketId );
  
  console.log ("Before user socket:" + request.session.user.id);
 

  const { sid } = await Users.getUserSocket(request.session.user.id);

  console.log({ sid });

 
  const bingo_card_exists = await Games.card_exists(id , request.session.user.id);
 

  if (!bingo_card_exists) {
    
    var { card_id : id_x} = await Games.create_card();

    await Games.update_card(id_x, id , request.session.user.id);
    await Games.update_user(id , request.session.user.id ,  id_x );
   
  }
  var game = await Games.get_game(id);
  var game_over = game.game_over;
  console.log("Game over: " + game_over);

  var db_drawn_numbers = await Games.get_drawn_numbers(id);
  var db_card_x = await Games.get_card_by_game_and_user(id , request.session.user.id);
  var db_card_x_numbers =  db_card_x.numbers;
  var db_card_x_selected = db_card_x.selected;
  var db_card_y = await Games.get_AI_card(id);
  var db_card_y_numbers =  db_card_y.numbers;
  var db_card_y_selected = db_card_y.selected;
  
  request.session.db_card_x = db_card_x;
  request.session.db_card_x.numbers = db_card_x.numbers;
  request.session.db_card_x.selected = db_card_x.selected;
  request.session.db_card_y = db_card_y;
  request.session.db_card_y.numbers = db_card_y.numbers;
  request.session.db_card_y_selected = db_card_y.selected;
  

  response.render("game", { id, db_card_x_numbers , db_card_y_numbers , 
                            db_drawn_numbers , db_card_x_selected, 
                            db_card_y_selected, game_over , gameSocketId });
  
  }                        
});

router.post("/:id", async (request, response) => {
  const { id } = request.params;
  
  const requestBody = JSON.stringify(request.body);
  console.log("GAME POST: " +   id  );
  response.status(200).send();

try {
  const parsedBody = JSON.parse(requestBody);
  

  if (parsedBody && typeof parsedBody === 'object') {
    const keys = Object.keys(parsedBody);
    console.log("Keys: " + keys[0]);
    switch (keys[0]) {
      case 'drawn_index':
        console.log("Case Drawn Index: ");
        
        var drawn_index = parsedBody.drawn_index;
        console.log("Case Drawn Index: " + drawn_index );
        await (async () => await Games.update_drawn_index(id, drawn_index))();
        
        break;
     
      case 'card_x_cell':
        for(let i=0 ; i < 5 ; i++)
        {
          for (let j= 0 ;j <5 ; j++)
          {
             if (parsedBody.card_x_cell  == 
                  request.session.db_card_x.numbers[i][j])
              {

                var selected_value ='f';
                if (request.session.db_card_x.selected[i][j] =='f' )
                    { selected_value ='f'; }
                 else
                    { selected_value = 't'; }


                await (async () => await Games.update_selected(request.session.db_card_x.card_id, 
                       selected_value, i+1 , j+1))();
                break;
              }

          }
        }
      break;
      
      case 'card_y_cell':
        console.log("Case Card Y: ");
        
        for(let i=0 ; i < 5 ; i++)
        {
          for (let j= 0 ;j <5 ; j++)
          {
             if (parsedBody.card_y_cell  == 
                  request.session.db_card_y.numbers[i][j])
              {

                var selected_value ='f';
                if (request.session.db_card_y.selected[i][j] =='f' )
                    { selected_value ='f'; }
                 else
                    { selected_value = 't'; }


                await (async () => await Games.update_selected(request.session.db_card_y.card_id, 
                       selected_value, i+1 , j+1))();
                break;
              }

          }
        }
        
      break;
      
      case 'gameover':
          console.log("Case gameover");
          const io = request.app.get("io");
          io.emit("game:GameOver", { id });
          await (async () => await Games.game_over(id))();

         //await (async () => await Games.delete_drawn_numbers(id))();
         //await (async () => await Games.delete_card(id))();
         //await (async () => await Games.delete_game_users(id))();
         //await (async () => await Games.delete_game(id))();

         if(parsedBody.gameover == 'True' ) //user won
        {
          var user = await Users.find_by_email(request.session.user.email);
          Users.updatestats(request.session.user.email, user.gamesplayed+1, user.gameswon+1);
          user = await Users.find_by_email(request.session.user.email);
     
        }
         break;
      default:
        handleDefaultCase();
    }
  } else {
    handleInvalidJSON();
  }
} catch (error) {
  handleJSONParseError(error);
}


  
});



function handleDefaultCase() {
  
  console.log('Handling default case');
}

function handleInvalidJSON() {
  
  console.log('Invalid JSON format');
}

function handleJSONParseError(error) {
  
  console.error('Error parsing JSON:', error.message);
const configureDatabase = require("../../db/db");
const isAuthenticated = require("../middleware/authenticated");

router.use(isAuthenticated);
const db = configureDatabase();

router.get("/:gamecode", (request, response) => {
    const user = request.session.user;
    console.log(request.params);
    const gamecode = request.params.gamecode;

    const gameData = getGameData(gamecode);

    if (gameData) {
        response.render("game.ejs", { pageTitle: 'In game', gameData, loggedIn: request.session.loggedIn ,user, gamecode});
    } else {
        response.status(404).send("Game not found :(");
    }
});

async function getGameData(gamecode) {
    console.log("Fetching game...");
    const query = {
        text: "SELECT * FROM game where gamecode = $1",
        values: [gamecode],
    };

    const result = await db.query(query);
    console.log(result);

    return result.rows[0];
}
module.exports = router;
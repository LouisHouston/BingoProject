
var drawnNumbers = [] ;
var gameStop = 0;
var counter = 0;
var numRows = 5;
var numCols = 5;
var lastDrawnNumber=0;
drawnNumbers.push(0);
fetch_count=0;

function selectNumber(number) {
  
  document.getElementById('draw-numbers-textarea').value = number;

  drawnNumbers.push(parseInt(number, 10));
  

}
 
function toggleCellColor(cell) {
  cell.classList.toggle("selected");
}
function toggleWinColor(cell) {
  cell.classList.toggle("won");
}


  function addEventListenerToCell(bingoCardBodyId , uri) {
    var bingoCard = document.getElementById(bingoCardBodyId);
  
    var rows = bingoCard.getElementsByTagName('tr');
  
    for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      var cells = rows[rowIndex].getElementsByTagName('td');
  
      for (var colIndex = 0; colIndex < cells.length; colIndex++) {
        var cell = cells[colIndex];
        cell.addEventListener("click", function () {
          toggleCellColor(this);

          var cellNumber = this.textContent.trim(); 
          
          post_message(uri , JSON.stringify({ card_x_cell : cellNumber }));
          //location.reload();
        });
      }
    }
  }
    
  
function selectUserCell(bingoCardBodyId , uri){

  var bingoCard = document.getElementById(bingoCardBodyId);
  
  var rows = bingoCard.getElementsByTagName('tr');
  var colIndex;
  

  if (lastDrawnNumber < 16)
  {
    colIndex = 0;
  }
  else if (lastDrawnNumber < 31)
  {
    colIndex = 1;
  }
  else if (lastDrawnNumber < 46)
  {
    colIndex = 2;
  }
  else  if ( lastDrawnNumber < 61)
  {
    colIndex = 3;
  }
  else 
  {
    colIndex = 4;
  }
  
  for (var rowIndex = 0; rowIndex < 5; rowIndex++) {
    var cell = rows[rowIndex].getElementsByTagName('td')[colIndex];
   
    var cellInt = parseInt(cell.textContent , 10);
   
    if (cellInt == lastDrawnNumber)
    {
      cell.classList.add("selected");
      //toggleCellColor(cell);
      post_message(uri , JSON.stringify({ card_y_cell : cellInt }));
      //location.reload();
    }
      
      
    }
  }  
           

function initialize_card(db_card_selected_JSON ,bingoCardId )
{
  
  var bingoCard = document.getElementById(bingoCardId);
  var rows = bingoCard.getElementsByTagName('tr');
  var db_card_selected = JSON.parse(db_card_selected_JSON);
  
 
  for (let i = 0 ; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName('td');
    for (let j = 0 ; j < cells.length ; j++)
    {
      
       if(db_card_selected[i][j] ) {
           toggleCellColor(cells[j]);

        }
               
    }
         
 }
}
function initialize_drawn_text(anotherArrayJSON, drawn_index)
{
  
  const another_array = JSON.parse(anotherArrayJSON);
  
  for(let i = 1 ; i <= drawn_index ; i++)
  {
    
    drawnNumbers.push(another_array[i]);
    
    counter = counter + 1;
    
} 

}


  
function drawOneNumber_db(anotherArrayJSON  , uri ) {
  
  var drawNumbersTextarea = document.getElementById("draw-numbers-textarea");
  
  const another_array = JSON.parse(anotherArrayJSON );
  
      
      if (counter >= 75) {
           alert('Draw Done');
           document.getElementById('draw-numbers-btn').disabled = true;
           
      }
      else{
        
        drawNumber_db(another_array , drawNumbersTextarea , uri );
        
      }
      counter = counter +1;

      post_message(uri , JSON.stringify({ drawn_index : counter }));
      
     
      //return(counter);
      return (another_array[counter]);
      
}        
  

function drawNumber_db(another_array , drawNumbersTextarea , uri) {
  setTimeout(function () {
  
    
    lastDrawnNumber = another_array[counter];
   
    selectUserCell("bingo-card-body-user-y" , uri);
    drawnNumbers.push(another_array[counter]);
    
    drawNumbersTextarea.value +=  another_array[counter] + "\n";
    drawNumbersTextarea.scrollTop = drawNumbersTextarea.scrollHeight; 
    
    checkBingo("bingo-card-body-user-y" , "AI-user"  , uri);
  },  0);

     
}

function checkUserCard(userCardArray , bingoCardId){
   
  var bingoCard = document.getElementById(bingoCardId);
  var rows = bingoCard.getElementsByTagName('tr');
   var bingo = false;
   
   //check columns
  
   for(let i = 0; i < 5; i++)
   {
      if(drawnNumbers.includes(userCardArray[0][i]) &&
         drawnNumbers.includes(userCardArray[1][i]) &&
         drawnNumbers.includes(userCardArray[2][i]) &&
         drawnNumbers.includes(userCardArray[3][i]) &&
         drawnNumbers.includes(userCardArray[4][i]) )
      {
        bingo = true
        //var cells = rows[i].getElementsByTagName('td');
        toggleWinColor(bingoCard.rows[0].cells[i]);
        toggleWinColor(bingoCard.rows[1].cells[i]);
        toggleWinColor(bingoCard.rows[2].cells[i]);
        toggleWinColor(bingoCard.rows[3].cells[i]);
        toggleWinColor(bingoCard.rows[4].cells[i]);
      }
      if (bingo == true)
      {
        break;
      }
        
   }
  
  //check rows
 
  if (bingo == false)
  {
  
   for(let i = 0; i < 5; i++)
   {
      if(drawnNumbers.includes(userCardArray[i][0]) &&
         drawnNumbers.includes(userCardArray[i][1]) &&
         drawnNumbers.includes(userCardArray[i][2]) &&
         drawnNumbers.includes(userCardArray[i][3]) &&
         drawnNumbers.includes(userCardArray[i][4]) )
      {
          bingo = true;
          toggleWinColor(bingoCard.rows[i].cells[0]);
          toggleWinColor(bingoCard.rows[i].cells[1]);
          toggleWinColor(bingoCard.rows[i].cells[2]);
          toggleWinColor(bingoCard.rows[i].cells[3]);
          toggleWinColor(bingoCard.rows[i].cells[4]);
      }
     if (bingo == true)
     {
         break;
     }

   }

  }
  // check across 
  if( bingo == false)
  {
   
     
    if(drawnNumbers.includes(userCardArray[0][0]) &&
    drawnNumbers.includes(userCardArray[1][1]) &&
    drawnNumbers.includes(userCardArray[2][2]) &&
    drawnNumbers.includes(userCardArray[3][3]) &&
    drawnNumbers.includes(userCardArray[4][4]) )
        {
         bingo = true;
         toggleWinColor(bingoCard.rows[0].cells[0]);
         toggleWinColor(bingoCard.rows[1].cells[1]);
         toggleWinColor(bingoCard.rows[2].cells[2]);
         toggleWinColor(bingoCard.rows[3].cells[3]);
         toggleWinColor(bingoCard.rows[4].cells[4]);
        }
  }
  
  if( bingo == false)
  {
   
   if(drawnNumbers.includes(userCardArray[0][4]) &&
   drawnNumbers.includes(userCardArray[1][3]) &&
   drawnNumbers.includes(userCardArray[2][2]) &&
   drawnNumbers.includes(userCardArray[3][1]) &&
   drawnNumbers.includes(userCardArray[4][0]) )
   {
         bingo = true;
         toggleWinColor(bingoCard.rows[0].cells[4]);
        toggleWinColor(bingoCard.rows[1].cells[3]);
        toggleWinColor(bingoCard.rows[2].cells[2]);
        toggleWinColor(bingoCard.rows[3].cells[1]);
        toggleWinColor(bingoCard.rows[4].cells[0]);
   }
  }
  
   
   return bingo;
}

function checkBingo(bingoCardId , userEmail ,uri ) {
   var bingoCard = document.getElementById(bingoCardId);
   var rows = bingoCard.getElementsByTagName('tr');
   var cellContent;
   var cellInt;
   var bingo = false;
   var userCardArray = [];
   var numRows = 5; 
   var numCols = 5; 
   var userwon = 'False';
   
   // Initialize array and Copy the userCard text area contents into an array
   for (let i = 0; i < numRows; i++) {
      userCardArray[i] = new Array(numCols);
   }
  
   for (let i = 0; i < rows.length; i++) {
      var cells = rows[i].getElementsByTagName('td');
      for (let j = 0 ; j < cells.length ; j++)
      {
          cellContent = cells[j].textContent;
          if (cellContent == "FREE"){
           cellContent = "0";
          }
          cellInt = parseInt(cellContent , 10);
          userCardArray[i][j] = cellInt;
      }

           
   }
  
   // Check User card to see if it's BINGO 
   bingo = checkUserCard(userCardArray , bingoCardId);
  
   if(bingo) 
   {
      if (bingoCardId === 'bingo-card-body-user-x')
      {
        userwon = 'True';
      }
      playBingoSound('../sounds/sound-effect-bingo.mp3');
      gameStop = 1;
      document.getElementById('draw-numbers-btn').disabled = true;
      document.getElementById("bingo-btn-user-x").disabled = true;
      

      
      setTimeout(function() {
         alert(userEmail + ' is the Bingo winner!');
       }, 500);
       setTimeout(function() {
       window.history.back();
       }, 600);

       post_message(uri , JSON.stringify({ gameover : userwon }));
       //location.reload();
      
      

   }
   return userwon;
   
}


function playBingoSound(file) {
  var audio = new Audio(file); 
  audio.play();
}


function showChat() {
  var toUserValue = document.getElementById("toUser").value;
  var chatBoxValue = document.getElementById("chatBox").value;
  var chatHistory = document.getElementById("chat-history");
  var newChatEntry = document.createElement("p");
  newChatEntry.textContent = "To " + toUserValue + ": " + chatBoxValue;
  chatHistory.appendChild(newChatEntry);
  document.getElementById("chatBox").value = ""; // Clear the chat box
  return false; // Prevents the form from actually submitting
}
/*
function post_message(uri , mbody)
{
  
  
  fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: mbody,
    
   
  })
  .then(response => response.json())
  .then(data => {
    
    console.log(data);
  })
  .catch(error => {
    
    console.error('Error:', error);
  });

  fetch_count =  fetch_count+1;
  if(fetch_count == 5)
  {
  
    location.reload();
    
    

  
  }
  
  
  
}
*/
function post_message(uri , mbody)
{
  (async () => {
    try {
        

        // Use the fetch API to send a POST request
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Additional headers if needed
            },
            body: mbody,
        });

        // Handle the response as needed
       // console.log(response);
       if (response.ok) {
        // The request was successful, but we're not processing the response body
        console.log('Request successful, ignoring response');
    } else {
        // Handle errors if needed
        console.error('Error:', response.status, response.statusText);
    }
    } catch (error) {
        // Handle errors during the fetch
        console.error('Error:', error);
    }
})();

}
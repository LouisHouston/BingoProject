
var drawnNumbers = [] ;
var gameStop = 0;
drawnNumbers.push(0); // this is for FREE cell
var counter = 0;
var numRows = 5;
var numCols = 5;
var lastDrawnNumber=0;



// Call generateNumbers function for each card when the page loads
window.onload = function () {
  generateNumbers("bingo-card-user-x", "bingo-card-body-user-x");
  generateNumbers("bingo-card-user-y", "bingo-card-body-user-y");
  
  
  
};


for (let i = 0; i < numRows; i++) {
  AICardArray[i] = new Array(numCols);
}
for (let i = 0; i < rows.length; i++) {
  for (let j = 0 ; j < numCols ; j++)
  {
    AICardArray[i][j] = -1;
  }
}
AICardArray[2][2] = 0;



function selectNumber(button , number) {
  
  document.getElementById('draw-numbers-textarea').value = number;

  drawnNumbers.push(parseInt(number, 10));
  

}
// Function to generate a random number between min and max

 function getRandomNumber(min, max, usedNumbers) {
    var num;
    do {
      num = Math.floor(Math.random() * (max - min + 1) + min);
    } while (usedNumbers.includes(num));
    usedNumbers.push(num);
  
    return num;
  }
 
// Function to generate random Bingo card numbers without repetition

function generateNumbers(cardId, bodyId) {
  var bingoCardBody = document.getElementById(bodyId);
  bingoCardBody.innerHTML = ""; // Clear existing numbers

  var usedNumbers = [];

  // Generate Bingo card numbers dynamically
  for (let i = 0; i < 5; i++) {
    var row = document.createElement("tr");
    for (let j = 0; j < 5; j++) {
      var cell = document.createElement("td");
      // Set the center cell to "FREE"
      if (i === 2 && j === 2) {
        cell.textContent = "FREE";
      } else {
        cell.textContent = getRandomNumber(j * 15 + 1, (j + 1) * 15, usedNumbers);
      }
      if(bodyId == "bingo-card-body-user-x")
      {
      cell.addEventListener("click", function () {
        toggleCellColor(this);
      });
      }
      row.appendChild(cell);
    }
    bingoCardBody.appendChild(row);
  }
}


function toggleCellColor(cell) {
  cell.classList.toggle("selected");
}
function toggleWinColor(cell) {
  cell.classList.toggle("won");
}


function selectUserCell(bingoCardBodyId){

  var bingoCard = document.getElementById(bingoCardBodyId);
  
  var rows = bingoCard.getElementsByTagName('tr');
  var cellInt;
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
    cellInt = parseInt(cell.textContent , 10);
   
    if (cellInt == lastDrawnNumber)
    {
      toggleCellColor(cell);

    }
  }

    
           
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


// Function to draw numbers at 4-second intervals

function drawOneNumber(gamesplayed , gameswon) {
  
  var drawNumbersTextarea = document.getElementById("draw-numbers-textarea");
      
      i=0;      
      if (counter >= 75) {
           alert('Draw Done');
           document.getElementById('draw-numbers-btn').disabled = true;
           
      }
      else{
        drawNumber(i, drawnNumbers , drawNumbersTextarea );
      }
      counter = counter +1;
    
      
}
        
     
function drawNumbers() {
  var drawNumbersTextarea = document.getElementById("draw-numbers-textarea");
  
  drawnNumbers.push(0);
  
  // Draw 75 numbers
 
  
  for (let i = 0; i < 75 ; i++) {
    
    if(gameStop == 0)
      drawNumber(i, drawnNumbers , drawNumbersTextarea);
      
     
  }
}

function drawNumber(i, drawnNumbers , drawNumbersTextarea) {
  setTimeout(function () {
    var number;
    
    do {
      number = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.includes(number) );
    lastDrawnNumber = number;
    selectUserCell("bingo-card-body-user-y");
    drawnNumbers.push(number);
    
    drawNumbersTextarea.value +=  number + "\n";
    drawNumbersTextarea.scrollTop = drawNumbersTextarea.scrollHeight; 
    
    checkBingo("bingo-card-body-user-y" , "AI-user" );
  },  i*4000);

     
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

function checkBingo(bingoCardId , userEmail ) {
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
       
       

   }
   return userwon;
   
}


function playBingoSound(file) {
  var audio = new Audio(file); 
  audio.play();
}






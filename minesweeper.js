
var grid = document.getElementById("grid");
var debug = false;
const N = 10;
var hiddenGrid = [];
var visibleGrid = [];
var countElement = document.getElementById("count");
var bombCount = 10;
countElement.innerHTML = bombCount;


generateGrid();

// Make the grid
function generateGrid() {
  grid.innerHTML = "";
  for (var i = 0 ; i < N ; i++) {
    row = grid.insertRow(i);
    for (var j = 0 ; j < N ; j++){
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      cell.oncontextmenu = function() { rightClickCell(this); };
      var mine = document.createAttribute("data-mine");
      var cell_value = document.createAttribute("cell-value");
      var visible = document.createAttribute("visible");
      mine.value = "false";
      cell_value.value = "B";
      visible.value = "false";
      cell.setAttributeNode(mine);
      cell.setAttributeNode(cell_value);
      cell.setAttributeNode(visible);
      cell.className = "hidden";
    }
  }
  addMines();
  addNumbers();
}

function addMines() {
  // Place Bombs
  for (var i = 0 ; i < N ; i++){
    var coords = randomCoords(N);
    var cell = grid.rows[coords[0]].cells[coords[1]];
    while (cell.getAttribute("data-mine") === 'true'){
      coords = randomCoords(N);
      cell = grid.rows[coords[0]].cells[coords[1]];
    }
    cell.setAttribute("data-mine", "true")
    if (debug) cell.innerHTML="B";
  }
}

function addNumbers() {
  // Fill in the rest of the grid with number values
  for (var i = 0 ; i < N ; i++) {
    for (var j = 0 ; j < N ; j++) {
      //List of all surrounding cells - discarding anything off of the grid
      // Skip cells with Bombs in them
      var cell = grid.rows[i].cells[j];
      if (cell.getAttribute("data-mine") === "false") {
        var surroundingCells = getSurroundingCells(cell, i, j);
        //Count the number of bombs touching the cell
        // Write this number to the cell
        var bombCount = 0;
        surroundingCells.forEach(function(el) {
          var sCell = grid.rows[el[0]].cells[el[1]];
          if (sCell.getAttribute("data-mine") === "true"){
            bombCount++;
          }
        })
        cell.setAttribute("cell-value", bombCount);
        if (debug) cell.innerHTML = bombCount;
      }
    }
  }
}

// TODO - still need to update bombcount if you click a red cell
// that doesnt end up being a bomb !!!!!!!!!!!
// or else disable clicks on red cells
function clickCell(cell) {
  // if bomb is clicked
  if (cell.getAttribute("data-mine") === "true") {
    // reveal board, alert that player lost
    revealBoard();
    alert("BOMB! Game Over.");
  }
  //else - no bomb
  else {
    // TODO if it is red, increase bomb count
    cell.className = "clicked";
    // if value is > 0 - reveal one cell
    if (cell.getAttribute("cell-value") > 0){
      cell.innerHTML = cell.getAttribute("cell-value");
      cell.setAttribute("visible", "true");
    }
    // If cell = 0, reveal cell and all surrounding cells
    else if (cell.getAttribute("cell-value") == 0) {
      recursive(cell);
    }
    //check if game is over
    var gameOver = checkGameOver();
    if (gameOver){
      alert("You win!")
      revealBoard();
    }
  }
}

function rightClickCell(cell) {
  // if cell is not already red
  if (cell.className == "hidden") {
    // turn the cell red
    cell.className = "bomb"
    // decrease bomb count
    bombCount = bombCount - 1;
    countElement.innerHTML = bombCount;
  }
  else {
    // else make cell grey again & increase bomb count
    cell.className = "hidden";
    bombCount = bombCount + 1;
    countElement.innerHTML = bombCount;
  }
}

function recursive(cell) {
  // Update the cell to clicked, visible
  cell.innerHTML = cell.getAttribute("cell-value");
  cell.setAttribute("visible", "true");
  cell.className = "clicked";
  // Get all of the surrounding cells
  var surroundingCells = getSurroundingCells(cell, cell.parentNode.rowIndex, cell.cellIndex);
  surroundingCells.forEach(function(coords) {
    c = grid.rows[coords[0]].cells[coords[1]];
    if (c.getAttribute("visible") === "false"){
      // Update surrounding cells to clicked, visible
      c.innerHTML = c.getAttribute("cell-value");
      c.setAttribute("visible", "true");
      c.className = "clicked";
      // if the cell value is 0 - you can update all of its surrounding cells as well
      // call the function recursively on the cells with value 0
      if (c.getAttribute("cell-value") == 0){
        recursive(c);
      }
    }
  })
}

function checkGameOver(){
  // all cells that arent bombs are visible
  var gameOver = true;
  for (var i = 0 ; i < N ; i++) {
    for (var j = 0 ; j < N ; j++){
      var cell = grid.rows[i].cells[j];
      if ((cell.getAttribute("visible") == "false") && (cell.getAttribute("cell-value") !== 'B')){
        gameOver = false;
        break;
      }
    }
    if (!gameOver){
      break;
    }
  }
  return gameOver;
}

function revealBoard() {
  // show all cell values
  // set innerHTML to the cell-value attribute value
  for (var i = 0 ; i < N ; i++) {
    for (var j = 0 ; j < N ; j++){
      var cell = grid.rows[i].cells[j];
      if (cell.getAttribute("data-mine") == "true"){
        cell.className = "bomb";
      }else {
        cell.className = "clicked";
        cell.innerHTML = cell.getAttribute("cell-value");
      }
    }
  }
}

function getSurroundingCells(cell, i, j) {
  var surroundingCells = []
  var xMin = (i-1 >= 0) ? i-1 : 0;
  var xMax = (i+1 < N) ? i+1 : N-1;
  var yMin = (j-1 >= 0) ? j-1 : 0;
  var yMax = (j+1 < N) ? j+1 : N-1;

  for (var k = xMin ; k <= xMax ; k++) {
    for (var m = yMin ; m <= yMax ; m++) {
      // make sure it is on the grid and NOT the current cell
      if (k === i && m === j) {
        continue;
      }
      else {
        surroundingCells.push([k, m]);
      }
    }
  }
  return surroundingCells;
}

function randomCoords(n) {
  var x = Math.floor(Math.random() * n);
  var y = Math.floor(Math.random() * n);
  return [x, y];
}

/*

Sources: https://www.101computing.net/minesweeper-in-javascript/
Got some help in implementing the HTML/CSS for the game 

*/

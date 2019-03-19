var grid = document.getElementById("grid");
var debug = false;
const N = 10;
var hiddenGrid = [];
var visibleGrid = [];
var countElement = document.getElementById("count");
countElement.innerHTML = "10";


generateGrid();

// Make the grid
function generateGrid() {
  grid.innerHTML = "";
  for (var i = 0 ; i < N ; i++) {
    row = grid.insertRow(i);
    for (var j = 0 ; j < N ; j++){
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      var mine = document.createAttribute("data-mine");
      var cell_value = document.createAttribute("cell-value");
      var visible = document.createAttribute("visible");
      mine.value = "false";
      cell_value.value = "B";
      visible.value = "false";
      cell.setAttributeNode(mine);
      cell.setAttributeNode(cell_value);
      cell.setAttributeNode(visible);
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

function clickCell(cell) {
  // if bomb is clicked
  if (cell.getAttribute("data-mine") === "true") {
    // reveal board, alert that player lost
    revealBoard();
    alert("BOMB! Game Over.");
  }
  //else - no bomb
  else {
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

function recursive(cell) {
  cell.innerHTML = cell.getAttribute("cell-value");
  cell.setAttribute("visible", "true");
  var surroundingCells = getSurroundingCells(cell, cell.parentNode.rowIndex, cell.cellIndex);
  surroundingCells.forEach(function(coords) {
    c = grid.rows[coords[0]].cells[coords[1]];
    if (c.getAttribute("visible") === "false"){
      c.innerHTML = c.getAttribute("cell-value");
      c.setAttribute("visible", "true");
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
      cell.innerHTML = cell.getAttribute("cell-value");
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

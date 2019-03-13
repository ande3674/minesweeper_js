var grid = document.getElementById("grid");
var debug = false;
const N = 10;
var hiddenGrid = [];
var visibleGrid = [];

generateGrid();

// Make the grid
function generateGrid() {
  grid.innerHTML = "";
  for (var i = 0 ; i < N ; i++) {
    row = grid.insertRow(i);
    for (var j = 0 ; j < N ; j++){
      //row[j] = j;
      cell = row.insertCell(j);
      cell.onclick = function() { clickCell(this); };
      var mine = document.createAttribute("data-mine");
      var cell_value = document.createAttribute("cell-value");
      mine.value = "false";
      cell_value.value = "B";
      cell.setAttributeNode(mine);
      cell.setAttributeNode(cell_value)
    }
    //hiddenGrid[i] = row;
  }
  addMines();
  addNumbers();
}

function addMines() {
  // Place Bombs
  for (var i = 0 ; i < N ; i++){
    var coords = randomCoords(N);
    //var gridValue = hiddenGrid[coords[0]][coords[1]];
    var cell = grid.rows[coords[0]].cells[coords[1]];
    while (cell.getAttribute("data-mine") === 'true'){
      coords = randomCoords(N);
      cell = grid.rows[coords[0]].cells[coords[1]];
    }
    cell.setAttribute("data-mine", "true")
    if (debug) cell.innerHTML="B";
    //hiddenGrid[coords[0]][coords[1]] = 'B'
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
//console.log(grid);
function clickCell(cell) {
  // if bomb is clicked
  if (cell.getAttribute("data-mine") === "true") {
    // reveal board
    revealBoard();
    // alert that player lost
    alert("Game Over");
  }
  //else - no bomb
  else {
    // if value is > 0 - reveal one cell
    if (cell.getAttribute("cell-value") > 0){
      console.log(cell.innerHTML);
      cell.innerHTML = cell.getAttribute("cell-value");
    }
    else if (cell.getAttribute("cell-value") === 0) {
      // TODO make this recursive AF
      // get list of adjacent cells
      // check if value is still zero/stop when you reach a value > 0
      // TODO - how do you get the row and cell index ?!
      cell.innerHTML = cell.getAttribute("cell-value");
      console.log(cell.target.cellIndex);
      var surroundingCells = getSurroundingCells(cell, cell.parentNode.rowIndex, cell.target.cellIndex);
      console.log(surroundingCells);


    }
    // TODO check if game is over
  }
}
// TODO Use this one?
function revealCellReturnSurroundingCellsEqualToZero(cell) {
  cell.innerHTML = cell.getAttribute("cell-value");
  //console.log(cell.target.cellIndex);
  var surroundingCells = getSurroundingCells(cell, cell.parentNode.rowIndex, cell.target.cellIndex);
  //console.log(surroundingCells);
  var surroundingEqualingZero = [];
  surroundingCells.forEach(function(el) {
    if (grid.rows[el[0]].cells[el[1]].getAttribute("cell-value") === 0){
      surroundingEqualingZero.push(el);
    }
  })
  return surroundingEqualingZero;
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

function revealCellReturnSurroundingCellsEqualToZero(cell) {
  cell.innerHTML = cell.getAttribute("cell-value");
  //console.log(cell.target.cellIndex);
  var surroundingCells = getSurroundingCells(cell, cell.parentNode.rowIndex, cell.target.cellIndex);
  //console.log(surroundingCells);
  var surroundingEqualingZero = [];
  surroundingCells.forEach(function(el) {
    if (grid.rows[el[0]].cells[el[1]].getAttribute("cell-value") === 0){
      surroundingEqualingZero.push(el);
    }
  })
  return surroundingEqualingZero;
}

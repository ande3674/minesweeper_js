const N = 10;
var hiddenGrid = [];
var visibleGrid = [];

// Make the grid
for (var i = 0 ; i < N ; i++) {
  var row = []
  for (var j = 0 ; j < N ; j++){
    row[j] = j;
  }
  hiddenGrid[i] = row;
}
// Place Bombs
for (var i = 0 ; i < N ; i++){
  var coords = randomCoords(N);
  var gridValue = hiddenGrid[coords[0]][coords[1]];
  while (gridValue === 'B'){
    coords = randomCoords(N);
  }
  hiddenGrid[coords[0]][coords[1]] = 'B'
}

// Fill in the rest of the grid with number values
for (var i = 0 ; i < N ; i++) {
  for (var j = 0 ; j < N ; j++) {
    //List of all surrounding cells - discarding anything off of the grid
    // Skip cells with Bombs in them
    if (hiddenGrid[i][j] !== 'B') {
      var surroundingCells = []
      var xMin = (i-1 >= 0) ? i-1 : 0;
      var xMax = (i+1 < N) ? i+1 : N-1;
      var yMin = (j-1 >= 0) ? j-1 : 0;
      var yMax = (j+1 < N) ? j+1 : N-1;
      //console.log(xMin + " " + xMax + " " + yMin + " " + yMax);
      for (var k = xMin ; k <= xMax ; k++) {
        for (var m = yMin ; m <= yMax ; m++) {
          //console.log([k, m]);
          // make sure it is on the grid and NOT the current cell
          if (k === i && m === j) {
            continue;
          }
          else {
            surroundingCells.push([k, m])
          }
        }
      }
      //Count the number of bombs touching the cell
      // Write this number to the cell
      var bombCount = 0;
      surroundingCells.forEach(function(el) {
        if (hiddenGrid[el[0]][el[1]] === 'B'){
          bombCount++;
        }
      })
      hiddenGrid[i][j] = bombCount;
    }
  }
}
//console.log(hiddenGrid);

function randomCoords(n) {
  var x = Math.floor(Math.random() * n);
  var y = Math.floor(Math.random() * n);
  return [x, y];
}

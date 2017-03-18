function solvePuzzle (clues) {
  var result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  
  clues.forEach(function(value, index) {
    var column = 0;
    var row = 0;
    if (value == 1) {
      if (index < 4) {
        row = 0;
        column = index;
      } else if (index < 8) {
        row = index - 4;
        column = 3;
      } else if (index < 12) {
        row = 3;
        column = 11 - index;
      } else {
        row = 15 - index;
        column = 0;
      }
      result[row][column] = 4;
    }
  });
  
  console.log(result);
  
  return result;
}

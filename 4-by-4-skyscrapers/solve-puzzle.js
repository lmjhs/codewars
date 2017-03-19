

exports.solve = function solvePuzzle (clues) {
  var result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  
  clues.forEach(function(clue, index) {
    result = checkTallBuilding(result, clue, index);
    result = checkLowBuilding(result, clue, index);
  });

  console.log(clues);
  console.log(result);

  return result;
}

function checkTallBuilding(result, clue, index) {
  if (clue == 1) {
    if (index < 4) {
      result[0][index] = 4;
    } else if (index < 8) {
      result[index - 4][3] = 4;
    } else if (index < 12) {
      result[3][11 - index] = 4;
    } else {
      result[15 - index][0] = 4;
    }
  }
  return result;
}

function checkLowBuilding(result, clue, index) {
  if (clue == 4) {
    if (index < 4) {
      result[0][index] = 1;
      result[1][index] = 2;
      result[2][index] = 3;
      result[3][index] = 4;
    } else if (index < 8) {
      result[index - 4][0] = 4;
      result[index - 4][1] = 3;
      result[index - 4][2] = 2;
      result[index - 4][3] = 1;
    } else if (index < 12) {
      result[0][11 - index] = 4;
      result[1][11 - index] = 3;
      result[2][11 - index] = 2;
      result[3][11 - index] = 1;
    } else {
      result[15 - index][0] = 1;
      result[15 - index][1] = 2;
      result[15 - index][2] = 3;
      result[15 - index][3] = 4;
    }
  }
  return result;
}
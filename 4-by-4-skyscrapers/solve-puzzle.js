


exports.solvePuzzle = function solvePuzzle(clues) {
  function cell(size, row, column) {
    var that = this;
    this.row = row;
    this.column = column;
    
    this.startingOptions = []
    for (i = 1; i <= size; i++) {
      this.startingOptions.push(i);
    }

    this.result = 0;
    this.options = this.startingOptions.slice();
    this.reset = function() {
      that.result = 0;
      that.options = that.startingOptions.slice();
    }
    this.solve = function() {
      while (that.options.length > 0) {
        that.result = this.options.shift();
        console.log(grid.getResult());
        // console.log('Result: ' + that.result);
        if (!that.row.hasDuplicates() && !that.column.hasDuplicates()) {
          return true;
        }
      }
      that.reset();
      return false;
    }
  }

  function row() {
    this.leftClue = 0;
    this.rightClue = 0; 
    var that = this;
    this.cells = [];
    this.addCell = function(cell) {
      this.cells.push(cell);
    };
    this.getResult = function() {
      var result = [];
      that.cells.forEach(function(cell) {
        result.push(cell.result);
      });
      return result;
    };

    var cell = 0;
    this.solve = function() {
      while (cell >= 0 && cell < that.cells.length) {
        if (that.cells[cell].solve()) {
          cell++;
        } else {
          cell--;
        }
        if (cell == that.cells.length) {
          if (!that.valid()) {
            cell--;
            that.cells[cell].reset();
            cell--;
          }
        }
      }
      if (cell == that.cells.length) {
        cell--;
        return true;
      }
      cell = 0;
      return false;
    }
    this.hasDuplicates = function() {
      var seen = [];
      var valid = false;
      
      that.cells.forEach(function(cell) {
        if (cell.result > 0 && seen.indexOf(cell.result) >= 0) {
          valid = true;
        }
        seen.push(cell.result);
        // console.log('Row Seen: ' + seen);
      });

      return valid;
    }
    this.valid = function() {
      return that.leftClueValid() && that.rightClueValid();
    }
    this.leftClueValid = function() {
      if (that.leftClue > 0) {
        var highest = 0;
        var count = 0;
        that.cells.forEach(function(cell) {
          if (cell.result > highest) {
            highest = cell.result;
            count++;
          }
        });
        console.log('Left Clue Count: ' + count + ' / ' + that.leftClue);
        if (count == that.leftClue){
          return true;
        }
        return false;
      }
      return true;
    }

    this.rightClueValid = function() {
      if (that.rightClue > 0) {
        var highest = 0;
        var count = 0;
        for (i = that.cells.length - 1; i >= 0; i--) {
          if (that.cells[i].result > highest) {
            highest = that.cells[i].result;
            count++;
          }
        };
        console.log('Right Clue Count: ' + count + ' / ' + that.rightClue);
        if (count == that.rightClue){
          return true;
        }
        return false;
      }
      return true;
    }
  }

  function column() {
    var that = this;
    this.topClue = 0;
    this.bottomClue = 0; 
    this.cells = [];
    this.addCell = function(cell) {
      this.cells.push(cell);
    }
    this.hasDuplicates = function() {
      var seen = [];
      var valid = false;
      
      that.cells.forEach(function(cell) {
        if (cell.result > 0 && seen.indexOf(cell.result) >= 0) {
          valid = true;
        }
        seen.push(cell.result);
        // console.log('Column Seen: ' + seen);
      });

      return valid;
    }
  }

  function grid(size, clues) {
    var that = this;
    this.columns = [];
    this.rows = [];

    for (i = 1; i <= size; i++) {
      this.columns.push(new column());
      this.rows.push(new row());
    }

    that.rows.forEach(function(row, rowIndex) {
      that.columns.forEach(function(col, colIndex) {
        var c = new cell(size, that.rows[rowIndex], that.columns[colIndex]);
        that.rows[rowIndex].cells.push(c);
        that.columns[colIndex].cells.push(c);
      });
    });

    clues.forEach(function(clue, index) {
      if (index < 4) {
        that.columns[index].topClue = clue;
      } else if (index < 8) {
        that.rows[index - 4].rightClue = clue;
      } else if (index < 12) {
        that.columns[11 - index].bottomClue = clue;
      } else {
        that.rows[15 - index].leftClue = clue;
      }
    });

    this.solve = function() {
      // that.rows[0].solve();
      var row = 0
      while (row >= 0 && row < that.rows.length) {
        if (that.rows[row].solve()) {
          console.log('Solved Row');
          row++;
        } else {
          console.log('Failed Row');
          row--;
        }
      }
      return that.getResult();
    }

    this.getResult = function() {
      var result = [];
      that.rows.forEach(function(row) {
        result.push(row.getResult());
      });
      return result;
    };
  }

  var grid = new grid(4, clues);
  grid.solve();

  console.log(clues);
  console.log(grid.getResult());

  return grid.getResult();
}

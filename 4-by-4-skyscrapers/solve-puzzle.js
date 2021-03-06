


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
        //console.log(grid.getResult());
        // console.log('Result: ' + that.result);
        if (!that.row.hasDuplicates() && !that.column.hasDuplicates()) {
          return true;
        }
      }
      that.reset();
      return false;
    }
  }

  function row(index) {
    this.index = index;
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
          // We are in the last row so check the column is valid
          if (that.index == that.cells.length) {
            if (grid.columns[cell].valid()) {
              cell++;
            } else {
              that.cells[cell].reset();
              cell--;
            }
          } else {
            cell++;
          }
        } else {
          cell--;
        }
        

        // Its the end of the row so check that the row is valid
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
        // console.log('Left Clue Count: ' + count + ' / ' + that.leftClue);
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
        // console.log('Right Clue Count: ' + count + ' / ' + that.rightClue);
        if (count == that.rightClue){
          return true;
        }
        return false;
      }
      return true;
    }
  }

  function column(index) {
    var that = this;
    this.index = index;
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

    this.valid = function() {
      return that.topClueValid() && that.bottomClueValid();
    }

    this.topClueValid = function() {
      if (that.topClue > 0) {
        var highest = 0;
        var count = 0;
        that.cells.forEach(function(cell) {
          if (cell.result > highest) {
            highest = cell.result;
            count++;
          }
        });
        // console.log('Top Clue Count: ' + count + ' / ' + that.topClue);
        if (count == that.topClue){
          return true;
        }
        return false;
      }
      return true;
    }

    this.bottomClueValid = function() {
      if (that.bottomClue > 0) {
        var highest = 0;
        var count = 0;
        for (i = that.cells.length - 1; i >= 0; i--) {
          if (that.cells[i].result > highest) {
            highest = that.cells[i].result;
            count++;
          }
        };
        // console.log('Bottom Clue Count: ' + count + ' / ' + that.bottomClue);
        if (count == that.bottomClue){
          return true;
        }
        return false;
      }
      return true;
    }
  }

  function grid(size, clues) {
    var that = this;
    this.columns = [];
    this.rows = [];
    this.size = size;

    for (i = 1; i <= size; i++) {
      this.columns.push(new column(i));
      this.rows.push(new row(i));
    }

    that.rows.forEach(function(row, rowIndex) {
      that.columns.forEach(function(col, colIndex) {
        var c = new cell(size, that.rows[rowIndex], that.columns[colIndex]);
        that.rows[rowIndex].cells.push(c);
        that.columns[colIndex].cells.push(c);
      });
    });

    clues.forEach(function(clue, index) {
      if (index < that.size) {
        that.columns[index].topClue = clue;
      } else if (index < (that.size * 2)) {
        that.rows[index - that.size].rightClue = clue;
      } else if (index < (that.size * 3)) {
        that.columns[(that.size * 3) - 1 - index].bottomClue = clue;
      } else {
        that.rows[(that.size * 4) - 1 - index].leftClue = clue;
      }
    });

    this.solve = function() {
      // that.rows[0].solve();
      var row = 0
      while (row >= 0 && row < that.rows.length) {
        if (that.rows[row].solve()) {
          // console.log('Solved Row');
          row++;
        } else {
          // console.log('Failed Row');
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
  return grid.solve();
}

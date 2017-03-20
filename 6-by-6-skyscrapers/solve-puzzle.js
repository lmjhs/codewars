


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
        // console.log(grid.getString());
        // console.log(that.options);
        if (!that.row.hasDuplicates() && !that.column.hasDuplicates()) {
          return true;
        }
      }
      that.reset();
      return false;
    }
  }

  function row(index, grid) {
    this.index = index;
    this.leftClue = 0;
    this.rightClue = 0;
    var that = this;
    this.cells = [];
    this.grid = grid;

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

    this.parseClues = function() {
      if (that.leftClue == 1) {
        that.cells[0].startingOptions = [that.cells.length];
        that.cells[0].options = [that.cells.length];
      }
      if (that.rightClue == 1) {
        that.cells[that.cells.length-1].startingOptions = [that.cells.length];
        that.cells[that.cells.length-1].options = [that.cells.length];
      }
      if (that.leftClue > 1 && that.leftClue < that.cells.length) {
        for (i = that.cells.length + 2 - that.topClue; i <= that.cells.length; i++) {
          var index = that.cells[0].startingOptions.indexOf(i);
          if (index > -1) {
            that.cells[0].startingOptions.splice(index, 1);
          }
        }
        that.cells[0].options = that.cells[0].startingOptions.slice();
      }
      if (that.rightClue > 1 && that.rightClue < that.cells.length) {
        for (i = that.cells.length + 2 - that.topClue; i <= that.cells.length; i++) {
          var index = that.cells[that.cells.length-1].startingOptions.indexOf(i);
          if (index > -1) {
            that.cells[that.cells.length-1].startingOptions.splice(index, 1);
          }
        }
        that.cells[that.cells.length-1].options = that.cells[that.cells.length-1].startingOptions.slice();
      }
      if (that.leftClue == that.cells.length) {
        for (i = 0; i < that.cells.length; i++) {
          that.cells[i].startingOptions = [i+1];
          that.cells[i].options = [i+1];
          that.grid.columns[i].cells.forEach(function(cell, cellIndex) {
            if (cellIndex != that.index - 1) {
              var index = cell.startingOptions.indexOf(i+1);
              if (index > -1) {
                cell.startingOptions.splice(index, 1);
                cell.options = cell.startingOptions.slice();
              }
            }
          });
        }
      }
      if (that.rightClue == that.cells.length) {
        for (i = 0; i < that.cells.length; i++) {
          that.cells[that.cells.length-1-i].startingOptions = [i+1];
          that.cells[that.cells.length-1-i].options = [i+1];
          that.grid.columns[that.cells.length-1-i].cells.forEach(function(cell, cellIndex) {
            if (cellIndex != that.index - 1) {
              var index = cell.startingOptions.indexOf(i+1);
              if (index > -1) {
                cell.startingOptions.splice(index, 1);
                cell.options = cell.startingOptions.slice();
              }
            }
          });
        }
      }
    }
  }

  function column(index, grid) {
    var that = this;
    this.index = index;
    this.topClue = 0;
    this.bottomClue = 0;
    this.cells = [];
    this.grid = grid;

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

    this.parseClues = function() {
      if (that.topClue == 1) {
        that.cells[0].startingOptions = [that.cells.length];
        that.cells[0].options = [that.cells.length];
      }
      if (that.bottomClue == 1) {
        that.cells[that.cells.length-1].startingOptions = [that.cells.length];
        that.cells[that.cells.length-1].options = [that.cells.length];
      }
      if (that.topClue > 1 && that.topClue < that.cells.length) {
        for (i = that.cells.length + 2 - that.topClue; i <= that.cells.length; i++) {
          var index = that.cells[0].startingOptions.indexOf(i);
          if (index > -1) {
            that.cells[0].startingOptions.splice(index, 1);
          }
        }
        that.cells[0].options = that.cells[0].startingOptions.slice();
      }
      if (that.bottomClue > 1 && that.bottomClue < that.cells.length) {
        for (i = that.cells.length + 2 - that.topClue; i <= that.cells.length; i++) {
          var index = that.cells[that.cells.length-1].startingOptions.indexOf(i);
          if (index > -1) {
            that.cells[that.cells.length-1].startingOptions.splice(index, 1);
          }
        }
        that.cells[that.cells.length-1].options = that.cells[that.cells.length-1].startingOptions.slice();
      }
      if (that.topClue == 6) {
        for (i = 0; i < that.cells.length; i++) {
          that.cells[i].startingOptions = [i+1];
          that.cells[i].options = [i+1];
          that.grid.rows[i].cells.forEach(function(cell, cellIndex) {
            if (cellIndex != that.index - 1) {
              var index = cell.startingOptions.indexOf(i+1);
              if (index > -1) {
                cell.startingOptions.splice(index, 1);
                cell.options = cell.startingOptions.slice();
              }
            }
          });
        }
      }
      if (that.bottomClue == 6) {
        for (i = 0; i < that.cells.length; i++) {
          that.cells[that.cells.length-1-i].startingOptions = [i+1];
          that.cells[that.cells.length-1-i].options = [i+1];
          that.grid.rows[that.cells.length-1-i].cells.forEach(function(cell, cellIndex) {
            if (cellIndex != that.index - 1) {
              var index = cell.startingOptions.indexOf(i+1);
              if (index > -1) {
                cell.startingOptions.splice(index, 1);
                cell.options = cell.startingOptions.slice();
              }
            }
          });
        }
      }
    }
  }

  function grid(size, clues) {
    var that = this;
    this.columns = [];
    this.rows = [];
    this.cells = [];
    this.size = size;

    for (i = 1; i <= size; i++) {
      this.columns.push(new column(i, this));
      this.rows.push(new row(i, this));
    }

    that.rows.forEach(function(row, rowIndex) {
      that.columns.forEach(function(col, colIndex) {
        var c = new cell(size, that.rows[rowIndex], that.columns[colIndex]);
        that.rows[rowIndex].cells.push(c);
        that.columns[colIndex].cells.push(c);
        that.cells.push(c);
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

    that.rows.forEach(function(row) {
      row.parseClues();
    });

    that.columns.forEach(function(column) {
      column.parseClues();
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
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(that.getString());
        // console.log(that.getString());
      }
      return that.getResult();
    }

    this.getString = function() {
      var result = []
      that.getResult().forEach(function(row){
        result.push(row.join(','));
      });
      return result.join('|');
    }

    this.getResult = function() {
      var result = [];
      that.rows.forEach(function(row) {
        result.push(row.getResult());
      });
      return result;
    };
  }

  var grid = new grid(6, clues);

  // console.log(grid.cells);

  var results = grid.solve();
  return results;
}

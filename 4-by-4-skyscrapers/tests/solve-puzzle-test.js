var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var solvePuzzle = require('./../solve-puzzle.js');

describe("Skyscrapers", function () {
    it("can solve 4x4 puzzle 1", function () {
        var clues = [2, 2, 1, 3,
                     2, 2, 3, 1,
                     1, 2, 2, 3,
                     3, 2, 1, 3];
        var expected = [[1, 3, 4, 2],
                        [4, 2, 1, 3],
                        [3, 4, 2, 1],
                        [2, 1, 3, 4]];
        var actual = solvePuzzle.solve(clues);
        assert(expected, actual);
    });
    it("can solve 4x4 puzzle 2", function () {
        var clues = [0, 0, 1, 2,
            		 0, 2, 0, 0,
            		 0, 3, 0, 0,
            		 0, 1, 0, 0];
        var expected = [[2, 1, 4, 3],
                        [3, 4, 1, 2],
                        [4, 2, 3, 1],
                        [1, 3, 2, 4]];
        var actual = solvePuzzle.solve(clues);
        assert(expected, actual);
    });
});

function assert(expected, actual){
    expect(actual.length).to.equal(4);
    for (var i = 0; i < 4; i++) {
        expect(actual[i].toString()).to.equal(expected[i].toString());
    }
}
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var solvePuzzle = require('./../solve-puzzle.js');



describe("Skyscrapers", function () {
    this.timeout(35000);
    // it("can solve 6x6 puzzle 1", function () {
    //     var clues = [ 3, 2, 2, 3, 2, 1,
    //                   1, 2, 3, 3, 2, 2,
    //                   5, 1, 2, 2, 4, 3,
    //                   3, 2, 1, 2, 2, 4];

    //     var expected = [[ 2, 1, 4, 3, 5, 6],
    //                     [ 1, 6, 3, 2, 4, 5],
    //                     [ 4, 3, 6, 5, 1, 2],
    //                     [ 6, 5, 2, 1, 3, 4],
    //                     [ 5, 4, 1, 6, 2, 3],
    //                     [ 3, 2, 5, 4, 6, 1]];
    //     var actual = solvePuzzle.solvePuzzle(clues);
    //     assert(expected, actual);
    // });
    // it("can solve 6x6 puzzle 2", function () {
    //     var clues = [ 0, 0, 0, 2, 2, 0,
    //                   0, 0, 0, 6, 3, 0,
    //                   0, 4, 0, 0, 0, 0,
    //                   4, 4, 0, 3, 0, 0];

    //     var expected = [[ 5, 6, 1, 4, 3, 2 ],
    //                     [ 4, 1, 3, 2, 6, 5 ],
    //                     [ 2, 3, 6, 1, 5, 4 ],
    //                     [ 6, 5, 4, 3, 2, 1 ],
    //                     [ 1, 2, 5, 6, 4, 3 ],
    //                     [ 3, 4, 2, 5, 1, 6 ]];
    //     var actual = solvePuzzle.solvePuzzle(clues);
    //     assert(expected, actual);
    // });
    it("can solve 6x6 puzzle 3", function () {
        var clues = [ 0, 3, 0, 5, 3, 4,
                      0, 0, 0, 0, 0, 1,
                      0, 3, 0, 3, 2, 3,
                      3, 2, 0, 3, 1, 0];

        var expected = [[ 5, 2, 6, 1, 4, 3 ],
                        [ 6, 4, 3, 2, 5, 1 ],
                        [ 3, 1, 5, 4, 6, 2 ],
                        [ 2, 6, 1, 5, 3, 4 ],
                        [ 4, 3, 2, 6, 1, 5 ],
                        [ 1, 5, 4, 3, 2, 6 ]];
        var actual = solvePuzzle.solvePuzzle(clues);
        assert(expected, actual);
    });
});

function assert(expected, actual){
    expect(actual.length).to.equal(6);
    for (var i = 0; i < 6; i++) {
        expect(actual[i].toString()).to.equal(expected[i].toString());
    }
}
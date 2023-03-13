const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', () => {
        assert.equal(solver.validate('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'), true);
    });
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
        assert.equal(solver.validate('5..91372.3...8.5.9.9.25..8.68.47.23.n.95..46.7.4.....5.2.......4..8916..85.72...3').error,
        'Invalid characters in puzzle');
    });
    test('Logic handles a puzzle string that is not 81 characters in length', () => {
        assert.equal(solver.validate('5..91372.3...8.5.9.9.25..8.68.47.23....95..46.7.4.....5.2.......4..8916..85.72...3').error,
        'Expected puzzle to be 81 characters long');
    });
    test('Logic handles a valid row placement', () => {
        assert.equal(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 0, 1, 7), false);
    });
    test('Logic handles an invalid row placement', () => {
        assert.equal(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 0, 1, 9), true);
    });
    test('Logic handles a valid column placement', () => {
        assert.equal(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 5, 0, 2), false);
    });
    test('Logic handles an invalid column placement', () => {
        assert.equal(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 5, 0, 1), true);
    });
    test('Logic handles a valid region (3x3 grid) placement', () => {
        assert.equal(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 0, 0, 7), false);
    });
    test('Logic handles a invalid region (3x3 grid) placement', () => {
        assert.equal(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 0, 0, 9), true);
    });
    test('Valid puzzle strings pass the solver', () => {
        assert.property(solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'), 'solution');
    });
    test('Invalid puzzle strings fail the solver', () => {
        assert.property(solver.solve('999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'), 'error');
    });
    test('Solver returns the expected solution for an incomplete puzzle', () => {
        assert.equal(solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51').solution,
        '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
    });

    
});

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let reply;
      if (!(req.body.hasOwnProperty('puzzle') && req.body.hasOwnProperty('coordinate') && req.body.hasOwnProperty('value'))){
        res.json({error: 'Required field(s) missing'});
        return;
      }
      const validRequest = solver.validate(req.body.puzzle);
      if (validRequest.hasOwnProperty('error')) {
        reply = validRequest;
      } else if (!/^[A-I][1-9]$/.test(req.body.coordinate)) {
        reply = {"error": "Invalid coordinate"};
      } else if (!/^[1-9]$/.test(req.body.value)) {
        reply = {"error": "Invalid value"};
      }
      if (!reply) {
        let conflicts = []
        if (solver.checkRowPlacement(req.body.puzzle, parseInt(req.body.coordinate[0], 36) - 10, parseInt(req.body.coordinate[1])-1, req.body.value)) {
          conflicts.push('row');
        }
        if (solver.checkColPlacement(req.body.puzzle, parseInt(req.body.coordinate[0], 36) - 10, parseInt(req.body.coordinate[1])-1, req.body.value)) {
          conflicts.push('column');
        }
        if (solver.checkRegionPlacement(req.body.puzzle, parseInt(req.body.coordinate[0], 36) - 10, parseInt(req.body.coordinate[1])-1, req.body.value)) {
          conflicts.push('region');
        }
        if (conflicts.length > 0) {
          reply = {'valid': false, 'conflict': conflicts};
        } else {
          reply = {'valid': true};
        }
      }
      res.json(reply);
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.hasOwnProperty('puzzle')) {res.json({error: 'Required field missing'}); return;};
      const validRequest = solver.validate(req.body.puzzle);
      if (validRequest.hasOwnProperty('error')) {res.json(validRequest); return;};
      res.json(solver.solve(req.body.puzzle));
    });
};

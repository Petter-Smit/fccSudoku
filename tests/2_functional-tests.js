const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', () => {
        chai.request(server).post('/api/solve').send({puzzle: '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'solution');
            assert.equal(res.body.solution, '218396745753284196496157832531672984649831257827549613962415378185763429374928561');
        });
    });
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', () => {
        chai.request(server).post('/api/solve').send({monkeys: 7}).end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Required field missing');
        });
    });
    test('Solve a puzzle with invalid characters: POST request to /api/solve', () => {
        chai.request(server).post('/api/solve').send({puzzle: '..839.7.575.....904..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid characters in puzzle');
        });
    });
    test('Solve a puzzle with incorrect length: POST request to /api/solve', () => {
        chai.request(server).post('/api/solve').send({puzzle: '..839.7.575.....914..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        });
    });
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', () => {
        chai.request(server).post('/api/solve').send({puzzle: '..839.7.575.....914..1.......16.44444.9.312.7..754.....62..5.78.8...3.2...492...1'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Puzzle cannot be solved');
        });
    });
    test('Check a puzzle placement with all fields: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A1', value: '7'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'valid');
            assert.equal(res.body.valid, true);
        });
    });
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2', value: '1'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'valid');
            assert.equal(res.body.valid, false);
            assert.property(res.body, 'conflict');
            assert.equal(res.body.conflict.length, 1);
        });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2', value: '4'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'valid');
            assert.equal(res.body.valid, false);
            assert.property(res.body, 'conflict');
            assert.equal(res.body.conflict.length, 2);
        });
    });
    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', coordinate: 'A2', value: '5'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'valid');
            assert.equal(res.body.valid, false);
            assert.property(res.body, 'conflict');
            assert.equal(res.body.conflict.length, 3);
        });
    });
    test('Check a puzzle placement with missing required fields: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({coordinate: 'A2', value: '5'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Required field(s) missing');
        });
    });
    test('Check a puzzle placement with invalid characters: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71.n.9......1945....4.37.4.3..6..', coordinate: 'A2', value: '5'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid characters in puzzle');
        });
    });
    test('Check a puzzle placement with incorrect length: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71....9......1945....4.37.4.3..6..', coordinate: 'A2', value: '5'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        });
    });
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71....9.....1945....4.37.4.3..6..', coordinate: 'K2', value: '5'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid coordinate');
        });
    });
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', () => {
        chai.request(server).post('/api/check')
        .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71....9.....1945....4.37.4.3..6..', coordinate: 'A2', value: '0'})
        .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'error');
            assert.equal(res.body.error, 'Invalid value');
        });
    });
});


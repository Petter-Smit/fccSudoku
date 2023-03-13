class SudokuSolver {

  validate(puzzleString) {
    for (const c of puzzleString) {
      if (!/[1-9\.]/.test(c)) return {error: 'Invalid characters in puzzle'};
    }
    if (puzzleString.length !== 81) return {error: 'Expected puzzle to be 81 characters long'};
    return true;
  }

  // Conflict returns 'true'
  checkRowPlacement(puzzleString, row, column, value) {
    const [rowStart, rowEnd] = [row*9, (row+1)*9];
    puzzleString=puzzleString.slice(0,row*9+column)+'.'+puzzleString.slice(row*9+column+1);
    const rowString = puzzleString.slice(rowStart, rowEnd);
    const regex = new RegExp(`${value}`);
    return regex.test(rowString);
  }

  // Conflict returns 'true'
  checkColPlacement(puzzleString, row, column, value) {
    let [firstValues, columnString] = [[0, 9, 18, 27, 36, 45, 54, 63, 72], ''];
    puzzleString=puzzleString.slice(0,row*9+column)+'.'+puzzleString.slice(row*9+column+1);
    for (let i = 0; i < firstValues.length; i++) {
      columnString += puzzleString[firstValues[i]+column];
    }
    const regex = new RegExp(`${value}`);
    return regex.test(columnString);
  }

  // Conflict returns 'true'
  checkRegionPlacement(puzzleString, row, column, value) {
    const firstindex = 27*Math.floor(row/3)+3*Math.floor(column/3);
    puzzleString=puzzleString.slice(0,row*9+column)+'.'+puzzleString.slice(row*9+column+1);
    let regionString = '';
    for (const c of [firstindex, firstindex+1, firstindex+2, firstindex+9, firstindex+10, firstindex+11, firstindex+18, firstindex+19, firstindex+20]){
      regionString += puzzleString[c];
    }
    const regex = new RegExp(`${value}`);
    return regex.test(regionString);
  }

  solve(puzzleString) {
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let changed = false;
    while (/\./.test(puzzleString)){
      changed = false;
      let [row, column, valid] = [0, 0, []];
      for (let i = 0; i < puzzleString.length; i++){
        if (puzzleString[i] === '.') {
          valid = [];
          row = Math.floor(i / 9);
          column = i % 9;
          for (const n of options) {
            if (!this.checkRowPlacement(puzzleString, row, column, n) &&
            !this.checkColPlacement(puzzleString, row, column, n) && 
            !this.checkRegionPlacement(puzzleString, row, column, n)) {
              valid.push(n);
            }
          }
          if (valid.length === 1) {
            puzzleString = puzzleString.slice(0, i)+valid[0]+puzzleString.slice(i+1);
            changed = true;
          }
        }
      }
      if (!changed) {return {error: 'Puzzle cannot be solved'}};
    }
    return {solution: puzzleString};
  }
}

module.exports = SudokuSolver;


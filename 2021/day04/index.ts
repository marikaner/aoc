import { readInput } from '../read-input';

async function getInput() {
  const [numbers, ...boards] = (await readInput(__dirname)).split('\n\n');
  return {
    numbers: numbers.split(',').map((value) => parseInt(value)),
    boards: boards.map((board) => new Board(board))
  };
}

class Board {
  private board: { value: number; marked: boolean }[][];
  constructor(boardString: string) {
    this.board = boardString.split('\n').map((row) =>
      row
        .trim()
        .split(/\s+/)
        .map((cellValue) => ({ value: parseInt(cellValue), marked: false }))
    );
  }

  getValue(row: number, column: number): { value: number; marked: boolean } {
    return this.board[row][column];
  }

  markValue(value: number): void {
    this.board.forEach((row) =>
      row.forEach((cell) => {
        if (cell.value === value) {
          cell.marked = true;
        }
      })
    );
  }

  doesWin(): boolean {
    const rowWins = this.board.some((row) => row.every((cell) => cell.marked));
    if (rowWins) {
      return rowWins;
    }
    for (let col = 0; col < this.board.length; col++) {
      let currentRowWins = true;
      for (let row = 0; row < this.board.length; row++) {
        currentRowWins = currentRowWins && this.board[row][col].marked;
      }
      if (currentRowWins) {
        return true;
      }
    }
    return false;
  }

  getScore(lastValue: number): number {
    return (
      lastValue *
      this.board
        .flat()
        .filter(({ marked }) => !marked)
        .reduce((sum, { value }) => sum + value, 0)
    );
  }
}

async function playBingo(): Promise<number | undefined> {
  const input = await getInput();
  const { numbers } = input;
  let { boards } = input;
  const winningBoards: Board[] = [];
  let round = 0;
  while (round <= numbers.length && boards.length) {
    boards.forEach((board) => {
      board.markValue(numbers[round]);
    });
    console.log(`number ${numbers[round]} marked`);
    winningBoards.push(...boards.filter((board) => board.doesWin()));
    boards = boards.filter((board) => !board.doesWin());
    round++;
  }
  return winningBoards[winningBoards.length - 1]?.getScore(numbers[round - 1]);
}

async function main() {
  console.log(await playBingo());
}

main();

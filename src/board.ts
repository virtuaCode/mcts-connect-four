export const HEIGHT = 6;
export const WIDTH = 7;

export const IN_PROGRESS = -1;
export const EMPTY = 0;
export const P1 = 1;
export const P2 = 2;

export type Player = 0 | 1 | 2

export type BoardCol = Player[];

export class Board {
  columns: BoardCol[];


  constructor();
  constructor(board: Board);
  constructor(board: BoardCol[]);
  constructor(board?: Board | BoardCol[]) {
    if (board === undefined) {
      const cols: BoardCol[] = [];
      for (let x = 0; x < WIDTH; x++) {
        const col: BoardCol = [];
        for (let y = 0; y < HEIGHT; y++) {
          col.push(0);
        }
        cols.push(col);
      }
      this.columns = cols;
    } else if (board instanceof Board) {
      const cols: BoardCol[] = [];
      for (let x = 0; x < WIDTH; x++) {
        const col: BoardCol = [];
        for (let y = 0; y < HEIGHT; y++) {
          col.push(board.columns[x][y]);
        }
        cols.push(col);
      }
      this.columns = cols;
    } else {
      this.columns = board;
    }
  }

  insert(player: 1 | 2, colPos: number) {
    if (colPos < 0 || colPos >= WIDTH)
      throw new Error('Invalid column number');

    const col = this.columns[colPos];

    if (col.every(p => p !== 0))
      throw new Error('Column already full');

    for (let i = 0; i < col.length; i++) {
      if (col[i] === 0) {
        col[i] = player;
        break;
      }
    }
  }

  print(options: { empty?: string, player?: string, opponent?: string } = {}) {
    const { empty = '.', player = 'O', opponent = 'X' } = options;

    console.log('1 2 3 4 5 6 7');
    for (let y = HEIGHT - 1; y >= 0; y--) {
      let line = '';
      for (let x = 0; x < WIDTH; x++) {
        const value = this.columns[x][y];
        line += value === 0 ? empty : value === 1 ? player : opponent;
        line += ' ';
      }
      console.log(line);
    }
  }

  status(): -1 | 0 | 1 | 2 {
    function checkLine(a: Player, b: Player, c: Player, d: Player) {
      for (const para of [a, b, c, d]) {
        if (para === undefined) throw new Error('Parameter is undefined');
      }

      return ((a != 0) && (a == b) && (a == c) && (a == d));
    }

    for (let x = 0; x < WIDTH; x++) {
      let prev = this.columns[x][0];
      let count = 0;
      for (let y = 0; y < HEIGHT; y++) {
        if (prev === this.columns[x][y]) {
          count++;
        } else {
          count = 1;
        }

        prev = this.columns[x][y];

        if (count === 4 && (prev === 1 || prev === 2)) {
          return prev;
        }
      }
    }

    for (let y = 0; y < HEIGHT; y++) {
      let prev = this.columns[0][y];
      let count = 0;
      for (let x = 0; x < WIDTH; x++) {
        if (prev === this.columns[x][y]) {
          count++;
        } else {
          count = 1;
        }

        prev = this.columns[x][y];


        if (count === 4 && (prev === 1 || prev === 2)) {
          return prev;
        }
      }
    }

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 3; y++) {
        if (checkLine(this.columns[x][y], this.columns[x + 1][y + 1], this.columns[x + 2][y + 2], this.columns[x + 3][y + 3]))
          return this.columns[x][y];
      }
    }

    for (let x = 0; x < 4; x++) {
      for (let y = 5; y > 2; y--) {
        if (checkLine(this.columns[x][y], this.columns[x + 1][y - 1], this.columns[x + 2][y - 2], this.columns[x + 3][y - 3]))
          return this.columns[x][y];
      }
    }

    // // Check down-right
    // for (let y = 0; y < WIDTH - 3; y++)
    //   for (let x = 0; x < HEIGHT - 3; x++)
    //     if (checkLine(this.columns[x][y], this.columns[x + 1][y + 1], this.columns[x + 2][y + 2], this.columns[x + 3][y + 3]))
    //       return this.columns[x][y];

    // // Check down-left
    // for (let x = 3; x < 7; x++)
    //   for (let y = 0; y < 3; y++)
    //     if (checkLine(this.columns[x][y], this.columns[x - 1][y + 1], this.columns[x - 2][y + 2], this.columns[x - 3][y + 3]))
    //       return this.columns[x][y];



    const hasEmpty = this.columns.some(col => col.some(row => row === 0));

    if (!hasEmpty)
      return 0;

    return -1;
  }

  getEmptyPositions(): number[] {
    const emptyPositions = [];
    for (let i = 0; i < WIDTH; i++) {
      if (this.columns[i].some(e => e === 0)) {
        emptyPositions.push(i);
      }
    }
    return emptyPositions;
  }
}
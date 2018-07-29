import { Board, BoardCol, WIDTH, HEIGHT } from "./board";
import { MonteCarloTreeSearch } from "./mcts";

export class Game {
  board: Board = new Board();
  mcts: MonteCarloTreeSearch = new MonteCarloTreeSearch();

  constructor() { }

  hasEnded() {
    return this.board.status() !== -1;
  }

  move(pos: number) {
    this.board.insert(1, pos - 1);
  }

  moveOpponent(): Promise<void> {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./js/worker.js');
      worker.onerror = (e) => {
        reject(e.message);
        worker.terminate();
      };
      worker.onmessage = (msg) => {
        if (msg.data.topic === 'ready') {
          worker.postMessage(this.board.columns);
        } else {
          console.log('set columns');
          this.board.columns = msg.data;
          resolve();
          worker.terminate();
        }
      };
    });
  }

  getData() {
    const cols: BoardCol[] = [];
    for (let x = 0; x < WIDTH; x++) {
      const col: BoardCol = [];
      for (let y = 0; y < HEIGHT; y++) {
        col.push(this.board.columns[x][y]);
      }
      cols.push(col);
    }
    return cols;
  }
}
import { Board } from "./board";

export class State {
  winScore = 0;
  visitCount = 0;
  board: Board;
  playerNo: 1 | 2 = 1;

  constructor(state?: Board | State) {
    if (!state) {
      this.board = new Board();
    } else {
      if (state instanceof State) {
        this.board = new Board(state.getBoard());
        this.playerNo = state.getPlayerNo();
        this.visitCount = state.getVisitCount();
        this.winScore = state.getWinScore();
      } else if (state instanceof Board) {
        this.board = new Board(state);
      } else {
        throw Error('Wrong object type');
      }
    }
  }


  getBoard() {
    return this.board;
  }

  setBoard(board: Board) {
    this.board = board;
  }

  getPlayerNo() {
    return this.playerNo;
  }

  setPlayerNo(playerNo: 1 | 2) {
    this.playerNo = playerNo;
  }

  getOpponent() {
    return this.playerNo === 1 ? 2 : 1;
  }

  getVisitCount() {
    return this.visitCount;
  }

  setVisitCount(visitCount: number) {
    this.visitCount = visitCount;
  }

  getWinScore() {
    return this.winScore;
  }

  setWinScore(winScore: number) {
    this.winScore = winScore;
  }

  getAllPossibleStates() {
    const possibleStates = [];
    const availablePositions = this.board.getEmptyPositions();
    for (const x of availablePositions) {
      const newState = new State(this.board);
      newState.setPlayerNo(this.playerNo === 1 ? 2 : 1);
      newState.getBoard().insert(newState.getPlayerNo(), x);
      possibleStates.push(newState);
    }
    return possibleStates;
  }

  incrementVisit() {
    this.visitCount++;
  }

  addScore(score: number) {
    if (this.winScore !== Number.MIN_VALUE)
      this.winScore += score;
  }

  randomPlay() {
    const availablePositions = this.board.getEmptyPositions();
    const totalPossibilities = availablePositions.length;
    const x = availablePositions[Math.floor(Math.random() * totalPossibilities)];
    this.board.insert(this.playerNo, x);
  }

  togglePlayer() {
    this.playerNo = this.playerNo === 1 ? 2 : 1;
  }
}
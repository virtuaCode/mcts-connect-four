define(["require", "exports", "./board"], function (require, exports, board_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var State = /** @class */ (function () {
        function State(state) {
            this.winScore = 0;
            this.visitCount = 0;
            this.playerNo = 1;
            if (!state) {
                this.board = new board_1.Board();
            }
            else {
                if (state instanceof State) {
                    this.board = new board_1.Board(state.getBoard());
                    this.playerNo = state.getPlayerNo();
                    this.visitCount = state.getVisitCount();
                    this.winScore = state.getWinScore();
                }
                else if (state instanceof board_1.Board) {
                    this.board = new board_1.Board(state);
                }
                else {
                    throw Error('Wrong object type');
                }
            }
        }
        State.prototype.getBoard = function () {
            return this.board;
        };
        State.prototype.setBoard = function (board) {
            this.board = board;
        };
        State.prototype.getPlayerNo = function () {
            return this.playerNo;
        };
        State.prototype.setPlayerNo = function (playerNo) {
            this.playerNo = playerNo;
        };
        State.prototype.getOpponent = function () {
            return this.playerNo === 1 ? 2 : 1;
        };
        State.prototype.getVisitCount = function () {
            return this.visitCount;
        };
        State.prototype.setVisitCount = function (visitCount) {
            this.visitCount = visitCount;
        };
        State.prototype.getWinScore = function () {
            return this.winScore;
        };
        State.prototype.setWinScore = function (winScore) {
            this.winScore = winScore;
        };
        State.prototype.getAllPossibleStates = function () {
            var possibleStates = [];
            var availablePositions = this.board.getEmptyPositions();
            for (var _i = 0, availablePositions_1 = availablePositions; _i < availablePositions_1.length; _i++) {
                var x = availablePositions_1[_i];
                var newState = new State(this.board);
                newState.setPlayerNo(this.playerNo === 1 ? 2 : 1);
                newState.getBoard().insert(newState.getPlayerNo(), x);
                possibleStates.push(newState);
            }
            return possibleStates;
        };
        State.prototype.incrementVisit = function () {
            this.visitCount++;
        };
        State.prototype.addScore = function (score) {
            if (this.winScore !== Number.MIN_VALUE)
                this.winScore += score;
        };
        State.prototype.randomPlay = function () {
            var availablePositions = this.board.getEmptyPositions();
            var totalPossibilities = availablePositions.length;
            var x = availablePositions[Math.floor(Math.random() * totalPossibilities)];
            this.board.insert(this.playerNo, x);
        };
        State.prototype.togglePlayer = function () {
            this.playerNo = this.playerNo === 1 ? 2 : 1;
        };
        return State;
    }());
    exports.State = State;
});

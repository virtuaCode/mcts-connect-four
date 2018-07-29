define(["require", "exports", "./board", "./mcts"], function (require, exports, board_1, mcts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function () {
        function Game() {
            this.board = new board_1.Board();
            this.mcts = new mcts_1.MonteCarloTreeSearch();
        }
        Game.prototype.hasEnded = function () {
            return this.board.status() !== -1;
        };
        Game.prototype.move = function (pos) {
            this.board.insert(1, pos - 1);
        };
        Game.prototype.moveOpponent = function (level) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var worker = new Worker('./js/worker.js');
                worker.onerror = function (e) {
                    reject(e.message);
                    worker.terminate();
                };
                worker.onmessage = function (msg) {
                    if (msg.data.topic === 'ready') {
                        worker.postMessage({ columns: _this.board.columns, level: level });
                    }
                    else {
                        console.log('set columns');
                        _this.board.columns = msg.data;
                        resolve();
                        worker.terminate();
                    }
                };
            });
        };
        Game.prototype.getData = function () {
            var cols = [];
            for (var x = 0; x < board_1.WIDTH; x++) {
                var col = [];
                for (var y = 0; y < board_1.HEIGHT; y++) {
                    col.push(this.board.columns[x][y]);
                }
                cols.push(col);
            }
            return cols;
        };
        return Game;
    }());
    exports.Game = Game;
});

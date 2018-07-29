importScripts('../js/require.min.js');

require(["exports", "../bin/mcts", "../bin/board"], (exports, mcts_1, board_1) => {
    "use strict";
    var mcts = new mcts_1.MonteCarloTreeSearch();
    self.onmessage = function (e) {
        var result = mcts.findNextMove(new board_1.Board(e.data.columns), 2, e.data.level);
        self.postMessage(result.columns);
    };
    self.postMessage({topic: 'ready'});
});

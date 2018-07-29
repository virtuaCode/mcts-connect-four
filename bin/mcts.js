define(["require", "exports", "./tree", "./board", "./node", "./uct"], function (require, exports, tree_1, board_1, node_1, uct_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WIN_SCORE = 10;
    var MonteCarloTreeSearch = /** @class */ (function () {
        function MonteCarloTreeSearch() {
            this.opponent = 1;
        }
        MonteCarloTreeSearch.prototype.findNextMove = function (board, playerNo, level) {
            if (level === void 0) { level = 3; }
            var start = Date.now();
            var end = start + 60 * (2 * (level - 1) + 1);
            this.opponent = playerNo === 1 ? 2 : 1;
            var tree = new tree_1.Tree();
            var rootNode = tree.getRoot();
            rootNode.getState().setBoard(board);
            rootNode.getState().setPlayerNo(this.opponent);
            var iterations = 0;
            var maxIterations = (10 * (level - 1) + 1) * 10 * level;
            while (iterations < maxIterations) {
                // Phase 1 - Selection
                var promisingNode = this.selectPromisingNode(rootNode);
                // Phase 2 - Expansion
                if (promisingNode.getState().getBoard().status() === board_1.IN_PROGRESS) {
                    this.expandNode(promisingNode);
                }
                // Phase 3 - Simulation
                var nodeToExplore = promisingNode;
                if (promisingNode.getChildArray().length > 0) {
                    nodeToExplore = promisingNode.getRandomChildNode();
                }
                var playoutResult = this.simulateRandomPlayout(nodeToExplore);
                // Phase 4 - Update
                this.backPropogation(nodeToExplore, playoutResult);
                iterations++;
            }
            var winnerNode = rootNode.getChildWithMaxScore();
            if (winnerNode === null) {
                throw new Error('No winner Node');
            }
            tree.setRoot(winnerNode);
            return winnerNode.getState().getBoard();
        };
        MonteCarloTreeSearch.prototype.selectPromisingNode = function (rootNode) {
            var node = rootNode;
            while (node.getChildArray().length !== 0) {
                var nodeTemp = uct_1.findBestNodeWithUCT(node);
                if (nodeTemp === null) {
                    throw new Error('nodetemp is null');
                }
                node = nodeTemp;
            }
            return node;
        };
        MonteCarloTreeSearch.prototype.expandNode = function (node) {
            var possibleStates = node.getState().getAllPossibleStates();
            for (var _i = 0, possibleStates_1 = possibleStates; _i < possibleStates_1.length; _i++) {
                var state = possibleStates_1[_i];
                var newNode = new node_1.Node({ state: state });
                newNode.setParent(node);
                newNode.getState().setPlayerNo(node.getState().getOpponent());
                node.getChildArray().push(newNode);
            }
            ;
        };
        MonteCarloTreeSearch.prototype.backPropogation = function (nodeToExplore, playerNo) {
            var tempNode = nodeToExplore;
            while (tempNode !== null) {
                tempNode.getState().incrementVisit();
                if (tempNode.getState().getPlayerNo() === playerNo)
                    tempNode.getState().addScore(WIN_SCORE);
                tempNode = tempNode.getParent() || null;
            }
        };
        MonteCarloTreeSearch.prototype.simulateRandomPlayout = function (node) {
            var tempNode = new node_1.Node({ node: node });
            var tempState = tempNode.getState();
            var boardStatus = tempState.getBoard().status();
            if (boardStatus === this.opponent) {
                var parent_1 = tempNode.getParent();
                if (parent_1) {
                    parent_1.getState().setWinScore(Number.MIN_VALUE);
                }
                return boardStatus;
            }
            while (boardStatus === board_1.IN_PROGRESS) {
                tempState.togglePlayer();
                tempState.randomPlay();
                boardStatus = tempState.getBoard().status();
            }
            return boardStatus;
        };
        return MonteCarloTreeSearch;
    }());
    exports.MonteCarloTreeSearch = MonteCarloTreeSearch;
});

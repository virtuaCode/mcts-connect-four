import { Tree } from "./tree";
import { Board, IN_PROGRESS } from "./board";
import { Node } from "./node";
import { findBestNodeWithUCT } from './uct';

const WIN_SCORE = 10;

export class MonteCarloTreeSearch {
  private opponent: 1 | 2 = 1;

  constructor() { }


  findNextMove(board: Board, playerNo: 1 | 2, level = 3) {
    const start = Date.now();
    const end = start + 60 * (2 * (level - 1) + 1);

    this.opponent = playerNo === 1 ? 2 : 1;

    const tree = new Tree();
    const rootNode = tree.getRoot();

    rootNode.getState().setBoard(board);
    rootNode.getState().setPlayerNo(this.opponent);

    let iterations = 0;
    const maxIterations = (10 * (level - 1) + 1) * 10 * level;

    while (iterations < maxIterations) {
      // Phase 1 - Selection
      const promisingNode = this.selectPromisingNode(rootNode);

      // Phase 2 - Expansion
      if (promisingNode.getState().getBoard().status() === IN_PROGRESS) {
        this.expandNode(promisingNode);
      }

      // Phase 3 - Simulation
      let nodeToExplore = promisingNode;
      if (promisingNode.getChildArray().length > 0) {
        nodeToExplore = promisingNode.getRandomChildNode();
      }


      const playoutResult = this.simulateRandomPlayout(nodeToExplore);
      // Phase 4 - Update
      this.backPropogation(nodeToExplore, playoutResult);

      iterations++;
    }

    const winnerNode = rootNode.getChildWithMaxScore();

    if (winnerNode === null) {
      throw new Error('No winner Node');
    }

    tree.setRoot(winnerNode);

    return winnerNode.getState().getBoard();
  }

  selectPromisingNode(rootNode: Node) {
    let node = rootNode;
    while (node.getChildArray().length !== 0) {
      const nodeTemp = findBestNodeWithUCT(node);
      if (nodeTemp === null) {
        throw new Error('nodetemp is null')
      }

      node = nodeTemp;
    }
    return node;
  }

  expandNode(node: Node) {
    const possibleStates = node.getState().getAllPossibleStates();
    for (const state of possibleStates) {
      const newNode = new Node({ state });
      newNode.setParent(node);
      newNode.getState().setPlayerNo(node.getState().getOpponent());
      node.getChildArray().push(newNode);
    };
  }

  backPropogation(nodeToExplore: Node, playerNo: number) {
    let tempNode: Node | null = nodeToExplore;
    while (tempNode !== null) {
      tempNode.getState().incrementVisit();
      if (tempNode.getState().getPlayerNo() === playerNo)
        tempNode.getState().addScore(WIN_SCORE);
      tempNode = tempNode.getParent() || null;
    }
  }

  simulateRandomPlayout(node: Node) {
    const tempNode = new Node({ node });
    const tempState = tempNode.getState();
    let boardStatus = tempState.getBoard().status();

    if (boardStatus === this.opponent) {
      const parent = tempNode.getParent()
      if (parent) {
        parent.getState().setWinScore(Number.MIN_VALUE);
      }
      return boardStatus;
    }
    while (boardStatus === IN_PROGRESS) {
      tempState.togglePlayer();
      tempState.randomPlay();
      boardStatus = tempState.getBoard().status();
    }

    return boardStatus;
  }

}
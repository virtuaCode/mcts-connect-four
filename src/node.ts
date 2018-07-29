import { State } from "./state";

interface ParentInit {
  state: State;
  childArray: Node[];
  parent: Node;
}

interface NodeInit {
  node: Node;
}

interface StateInit {
  state: State;
}

function isNodeInit(obj: any): obj is NodeInit {
  return (obj && obj.node);
}

function isStateInit(obj: any): obj is StateInit {
  return (obj && obj.state);
}

function isParentInit(obj: any): obj is ParentInit {
  return (obj && obj.state && obj.childArray && obj.parent);
}

export class Node {
  private state = new State();
  private childArray: Node[] = [];
  private parent?: Node;

  constructor();
  constructor(init: ParentInit);
  constructor(init: NodeInit);
  constructor(init: StateInit);
  constructor(init?: ParentInit | NodeInit | StateInit) {

    if (isParentInit(init)) {
      this.state = init.state;
      this.childArray = init.childArray;
      this.parent = init.parent;
    } else if (isStateInit(init)) {
      this.state = init.state;
    } else if (isNodeInit(init)) {
      const node = init.node;
      this.state = new State(node.getState());

      if (node.getParent() !== null)
        this.parent = node.getParent();

      const childArray = node.getChildArray();
      for (const child of childArray) {
        this.childArray.push(new Node({ node: child }));
      }
    }
  }

  getState() {
    return this.state;
  }

  setState(state: State) {
    this.state = state;
  }

  getParent() {
    return this.parent;
  }

  setParent(parent: Node) {
    this.parent = parent;
  }

  getChildArray() {
    return this.childArray;
  }

  setChildArray(childArray: Node[]) {
    this.childArray = childArray;
  }

  getRandomChildNode() {
    const noOfPossibleMoves = this.childArray.length;
    const selectRandom = Math.floor(Math.random() * noOfPossibleMoves);
    return this.childArray[selectRandom] || null;
  }

  getChildWithMaxScore(): Node | null {
    return this.childArray.reduce((max: Node | null, e: Node | null) => {
      if (max === null || e === null) {
        return e;
      }

      if (max.getState().getVisitCount() < e.getState().getVisitCount()) {
        return e;
      } else {
        return max;
      }
    }, null);
  }
}
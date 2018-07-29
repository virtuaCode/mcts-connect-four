import { Node } from "./node";


export class Tree {
  root: Node;
  constructor(node?: Node) {
    this.root = node || new Node();
  }

  getRoot() {
    return this.root;
  }

  setRoot(node: Node) {
    this.root = node;
  }

  addChild(parent: Node, child: Node) {
    parent.getChildArray().push(child);
  }
}
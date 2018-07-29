define(["require", "exports", "./node"], function (require, exports, node_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tree = /** @class */ (function () {
        function Tree(node) {
            this.root = node || new node_1.Node();
        }
        Tree.prototype.getRoot = function () {
            return this.root;
        };
        Tree.prototype.setRoot = function (node) {
            this.root = node;
        };
        Tree.prototype.addChild = function (parent, child) {
            parent.getChildArray().push(child);
        };
        return Tree;
    }());
    exports.Tree = Tree;
});

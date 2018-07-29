define(["require", "exports", "./state"], function (require, exports, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isNodeInit(obj) {
        return (obj && obj.node);
    }
    function isStateInit(obj) {
        return (obj && obj.state);
    }
    function isParentInit(obj) {
        return (obj && obj.state && obj.childArray && obj.parent);
    }
    var Node = /** @class */ (function () {
        function Node(init) {
            this.state = new state_1.State();
            this.childArray = [];
            if (isParentInit(init)) {
                this.state = init.state;
                this.childArray = init.childArray;
                this.parent = init.parent;
            }
            else if (isStateInit(init)) {
                this.state = init.state;
            }
            else if (isNodeInit(init)) {
                var node = init.node;
                this.state = new state_1.State(node.getState());
                if (node.getParent() !== null)
                    this.parent = node.getParent();
                var childArray = node.getChildArray();
                for (var _i = 0, childArray_1 = childArray; _i < childArray_1.length; _i++) {
                    var child = childArray_1[_i];
                    this.childArray.push(new Node({ node: child }));
                }
            }
        }
        Node.prototype.getState = function () {
            return this.state;
        };
        Node.prototype.setState = function (state) {
            this.state = state;
        };
        Node.prototype.getParent = function () {
            return this.parent;
        };
        Node.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        Node.prototype.getChildArray = function () {
            return this.childArray;
        };
        Node.prototype.setChildArray = function (childArray) {
            this.childArray = childArray;
        };
        Node.prototype.getRandomChildNode = function () {
            var noOfPossibleMoves = this.childArray.length;
            var selectRandom = Math.floor(Math.random() * noOfPossibleMoves);
            return this.childArray[selectRandom] || null;
        };
        Node.prototype.getChildWithMaxScore = function () {
            return this.childArray.reduce(function (max, e) {
                if (max === null || e === null) {
                    return e;
                }
                if (max.getState().getVisitCount() < e.getState().getVisitCount()) {
                    return e;
                }
                else {
                    return max;
                }
            }, null);
        };
        return Node;
    }());
    exports.Node = Node;
});

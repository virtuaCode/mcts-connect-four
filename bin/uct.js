define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function findBestNodeWithUCT(node) {
        var parentVisit = node.getState().getVisitCount();
        var childUCT = [];
        // Find the UCT of each child of the Array
        node.getChildArray().forEach(function (child) {
            childUCT.push(uctValue(parentVisit, child.getState().getWinScore(), child.getState().getVisitCount()));
        });
        // Find the highest UCT value and index of value
        var max = Math.max.apply(Math, childUCT);
        var idx = childUCT.indexOf(max);
        return idx < 0 ? null : node.getChildArray()[idx];
    }
    exports.findBestNodeWithUCT = findBestNodeWithUCT;
    function uctValue(totalVisit, nodeWinScore, nodeVisit) {
        if (nodeVisit == 0) {
            return Number.MAX_VALUE;
        }
        return (nodeWinScore / nodeVisit) + 1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit);
    }
});

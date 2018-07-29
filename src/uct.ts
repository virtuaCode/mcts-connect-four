import {Node} from './node';

export function findBestNodeWithUCT(node: Node) {
  let parentVisit = node.getState().getVisitCount();
  let childUCT: number[] = [];

  // Find the UCT of each child of the Array
  node.getChildArray().forEach(child => {
    childUCT.push(uctValue(parentVisit, child.getState().getWinScore(), child.getState().getVisitCount()))
  })
  // Find the highest UCT value and index of value
  var max = Math.max(...childUCT);
  var idx = childUCT.indexOf(max);
  return idx < 0 ? null : node.getChildArray()[idx];

}

function uctValue(totalVisit: number, nodeWinScore: number, nodeVisit: number) {
  if (nodeVisit == 0) {
    return Number.MAX_VALUE;
  }
  return (nodeWinScore / nodeVisit) + 1.41 * Math.sqrt(Math.log(totalVisit) / nodeVisit);
}

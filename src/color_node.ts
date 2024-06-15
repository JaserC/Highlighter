import { ColorInfo } from './colors';


export type ColorNode =
    | {readonly kind: "empty"}
    | {readonly kind: "node", readonly info: ColorInfo,
       readonly before: ColorNode, readonly after: ColorNode};

/** The empty tree of colors. */
export const empty: {kind: "empty"} = {kind: "empty"};

/**
 * Returns a tree with info at the root, before in its left subtree, and after
 * in its right subtree. Note that node(c, A, B) has the following invariants:
 *  - every color a in A has a.name < c.name
 *  - every color b in B has c.name < b.name
 */
export const node =
    (info: ColorInfo, before: ColorNode, after: ColorNode): ColorNode => {
  // Do some minimal checking of the invariant.
  // We can't do the entire subtree in O(1) time.
  const [color, _css, _foreground] = info;

  if (before.kind !== "empty") {
    const [beforeColor, _css, _foreground] = before.info;
    if (color <= beforeColor) {
      throw new Error(`invariant violated: ${beforeColor} <= ${color}`);
    }
  }
  if (after.kind !== "empty") {
    const [afterColor, _css, _foreground] = after.info;
    if (afterColor <= color) {
      throw new Error(`invariant violated: ${afterColor} <= ${afterColor}`);
    }
  }

  return {kind: "node", info, before, after};
};

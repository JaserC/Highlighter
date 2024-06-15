import { List, split, len } from './list';
import { COLORS, ColorInfo } from './colors';
import { ColorNode, node, empty } from './color_node';
import { ColorList, findMatchingNamesIn } from './color_list';

// TODO: Uncomment and complete

/**
 * Returns a binary search tree created from a list 
 * @param L The list in question being turned into a binary search tree
 * @requires L to be a sorted list
 * @returns A node with details on its ColorInfo and potential children
 */
export const makeBst = (L: List<ColorInfo>): ColorNode => {
    if (L.kind === "nil"){
        return empty;
    }
    else{
        const [P, S] = split(BigInt(Math.floor(Number(len(L))/2)), L);
        if (S.kind != "nil"){
            return node(S.hd, makeBst(P), makeBst(S.tl));
        }
        else{
            return empty;
        }
    }
};


/**
 * Returns whether or not a color name is found in a binary search tree
 * @param y The color name being searched for
 * @param root A node of the binary search tree
 * @returns The node with the color name or undefined if not found
 */
export const lookup = (y: string, root: ColorNode): ColorInfo | undefined => {
  if(root.kind === "empty"){
    return undefined;
  }
  else{
    const [x] = root.info;
    if(x === y){
        return root.info;
    }
    else if(x < y){
        return lookup(y, root.after);
    }
    else{
        return lookup(y, root.before);
    }
  }
};

class ColorTree implements ColorList{
    // RI: this.colorTree = makeBst(this.colorList)
    // AF: obj = this.colorList
    readonly colorList: List<ColorInfo>;
    readonly colorTree: ColorNode;

    // Creates a color list and color tree of color options passed
    constructor(list: List<ColorInfo>){
        this.colorList = list;
        this.colorTree = makeBst(list);
    }

    findMatchingNames = (text: string) : List<string> => findMatchingNamesIn(text, this.colorList);
    getColorCss = (name: string) : readonly [string, string] => {
        const colorNode = lookup(name, this.colorTree);
        if (colorNode != undefined){
            const [, css, foreground] = colorNode;
            return [css, foreground ? '#F0F0F0' : '#101010'];  
        } 
        else{
            throw new Error(`no color called "${name}"`);
        }
    };
}

/**Instance of ColorList initialized with COLORS variable*/
const colorTree : ColorList = new ColorTree(COLORS);

/**
 * Adheres to the singleton pattern by returning the same instance of ColorList
 * @returns A single instance of the ColorList
 */
export const makeColorTree = () : ColorList => {
  return colorTree;
}
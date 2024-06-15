import { ColorInfo, COLORS } from './colors';
import { List, cons, nil } from './list';

// TODO: add interfaces and classes here

/**Refers to a list of color options for a user to choose from*/
export interface ColorList {
  /**
   * Returns a list of all color names that include the given text
   * @param text Text to look for in the names of the colors (case insensitive)
   * @returns list of all color names that include the given text
  */
  findMatchingNames: (text: string) => List<string>,

  /**
   * Returns the background and foreground CSS colors to highlight with this color.
   * @param name Name of the color to look for
   * @throws Error if there is no such color
   * @returns (bg, fg) where bg is the CSS background color and fg is foreground
  */
  getColorCss: (name: string) => readonly [string, string]
}

// Implementation of ColorList interface that provides it color options to store in a list
class SimpleColorList implements ColorList{
  // RI: colors is a sorted list
  // AF: obj = this.colors
  readonly colors: List<ColorInfo>;

  // Creates a color list based on the color options passed
  constructor(list: List<ColorInfo>){
    this.colors = list;
  }

  findMatchingNames = (text: string) : List<string> => findMatchingNamesIn(text, this.colors);
  getColorCss = (name: string) : readonly [string, string] => getColorCssIn(name, this.colors);
}

/**Instance of ColorList initialized with COLORS variable*/
const colorList : ColorList = new SimpleColorList(COLORS);

/**
 * Adheres to the singleton pattern by returning the same instance of ColorList
 * @returns A single instance of the ColorList
 */
export const makeSimpleColorList = () : ColorList => {
  return colorList;
}


/**
 * Returns a new list containing just the names of those colors that include the given text
 * @param text The text in question
 * @param colors The full list of colors
 * @returns The sublist of colors containing those colors whose names contain
 */
export const findMatchingNamesIn =
    (text: string, colors: List<ColorInfo>): List<string> => {
  if (colors.kind === "nil") {
    return nil;
  } else {
    // Note: the _ keeps the typechecker from complaining about our not using
    // these variables (but we must defining them to avoid tuple indexing)
    const [color, _css, _foreground] = colors.hd;
    if (color.includes(text)) {
      return cons(color, findMatchingNamesIn(text, colors.tl));
    } else {
      return findMatchingNamesIn(text, colors.tl);
    }
  }
};

/**
 * Returns the colors from the (first) list entry with this color name. Throws
 * an Error none is found (i.e., we hit the end of the list).
 * @param name The name in question.
 * @param colors The full list of colors.
 * @throws Error if no item in colors has the given name
 * @return The first item in colors whose name matches the given name.
 */
const getColorCssIn =
    (name: string, colors: List<ColorInfo>): readonly [string, string] => {
  if (colors.kind === "nil") {
    throw new Error(`no color called "${name}"`);
  } else {
    const [color, css, foreground] = colors.hd;
    if (color === name) {
      return [css, foreground ? '#F0F0F0' : '#101010'];
    } else {
      return getColorCssIn(name, colors.tl);
    }
  }
};

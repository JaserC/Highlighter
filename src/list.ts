export type List<A> =
    | {readonly kind: "nil"}
    | {readonly kind: "cons", readonly hd: A, readonly tl: List<A>};


/** The empty list. */
export const nil: {kind: "nil"} = {kind: "nil"};

/** Returns a list with hd in front of tl. */
export const cons = <A,>(hd: A, tl: List<A>): List<A> => {
  return {kind: "cons", hd: hd, tl: tl};
};


/** Returns the length of the given list. */
export const len = <A,>(L: List<A>): bigint => {
  if (L.kind === "nil") {
    return 0n;
  } else {
    return 1n + len(L.tl);
  }
};

/**
 * Returns the pair of lists you get by splitting L into its first n elements
 * and the rest of the list after that.
 * @param n number of elements before th split
 * @param L list to split
 * @requires n <= len(L) 
 * @returns (P, S) such that L = concat(P, S), len(P) = n, and len(S) = len(L)-n
 */
export const split =
    <A,>(n: bigint, L: List<A>): readonly [List<A>, List<A>] => {
  if (n === 0n) {
    return [nil, L];
  } else if (L.kind === "nil") {
    throw new Error(`list does not contain ${n} elements`);
  } else {
    const [P, S] = split(n - 1n, L.tl);
    return [cons(L.hd, P), S];
  }
};

/**
 * Returns the pair of lists you get by splitting L at the spot where the first
 * c appears. That value is returned as the first element in the right list.
 * @param c value to split
 * @param L list to split
 * @returns (P, S) such that L = concat(P, S), c is not in P, and
 *     either S = nil or head(S) = c
 */
export const split_at = <A,>(L: List<A>, c: A): [List<A>, List<A>] => {
  if (L.kind === "nil") {
    return [nil, nil];
  } else if (L.hd === c) {
    return [nil, L];
  } else {
    // L = cons(a, T)
    const [P, S] = split_at(L.tl, c);
    // T = concat(P, S) and either S = nil or S.hd = c and c not in P
    // > L = cons(a, T) = cons(a, concat(P, S)) = concat(cons(a, P), S)
    // > c != a => c not in cons(a, P)
    return [cons(L.hd, P), S];
  }
};

/**
 * Returns the elements of a list, packed into an array.
 * @param L the list to turn into an array
 * @returns array containing the same elements as in L in the same order
 */
export const compact_list = <A,>(L: List<A>): Array<A> => {
  if (L.kind === "nil") {
    return [];
  } else {
    return [L.hd].concat(compact_list(L.tl));  // NOTE: O(n^2)
  }
};

/**
 * Returns the elements in the given array as a list.
 * @param arr the array to turn into a list
 * @returns list containing the same elements as in arr in the same order
 */
export const explode_array = <A,>(arr: ReadonlyArray<A>): List<A> => {
  if (arr.length === 0) {
    return nil;
  } else {
    return cons(arr[0], explode_array(arr.slice(1)));  // NOTE: O(n^2)
  }
};

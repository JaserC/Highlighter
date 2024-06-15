import * as assert from 'assert';
import { empty, node } from './color_node';
import { lookup, makeBst, makeColorTree } from './color_tree';
import { cons, explode_array, nil } from './list';

describe('color_tree', function() {

    // TODO: Uncomment given examples and add more test cases in 3
    const colorTree = makeColorTree();

    it('make_bst', function() {

        //ZERO-ONE-MANY HEURISTIC
        //At least 2 tests per recursive subdomain

        //ZERO SUBDOMAIN
        assert.deepEqual(makeBst(nil), empty); //Only input that yields 0 calls
        
        //ONE SUBDOMAIN (at least 2 tests)
        assert.deepEqual(makeBst(explode_array([
            ['Blue', '#0000FF', true],
          ])), node(['Blue', '#0000FF', true], empty, empty)); //Tests depth 1, 1 recursive call for both branches
        assert.deepEqual(makeBst(explode_array([
            ['Snow', '#FFFAFA', false],
          ])), node(['Snow', '#FFFAFA', false], empty, empty)); //Tests depth 1, 1 recursive call for both branches

        //MANY SUBDOMAIN 
        //(at least 2 tests per subdomain & must accound for both branches depth individually)
        assert.deepEqual(makeBst(explode_array([
            ['Blue', '#0000FF', true], ['Red', '#FF0000', true]
            ])), node(['Red', '#FF0000', true], makeBst(explode_array([['Blue', '#0000FF', true]])), empty)); //2 recursive calls on left branch, 1 on right
        assert.deepEqual(makeBst(explode_array([
            ['Green', '#008000', true], ['Yellow', '#FFFF00', false]
            ])), node(['Yellow', '#FFFF00', false], makeBst(explode_array([['Green', '#008000', true]])), empty)); //2 recursive calls on left branch, 1 on right
        assert.deepEqual(makeBst(explode_array([
            ['Green', '#008000', true], ['Red', '#FF0000', true], ['Yellow', '#FFFF00', false] 
            ])), node(['Red', '#FF0000', true], makeBst(explode_array([['Green', '#008000', true]])), makeBst(explode_array([['Yellow', '#FFFF00', false]])))); //2 recursive calls on left branch, 2 on right
        assert.deepEqual(makeBst(explode_array([
            ['Blue', '#0000FF', true], ['Red', '#FF0000', true], ['Snow', '#FFFAFA', true] 
            ])), node(['Red', '#FF0000', true], makeBst(explode_array([['Blue', '#0000FF', true]])), makeBst(explode_array([['Snow', '#FFFAFA', true]])))); ///2 recursive calls on left branch, 2 on right
    });

    //shame on you guys for making me do all this testing
    //Instead of putting all color arrays in a makeBst call, I initialized the tree myself so it's easier to visualize the testing chain
    it('lookup', function() {
        //ZERO-ONE-MANY HEURISTIC

        //ZERO SUBDOMAIN (0 recursive calls)
        //(at least 2 tests per)
        assert.deepEqual(lookup('Purple', 
            empty), 
            undefined); //first base case: empty node
        assert.deepEqual(lookup('Turquoise', 
            empty), 
            undefined); //first base case: empty node
        assert.deepEqual(lookup('Blue', 
            node(['Blue', '#0000FF', true], empty, empty)), 
            ['Blue', '#0000FF', true]); //second base case: found in first node
        assert.deepEqual(lookup('Yellow', 
            node(['Yellow', '#FFFF00', false], empty, empty)), 
            ['Yellow', '#FFFF00', false]); //second base case: found in first node


        //ONE SUBDOMAIN (1 recursive call)

        assert.deepEqual(lookup('Yellow', 
            node(['Blue', '#0000FF', true], empty, empty)), 
            undefined); //1st recursive case (Look in right branch), 1st base case (not found)
        assert.deepEqual(lookup('Yellow', 
            node(['Blue', '#0000FF', true], empty, makeBst(explode_array([['Yellow', '#FFFF00', false]])))), 
            ['Yellow', '#FFFF00', false]); //1st recursive case, 2nd base case (found)

        assert.deepEqual(lookup('Blue', 
            node(['Red', '#FF0000', true], empty, empty)), 
            undefined); //2nd recursive case (look in left branch), 1st base case(not found)
        assert.deepEqual(lookup('Blue', 
            node(['Red', '#FF0000', true], makeBst(explode_array([['Blue', '#0000FF', true]])), empty)), 
            ['Blue', '#0000FF', true]); //2nd recursive case (look in left branch), 2nd base case(found)

        //MANY SUBDOMAIN (2+ recursive calls)

        //Left branch lookups
        assert.deepEqual(lookup('Blue', 
            node(['Red', '#FF0000', true], node(['Green', '#008000', true], makeBst(explode_array([['Blue', '#0000FF', true]])), empty), empty)), 
            ['Blue', '#0000FF', true]); //Boundary case: 2 recursive calls (2nd base case - found)
        assert.deepEqual(lookup('Indigo', 
            node(['Red', '#FF0000', true], node(['Green', '#008000', true], makeBst(explode_array([['Blue', '#0000FF', true]])), empty), empty)), 
            undefined); //Boundary case: 2 recursive calls (1st base case - not found)

        assert.deepEqual(lookup('Indigo', 
            node(['Red', '#FF0000', true], node(['Green', '#008000', true], empty, makeBst(explode_array([['Indigo', '#4B0082', true]]))), empty)), 
            ['Indigo', '#4B0082', true]); //Boundary case: 2 recursive calls (2nd base case - found)
        assert.deepEqual(lookup('Blue', 
            node(['Red', '#FF0000', true], node(['Green', '#008000', true], empty, makeBst(explode_array([['Indigo', '#4B0082', true]]))), empty)), 
            undefined); //Boundary case: 2 recursive calls (1st base case - not found)

        //Right branch lookups
        assert.deepEqual(lookup('Yellow', 
            node(['Red', '#FF0000', true], empty, node(['White', '#FFFFFF', false], empty, makeBst(explode_array([['Yellow', '#FFFF00', false]]))))), 
            ['Yellow', '#FFFF00', false]); //Boundary case: 2 recursive calls (2nd base case - found)
        assert.deepEqual(lookup('Silver', 
            node(['Red', '#FF0000', true], empty, node(['White', '#FFFFFF', false], empty, makeBst(explode_array([['Yellow', '#FFFF00', false]]))))), 
            undefined); //Boundary case: 2 recursive calls (1st base case - not found)

        assert.deepEqual(lookup('Silver', 
            node(['Red', '#FF0000', true], empty, node(['White', '#FFFFFF', false], makeBst(explode_array([['Silver', '#C0C0C0', false]])), empty))), 
            ['Silver', '#C0C0C0', false]); //Boundary case: 2 recursive calls (2nd base case - found)
        assert.deepEqual(lookup('Yellowgreen', 
            node(['Red', '#FF0000', true], empty, node(['White', '#FFFFFF', false], makeBst(explode_array([['Silver', '#C0C0C0', false]])), empty))), 
            undefined); //Boundary case: 2 recursive calls (1st base case - not found)

        assert.deepEqual(lookup('Blue', 
            node(['Red', '#FF0000', true], node(['Green', '#008000', true], makeBst(explode_array([['Blue', '#0000FF', true],['Coral', '#FF7F50', true]])), empty), empty)), 
            ['Blue', '#0000FF', true]); //4 recursive calls (2nd base case - found)

    });

    it('findMatchingNames', function() {
        assert.deepEqual(colorTree.findMatchingNames("doesnotexist"), nil);
        assert.deepEqual(colorTree.findMatchingNames("notacolor"), nil);
        assert.deepEqual(colorTree.findMatchingNames("indigo"), cons("indigo", nil));
        assert.deepEqual(colorTree.findMatchingNames("azure"), cons("azure", nil));
        assert.deepEqual(colorTree.findMatchingNames("lavender"),
            cons("lavender", cons("lavenderblush", nil)));
        assert.deepEqual(colorTree.findMatchingNames("pink"),
            cons("deeppink", cons("hotpink", cons("lightpink", cons("pink", nil)))));
      });
    
    it('getColorCss', function() {
        assert.deepEqual(colorTree.getColorCss("lavender"), ['#E6E6FA', '#101010']);
        assert.deepEqual(colorTree.getColorCss("indigo"), ['#4B0082', '#F0F0F0']);
    });
});
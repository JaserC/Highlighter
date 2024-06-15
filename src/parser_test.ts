import * as assert from 'assert';
import { explode } from './char_list';
import { explode_array, nil } from './list';
import { findHighlights, getNextHighlight, parseHighlightLines, parseHighlightText } from './parser';


describe('parser', function() {

  it('parseHighlightLines', function() {
    assert.deepEqual(parseHighlightLines(""), explode_array([]));
    assert.deepEqual(
      parseHighlightLines("Red hi there"),
      explode_array([
        {color: 'red', text: 'hi there'},
      ]));
    assert.deepEqual(
      parseHighlightLines("Red hi there\nGreen more text"),
      explode_array([
        {color: 'red', text: 'hi there'},
        {color: 'green', text: 'more text'},
      ]));
    assert.deepEqual(
      parseHighlightLines("Red hi there\nGreen more text\nBlue really? more?"),
      explode_array([
        {color: 'red', text: 'hi there'},
        {color: 'green', text: 'more text'},
        {color: 'blue', text: 'really? more?'},
      ]));
  });

  it('getNextHighlight', function() {
    // first branch
    assert.strictEqual(getNextHighlight(explode("")), undefined);

    // second branch
    assert.strictEqual(getNextHighlight(explode("ab")), undefined);
    assert.strictEqual(getNextHighlight(explode("abc")), undefined);

    // third branch
    assert.strictEqual(getNextHighlight(explode("ab[red")), undefined);
    assert.strictEqual(getNextHighlight(explode("[red")), undefined);

    // fourth branch
    assert.strictEqual(getNextHighlight(explode("abc[red|")), undefined);
    assert.strictEqual(getNextHighlight(explode("abc[red|def")), undefined);

    // fifth branch
    assert.deepStrictEqual(getNextHighlight(explode("my [red|ball] is great")),
        ["my ", {color: "red", text: "ball"}, explode(" is great")]);
    assert.deepStrictEqual(getNextHighlight(explode("grass is [green|itchy]")),
        ["grass is ", {color: "green", text: "itchy"}, explode("")]);
  });

  //shame on you guys for making me do all this testing
  it('findHighlights', function() {

    //ZERO-ONE-MANY HEURISTIC 
    //2 tests per recursive subdomain

    //ZERO SUBDOMAIN (no highlights)
    //At least 2 tests
    assert.deepStrictEqual(findHighlights(explode("")), nil); //Base case: nil

    assert.deepStrictEqual(findHighlights(explode("the world is falling")), //Base case: no highlights
      explode_array([{color: 'white', text: 'the world is falling'}]));
    assert.deepStrictEqual(findHighlights(explode("this life is parc")), //Base case: no highlights
      explode_array([{color: 'white', text: 'this life is parc'}]));

    //ONE SUBDOMAIN (1 highlight)
    //At least 2 tests
    assert.deepStrictEqual(findHighlights(explode("[blue| skies]are clear")),
      explode_array([{color: 'blue', text: ' skies'},{color:'white', text:'are clear'}])); //1st recursive case, 1st base case
    assert.deepStrictEqual(findHighlights(explode("[blue| skies]are pleasant")),
      explode_array([{color: 'blue', text: ' skies'},{color:'white', text:'are pleasant'}])); //1st recursive case, 1st base case
    assert.deepStrictEqual(findHighlights(explode("[blue| skies]")), //1st recursive case, 2nd base case
      explode_array([{color: 'blue', text: ' skies'}]));
    assert.deepStrictEqual(findHighlights(explode("[grey| clouds are cool]")), //1st recursive case, 2nd base case
      explode_array([{color: 'grey', text: ' clouds are cool'}]));
    
    assert.deepStrictEqual(findHighlights(explode("my [red|eyes are bleeding]")),
      explode_array([{color: 'white', text: 'my '},{color:'red', text:'eyes are bleeding'}])); //2nd recursive case, 1st base case
    assert.deepStrictEqual(findHighlights(explode("my [white|eyes are clear]")),
      explode_array([{color: 'white', text: 'my '},{color:'white', text:'eyes are clear'}])); //2nd recursive case, 1st base case
    assert.deepStrictEqual(findHighlights(explode("my [red|eyes are bleeding] but its fine")),
      explode_array([{color: 'white', text: 'my '},{color:'red', text:'eyes are bleeding'},{color:'white', text:' but its fine'}])); //2nd recursive case, 2nd base case
    assert.deepStrictEqual(findHighlights(explode("my [red|eyes are bleeding] and im dying")),
      explode_array([{color: 'white', text: 'my '},{color:'red', text:'eyes are bleeding'},{color:'white', text:' and im dying'}])); //2nd recursive case, 2nd base case
    
    
    //MANY SUBDOMAIN (2+ highlights)
    //At least 2 tests
    assert.deepStrictEqual(findHighlights(explode("The [grey|clouds] are [grey|heavy]")),
      explode_array([{color:'white', text:'The '},{color:'grey', text:'clouds'},{color:'white', text:' are '},{color:'grey', text:'heavy'}])); //Boundary Case: 2 calls
    assert.deepStrictEqual(findHighlights(explode("The [grey|clouds][grey|heavy]")),
      explode_array([{color:'white', text:'The '},{color:'grey', text:'clouds'},{color:'grey', text:'heavy'}])); //Boundary Case: 2 calls
    
    assert.deepStrictEqual(findHighlights(explode("The [grey|clouds] are [grey|heavy] apparently")),
      explode_array([{color:'white', text:'The '},{color:'grey', text:'clouds'},{color:'white', text:' are '},{color:'grey', text:'heavy'},{color:'white', text:' apparently'}])); //Boundary Case: 2 calls
    assert.deepStrictEqual(findHighlights(explode("The [grey|clouds][grey|heavy] apparently")),
      explode_array([{color:'white', text:'The '},{color:'grey', text:'clouds'},{color:'grey', text:'heavy'},{color:'white', text:' apparently'}])); //Boundary Case: 2 calls
    
    assert.deepStrictEqual(findHighlights(explode("[grey|clouds] are [grey|heavy] apparently")),
      explode_array([{color:'grey', text:'clouds'},{color:'white', text:' are '},{color:'grey', text:'heavy'},{color:'white', text:' apparently'}])); //Boundary Case: 2 calls
    assert.deepStrictEqual(findHighlights(explode("[grey|clouds][grey|heavy] apparently")),
      explode_array([{color:'grey', text:'clouds'},{color:'grey', text:'heavy'},{color:'white', text:' apparently'}])); //Boundary Case: 2 calls
    
    assert.deepStrictEqual(findHighlights(explode("[grey|clouds] are [grey|heavy]")),
      explode_array([{color:'grey', text:'clouds'},{color:'white', text:' are '},{color:'grey', text:'heavy'}])); //Boundary Case: 2 calls
    assert.deepStrictEqual(findHighlights(explode("[grey|clouds][grey|heavy]")),
      explode_array([{color:'grey', text:'clouds'},{color:'grey', text:'heavy'}])); //Boundary Case: 2 calls

    assert.deepStrictEqual(findHighlights(explode("My [black|black] and [white|white] zebra [blue|cries] loudly")),
      explode_array([{color:'white', text:'My '},{color:'black', text:'black'},{color:'white', text:' and '},{color:'white', text:'white'}, {color:'white', text:' zebra '}, {color:'blue', text:'cries'}, {color:'white', text:' loudly'}])); //3 calls
    assert.deepStrictEqual(findHighlights(explode("[black|black] and [white|white] zebra [blue|cries] loudly")),
      explode_array([{color:'black', text:'black'},{color:'white', text:' and '},{color:'white', text:'white'}, {color:'white', text:' zebra '}, {color:'blue', text:'cries'}, {color:'white', text:' loudly'}])); //3 calls
    assert.deepStrictEqual(findHighlights(explode("[black|black][white|white] zebra [blue|cries] loudly")),
      explode_array([{color:'black', text:'black'}, {color:'white', text:'white'}, {color:'white', text:' zebra '}, {color:'blue', text:'cries'}, {color:'white', text:' loudly'}])); //3 calls
    assert.deepStrictEqual(findHighlights(explode("[black|black][white|white][blue|cries] loudly")),
      explode_array([{color:'black', text:'black'}, {color:'white', text:'white'}, {color:'blue', text:'cries'}, {color:'white', text:' loudly'}])); //3 calls
    assert.deepStrictEqual(findHighlights(explode("[black|black][white|white][blue|cries]")),
      explode_array([{color:'black', text:'black'}, {color:'white', text:'white'}, {color:'blue', text:'cries'}])); //3 calls

    assert.deepStrictEqual(findHighlights(explode("[blue|I][green|am][red|almost][purple|done]")),
      explode_array([{color:'blue', text:'I'}, {color:'green', text:'am'}, {color:'red', text:'almost'}, {color:'purple', text:'done'}])); //4 calls
    

    //Extra case      
    assert.deepStrictEqual(findHighlights(explode("The [red|r][orange|a][yellow|i][green|n][blue|b][indigo|o][violet|w]")),
      explode_array([{color:'white', text:'The '},{color:'red', text:'r'},{color:'orange', text:'a'},{color:'yellow', text:'i'},{color:'green', text:'n'},{color:'blue', text:'b'},{color:'indigo', text:'o'},{color:'violet', text:'w'}]));
    
  });

  
  it('parseHighlightText', function() {
    assert.deepEqual(parseHighlightText(""), explode_array([]));
    assert.deepEqual(
      parseHighlightText("my [red|favorite] book"),
      explode_array([
        {color: 'white', text: 'my '},
        {color: 'red', text: 'favorite'},
        {color: 'white', text: ' book'},
      ]));
  });

});

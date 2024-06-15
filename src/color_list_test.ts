import * as assert from 'assert';
import { nil, cons } from './list';
import { makeSimpleColorList } from './color_list';


describe('color_list', function() {

  // TODO: create an instance of ColorList with makeSimpleColorList to use below for 1e
  const colorList = makeSimpleColorList();

  it('findMatchingNames', function() {
    assert.deepEqual(colorList.findMatchingNames("doesnotexist"), nil);
    assert.deepEqual(colorList.findMatchingNames("notacolor"), nil);
    assert.deepEqual(colorList.findMatchingNames("indigo"), cons("indigo", nil));
    assert.deepEqual(colorList.findMatchingNames("azure"), cons("azure", nil));
    assert.deepEqual(colorList.findMatchingNames("lavender"),
        cons("lavender", cons("lavenderblush", nil)));
    assert.deepEqual(colorList.findMatchingNames("pink"),
        cons("deeppink", cons("hotpink", cons("lightpink", cons("pink", nil)))));
  });

  it('getColorCss', function() {
    assert.deepEqual(colorList.getColorCss("lavender"), ['#E6E6FA', '#101010']);
    assert.deepEqual(colorList.getColorCss("indigo"), ['#4B0082', '#F0F0F0']);
  });
});
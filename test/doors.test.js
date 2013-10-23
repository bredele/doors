var Doors = require('doors');

var assert = require('assert');
var contains = require('contains');




describe('Constructor', function(){
  it("should initalize a door with a name", function() {
    var door = new Doors('bredele');
    assert(door.name === 'bredele');
  });
});

describe("Add lock", function() {
  it("should add lock", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    assert(contains(door.locks, 'olivier') === true);
  });
  
});

var Doors = require('doors');

var assert = require('assert');
var contains = require('contains');
var count = require('count');




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
  
  it("should not add a lock twice", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    door.add('olivier');
    assert(count(door.locks, 'olivier') === 1);
  });
  
});

describe("Unlock", function() {
  it("should unlock a lock previously added", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    door.unlock('olivier');
    assert(contains(door.locks, 'olivier') === false);
  });
});
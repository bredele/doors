var Doors = require('doors');

var assert = require('assert');
var contains = require('contains');
var count = require('count');
var has = function(obj, key) {
  return !!obj[key];
};

describe('Constructor', function(){
  it("should initalize a door with a name", function() {
    var door = new Doors('bredele');
    assert(door.name === 'bredele');
  });

  it('should initialize a door with a name and an array of locks', function() {
    var door = new Doors('bredele', ['olivier', 'amy']);
    assert(contains(door.keys, 'olivier') === true);
    assert(contains(door.keys, 'amy') === true);
  });
});


describe("Add lock", function() {
  it("should add lock which is locked by default", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    assert(contains(door.keys, 'olivier') === true);
  });
  
  it("should not add a lock twice", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    door.add('olivier');
    assert(count(door.keys, 'olivier') === 1);
  });
  
});


describe('has locked lock', function(){
  it("returns true if door contains locked lock", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    assert(door.has('olivier') === true);
  });
});


describe("Unlock", function() {
  var door = null;
  beforeEach(function() {
    door = new Doors('bredele');
    door.add('olivier');
  });
  
  it("should unlock a lock previously added", function() {
    door.unlock('olivier');
    assert(contains(door.keys, 'olivier') === false);
  });

  it('should unlock multiple locks', function() {
    door.add('amy');
    door.unlock('olivier', 'amy');
    assert(contains(door.keys, 'olivier') === false);
    assert(contains(door.keys, 'amy') === false);
  });

  it('should unlock the entire door if no arguments are passed', function() {
    door.add('amy');
    door.unlock();
    assert(contains(door.keys, 'olivier') === false);
    assert(contains(door.keys, 'amy') === false);
  });

  it('should emit an open event if the every locks are unlocked', function() {
    var isOpen = false;
    door.add('amy');
    door.on('open', function() {
      isOpen = true;
    });
    door.unlock();
    assert(isOpen === true);
  });

  it('should not unlock an unknown lock', function() {
    door.add('amy');
    door.unlock('bruno');
    assert(contains(door.keys, 'olivier') === true);
    assert(contains(door.keys, 'amy') === true);
  });

});


describe("Lock", function() {
  var door = null;
  beforeEach(function() {
    door = new Doors('bredele');
    door.add('olivier');
    door.add('amy');
  });

  it("should lock a lock previously added", function() {
    assert(contains(door.keys, 'olivier') === true);
  });

  it('should lock a lock previously unlocked', function() {
    door.unlock('olivier');
    assert(contains(door.keys, 'olivier') === false);
    door.lock('olivier');
    assert(contains(door.keys, 'olivier') === true);
  });

  it('should lock multiple locks', function() {
    door.unlock('olivier');
    door.unlock('amy');
    door.lock('olivier', 'amy');
    assert(contains(door.keys, 'olivier') === true);
    assert(contains(door.keys, 'amy') === true);
  });

  it('should lock the entire door if no arguments', function() {
    door.unlock('olivier');
    door.unlock('amy');
    door.lock();
    assert(contains(door.keys, 'olivier') === true);
    assert(contains(door.keys, 'amy') === true);
  });
});


describe("Toggle Lock", function() {
  it("unlocks if second argument if truthy", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    door.toggle('olivier', true);
    assert(contains(door.keys, 'olivier') === false);
  });
  it("locks if second argument if falsy", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    door.unlock('olivier');
    door.toggle('olivier', false);
    assert(contains(door.keys, 'olivier') === true);
  });
});


describe("Open", function() {
  it("returns true if door is open", function() {
    var door = new Doors('bredele');
    door.add('olivier');
    assert(door.open() === false);
    door.unlock('olivier');
    assert(door.open() === true);
  });
});


describe("Door inception", function() {
  var door = null;
  beforeEach(function() {
    door = new Doors('bredele');
  });

  it("should add a door", function() {
    var lock = new Doors('github');
    door.add(lock);
    assert(door.has('github') === true);
  });

  it("should unlock child door if unlocked from parent door", function() {
    var isOpen = false;
    var lock = new Doors('lock1');
    lock.add('olivier');
    door.add(lock);
    lock.on('open', function() {
      isOpen = true;
    });
    door.unlock('lock1');
    assert(isOpen === true);

  });

  it('shoud unlock child in parent if child is openned', function() {
    var lock = new Doors('lock2');
    lock.add('olivier');
    door.add(lock);
    lock.unlock();
    assert(door.has('lock2') === false);
  });

  // it("should lock child door if locked from parent door", function() {
  //   var lock = new Doors('github');
  //   door.add(lock);
  //   door.unlock('github');
  //   lock.add('olivier');
  //   lock.unlock();
  //   debugger
  //   door.lock('github');
  //   assert(lock.has('olivier') === true);

  // });
  
});

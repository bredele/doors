/**
 * Dependencies.
 */

var test = require('tape')
var doors = require('..')

test('should have the following API', assert => {
  assert.plan(4)
  var door = doors()
  assert.equal(typeof door, 'object')
  assert.equal(typeof door.promise, 'function')
  assert.equal(typeof door.lock, 'function')
  assert.equal(typeof door.unlock, 'function')
})

test('should be an event emitter', assert => {
  assert.plan(3)
  var door = doors()
  assert.equal(typeof door.on, 'function')
  assert.equal(typeof door.emit, 'function')
  assert.equal(typeof door.once, 'function')
})

test('should add lock and resolve promise only once when unlocked', assert => {
  assert.plan(1)
  var door = doors()
  door.lock('hello')
  door.promise('hello').then(() => assert.ok('hello'))
  door.unlock('hello')
})

//test('should resolve only once')

test('should add locks and resolve promise only once all the locks are unlocked', assert => {
  assert.plan(1)
  var door = doors()
  door.lock('hello')
  door.lock('world')
  door.promise('hello world').then(() => assert.ok('hello'))
  door.unlock('hello')
  door.unlock('world')
})

test('should remove all spaces from promise and resolve it when given locks are unlocked', assert => {
  assert.plan(1)
  var door = doors()
  door.lock('hello')
  door.lock('world')
  door.promise('  world    hello').then(() => assert.ok('hello'))
  door.unlock('hello')
  door.unlock('world')
})


test('should resolve promise when door is open', assert => {
  assert.plan(1)
  var door = doors()
  door.lock('hello')
  door.lock('world')
  door.promise().then(() => assert.ok('hello'))
  door.unlock('hello')
  door.unlock('world')
})

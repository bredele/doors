/**
 * Dependencies.
 */

var test = require('tape')
var doors = require('..')

test('should have the following API', assert => {
  assert.plan(5)
  var door = doors()
  assert.equal(typeof door, 'object')
  assert.equal(typeof door.promise, 'function')
  assert.equal(typeof door.lock, 'function')
  assert.equal(typeof door.unlock, 'function')
  assert.equal(typeof door.knock, 'function')
})

test('should be an event emitter', assert => {
  assert.plan(3)
  var door = doors()
  assert.equal(typeof door.on, 'function')
  assert.equal(typeof door.emit, 'function')
  assert.equal(typeof door.once, 'function')
})

test('open and knock', assert => {
  assert.plan(1)
  var door = doors()
  assert.equal(door.knock(), true)
})

test('close and knock', assert => {
  assert.plan(1)
  var door = doors()
  door.lock('hello')
  assert.equal(door.knock(), false)
})

test('add locks and knock', assert => {
  assert.plan(2)
  var door = doors()
  door.lock('hello')
  door.lock('world')
  door.unlock('hello')
  assert.equal(door.knock(), false)
  door.unlock('world')
  assert.equal(door.knock(), true)
})

test('knock lock', assert => {
  assert.plan(2)
  var door = doors()
  assert.equal(door.knock('world'), true)
  door.lock('world')
  assert.equal(door.knock('world'), false)
})

test('add multiple locks and knock', assert => {
  assert.plan(2)
  var door = doors()
  door.lock('hello world')
  door.unlock('hello')
  assert.equal(door.knock(), false)
  door.unlock('world')
  assert.equal(door.knock(), true)
})

test('remove locks and knock', assert => {
  assert.plan(2)
  var door = doors()
  door.lock('hello world foo')
  door.unlock('hello')
  assert.equal(door.knock(), false)
  door.unlock('foo world')
  assert.equal(door.knock(), true)
})

test('locks and knock locks', assert => {
  assert.plan(6)
  var door = doors()
  door.lock('world hello')
  assert.equal(door.knock('hello'), false)
  assert.equal(door.knock('world'), false)
  assert.equal(door.knock('hello world'), false)
  door.unlock('hello world')
  assert.equal(door.knock('hello world'), true)
  assert.equal(door.knock('hello'), true)
  assert.equal(door.knock('world'), true)
})

test('lock from constructor and knock lock', assert => {
  assert.plan(1)
  var door = doors('hello')
  assert.equal(door.knock('hello'), false)
})

test('lock from constructor and knock', assert => {
  assert.plan(1)
  var door = doors('hello')
  assert.equal(door.knock(), false)
})

test('add locks from constructor and knock lock', assert => {
  assert.plan(2)
  var door = doors('hello world')
  assert.equal(door.knock('world'), false)
  assert.equal(door.knock('hello'), false)
})

test('add locks from constructor and knock locks', assert => {
  assert.plan(3)
  var door = doors('hello world foo')
  assert.equal(door.knock('world hello'), false)
  door.unlock('hello world')
  assert.equal(door.knock('hello world'), true)
  assert.equal(door.knock('hello foo'), false)
})

test('lock, unlock and knock', assert => {
  assert.plan(5)
  var door = doors('hello world foo')
  door.lock('beep')
  door.lock('boo canada')
  assert.equal(door.knock('boo'), false)
  assert.equal(door.knock('beep canada'), false)
  door.unlock('world canada')
  assert.equal(door.knock('canada world'), true)
  door.lock('canada')
  assert.equal(door.knock('canada'), false)
  assert.equal(door.knock('world'), true)
})

test('add locks from array', assert => {
  assert.plan(2)
  var door = doors(['hello', 'world'])
  door.unlock(['hello', 'world'])
  assert.equal(door.knock(['hello', 'world']), true)
  door.lock(['beep', 'boop'])
  assert.equal(door.knock(['boop', 'beep']), false)
})

test('emit lock event when lock', assert => {
  assert.plan(2)
  var door = doors()
  door.on('lock', name => assert.equal(name, 'hello'))
  door.on('lock hello', () => assert.ok('event received'))
  door.lock('hello')
})

test('emit lock events when locks', assert => {
  assert.plan(4)
  var door = doors()
  const locks = ['hello', 'world']
  door.on('lock hello', () => assert.ok('hello received'))
  door.on('lock world', () => assert.ok('world received'))
  door.on('lock', name => {
    assert.equal(locks.indexOf(name) > -1, true)
  })
  door.lock(locks)
})

test('does not emit lock event if already locked', assert => {
  assert.plan(1)
  var door = doors('hello')
  door.on('lock hello', () => assert.fail('fail'))
  door.lock('hello')
  assert.ok('pass')
})

test('does not emit unlock event if lock unknown', assert => {
  assert.plan(2)
  var door = doors('hello')
  door.on('unlock', name => assert.equal(name, 'hello'))
  door.on('unlock hello', () => assert.ok('event received'))
  door.unlock('hello')
})

test('does not emit unlock event if lock alerady unlocked', assert => {
  assert.plan(1)
  var door = doors()
  door.on('unlock', name => assert.fail('should not be received'))
  door.unlock('hello')
  assert.ok('end')
})

test('emit open event when no locks', assert => {
  assert.plan(1)
  var door = doors('hello')
  door.on('open', () => assert.ok('open'))
  door.unlock('hello')
})

test('emit open event only if door closed prior', assert => {
  assert.plan(1)
  var door = doors('hello')
  door.on('open', () => assert.ok('open'))
  door.unlock('hello')
  door.unlock('hello')
})

test('emit close event when lock', assert => {
  assert.plan(1)
  var door = doors()
  door.on('close', () => assert.ok('close'))
  door.lock('hello')
})

test('emit close event only if door openned prior', assert => {
  assert.plan(1)
  var door = doors()
  door.on('close', () => assert.ok('close'))
  door.lock('hello')
  door.lock('hello')
})

test('emit open and close event', assert => {
  assert.plan(1)
  var door = doors()
  door.on('open', () => assert.ok('open once'))
  door.on('close', () => assert.ok('close once'))
  door.lock('hello')
  door.lock('hello')
  door.unlock('open')
  door.unlock('open')
})

test('resolve promise if door closed prior', assert => {
  assert.plan(1)
  var door = doors('hello')
  door.promise().then(() => assert.ok('open'), () => assert.fail('close'))
  door.unlock('hello')
})

test('reject promise if door openned prior', assert => {
  assert.plan(1)
  var door = doors()
  door.promise().then(() => assert.fail('open'), () => assert.ok('close'))
  door.lock('hello')
})

test('unlock and resolve promise', assert => {
  assert.plan(1)
  var door = doors('hello world')
  door.promise('hello').then(() => assert.ok('unlock'), () => assert.fail('lock'))
  door.unlock('hello')
})

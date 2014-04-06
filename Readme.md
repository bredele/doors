# doors

  > A door represents the eventual result of an asynchronous operation. This operation is trigerred by an `open` event and depend on multiple conditions (`locks`).

## Installation

  Install with [component](http://component.io):

    $ component install bredele/doors

  Install with [nodejs](http://nodejs.org):

    $ npm install bredele-doors

  [standalone](https://github.com/bredele/doors/blob/master/doors.js):

    $ <script src="doors.js"></script>

## What is the door pattern?

![Doors](doors.png)

You will find some examples [here](https://github.com/bredele/doors/tree/master/examples). Make sure you build the component first.

    $ make

### The origin

Design patterns are very trendy.
There are two design patterns that are really interesting:

* **State Machine** - Basically, it allows you to change your application from one state to another (this is called a transition) when initiated by a triggering an event or a **condition**. You can define an action to execute asynchronously for each transition. You will find a great State machine [here](https://github.com/flams/emily/blob/master/src/StateMachine.js).

* **Promises** - To use the words of Wikipedia : it represents the value returned from the single completion of an operation. To make it simple, that's a state machine with two immutable transitions : unfulfilled to fulfilled (or unresolve to resolve) and unfulfilled to failed. You will find a great Promises implementation [here](https://github.com/flams/emily/blob/master/src/Promise.js)

Both have something missing. A transition occurs when **one** condition is triggered. Things are not so simple in real life. You will probably have more than one condition to do something, but one condition is sufficient to not do it. Think about a door with multiple locks: **you can't open the door until all locks are unlocked.**

Additionally, things can change and are not necessarily immutable. A door which is unlocked is not open until you actually open it and a door which is opened can be closed and locked again.



## API

  - [Doors()](#doors)
  - [Doors.has()](#doorshaskeystring)
  - [Doors.add()](#doorsaddnamestring)
  - [Doors.lock()](#doorslock)
  - [Doors.unlock()](#doorsunlock)
  - [Doors.toggle()](#doorstogglenamestringboolboolean)
  - [Doors.open()](#doorsopen)
  - [Doors.on()](#doorson)

### Doors(key:String, [locks:Array])

  Doors constructor. Initialize door with a key (mandatory) and
  an optional array of locks.

```js
  var Doors = require('doors');
  var door = new Doors('github');
```

### .has(key)

  Return true if has lock.

```js
  door.has('olivier');
```  

### .add(key)

  Add string lock or child door.

```js
  door.add('olivier');
  door.add(new Doors('child')); 
```

### .lock()

  Lock a previously added lock.

  
```js
  door.lock('olivier'); //lock 'olivier'
  door.lock('olivier', 'amy'); //lock 'olivier' and 'amy'
  door.lock(); //lock all the locks
```

### .unlock()

  Unlock door's lock(s).

  
```js
  door.unlock('olivier'); //unlock 'olivier'
  door.unlock('olivier', 'amy'); //unlock 'olivier' and 'amy'
  door.unlock(); //unlock all the locks
```

Emits `open` event when all the locks are unlocked.

### .toggle(key, bool)

  Toggle Lock.

```js
  door.toggle('olivier'); //lock
  door.toggle('olivier', true); //unlock

```

### .open()

  Open the door only if all locks are unlocked.
  and emit open event.


### .on(topic, fn)

  Listen door events.

```js
  door.on('open', function(){
    //do something
  }); 
```

## License

The MIT License (MIT)

Copyright (c) 2014 Olivier Wietrich <olivier.wietrich@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

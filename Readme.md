
# doors

  door pattern

## Installation

  Install with [component](http://component.io):

    $ component install bredele/doors

## API

  - [Doors()](#doors)
  - [Doors.has()](#doorshaskeystring)
  - [Doors.add()](#doorsaddnamestring)
  - [Doors.lock()](#doorslock)
  - [Doors.unlock()](#doorsunlock)
  - [Doors.toggle()](#doorstogglenamestringboolboolean)
  - [Doors.open()](#doorsopen)

### Doors(key:String, [locks:Array])

  Doors constructor. Initialize door with a key (mandatory) and
  an optional array of locks.

```js
	var Doors = require('doors');
  var door = new Doors('github');
```

### Doors.has(key:String)

  Return true if has lock.

### Doors.add(key:String)

  Add string lock or child door.

```js
  door.add('olivier');
  door.add(new Doors('child')); 
```

### Doors.lock()

  Lock a previously added lock.

  
```js
  door.lock('olivier'); //lock 'olivier'
  door.lock('olivier', 'amy'); //lock 'olivier' and 'amy'
  door.lock(); //lock all the locks
```

### Doors.unlock()

  Unlock door's lock(s).

  
```js
  door.unlock('olivier'); //unlock 'olivier'
  door.unlock('olivier', 'amy'); //unlock 'olivier' and 'amy'
  door.unlock(); //unlock all the locks
```

### Doors.toggle(key:String, bool:Boolean)

  Toggle Lock.

```js
  door.toggle('olivier'); //lock
  door.toggle('olivier', true); //unlock

```

### Doors.open()

  Open the door only if all locks are unlocked.
  and emit open event.


## License

  MIT


/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-emitter/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var index = require('indexof');\n\
\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  fn._off = on;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var i = index(callbacks, fn._off || fn);\n\
  if (~i) callbacks.splice(i, 1);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
//@ sourceURL=component-emitter/index.js"
));
require.register("component-indexof/index.js", Function("exports, require, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};//@ sourceURL=component-indexof/index.js"
));
require.register("bredele-doors/index.js", Function("exports, require, module",
"var Emitter = require('emitter'),\n\
\t\tindex = require('indexof');\n\
\n\
\n\
/**\n\
 * Expose 'Doors'\n\
 */\n\
\n\
module.exports = Doors;\n\
\n\
\n\
/**\n\
 * Doors constructor.\n\
 * @api public\n\
 */\n\
\n\
function Doors(name, locks) {\n\
\tvar arr = locks || [];\n\
\tthis.name = name;\n\
\tthis.keys = [];\n\
  this.locks = {};\n\
  for(var l = arr.length; l--;) {\n\
    this.add(arr[l]);\n\
  }\n\
}\n\
\n\
\n\
//Doors is an emitter\n\
\n\
Emitter(Doors.prototype);\n\
\n\
\n\
/**\n\
 * Has key.\n\
 *\n\
 * @param {String} key \n\
 * @return {Boolean} true if key is locked\n\
 * @api public\n\
 */\n\
\n\
Doors.prototype.has = function(key) {\n\
\treturn !!~index(this.keys, key);\n\
};\n\
\n\
\n\
/**\n\
 * Add lock.\n\
 *\n\
 * @param {String} name \n\
 * @api public\n\
 */\n\
\n\
Doors.prototype.add = function(lock) {\n\
\tif(!this.has(lock)) {\n\
\t\tvar key = lock;\n\
\t\tif(lock instanceof Doors) {\n\
\t\t\tvar _this = this;\n\
\t\t\tkey = lock.name;\n\
\t\t\tlock.on('open', function() {\n\
\t\t\t\t_this.unlock(key);\n\
\t\t\t});\n\
\t\t}\n\
\t\tthis.locks[key] = lock;\n\
\t\tthis.keys.push(key);\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Lock a previously added lock.\n\
 * Examples:\n\
 *\n\
 *     door.lock('olivier'); //lock 'olivier'\n\
 *     door.lock('olivier', 'amy'); //lock 'olivier' and 'amy'\n\
 *     door.lock(); //lock all the locks\n\
 *\n\
 * @api public\n\
 */\n\
\n\
Doors.prototype.lock = function() {\n\
\tvar length = arguments.length;\n\
\tif(length) {\n\
\t\tfor(var l = length; l--;) {\n\
\t\t\tvar key = arguments[l];\n\
\t\t\tif(this.locks[key] && !this.has(key)) {\n\
\t\t\t\tvar lock = this.locks[key];\n\
\t\t\t\tif(lock instanceof Doors) {\n\
\t\t\t\t\tlock.lock();\n\
\t\t\t\t}\n\
\t\t\t\tthis.keys.push(key);\n\
\t\t\t}\n\
\t\t}\n\
\t} else if(Object.keys(this.locks).length){\n\
\t\tthis.lock.apply(this, Object.keys(this.locks));\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Unlock door's lock(s).\n\
 * Examples:\n\
 *\n\
 *     door.unlock('olivier'); //unlock 'olivier'\n\
 *     door.unlock('olivier', 'amy'); //unlock 'olivier' and 'amy'\n\
 *     door.unlock(); //unlock all the locks\n\
 *\n\
 * @params {String} key(s)\n\
 * @api public\n\
 */\n\
\n\
Doors.prototype.unlock = function() {\n\
\tvar length = arguments.length;\n\
\tif(length) {\n\
\t\tfor(var l = length; l--;) {\n\
\t\t\tvar key = arguments[l];\n\
\t\t\tif(this.has(key)) {\n\
\t\t\t\tvar lock = this.locks[key];\n\
\t\t\t\tthis.keys.splice(index(this.keys, key), 1);\n\
\t\t\t\tif(lock instanceof Doors) {\n\
\t\t\t\t\tlock.unlock();\n\
\t\t\t\t}\n\
\t\t\t\tthis.open();\n\
\t\t\t}\n\
\t\t}\n\
\t} else if(this.keys.length){\n\
\t\tthis.unlock.apply(this, this.keys);\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Toggle Lock.\n\
 * \n\
 * @param  {String} name \n\
 * @param  {Boolean} bool \n\
 * @api public\n\
 */\n\
\n\
Doors.prototype.toggle = function(name, bool) {\n\
\tif(bool) {\n\
\t\tthis.unlock(name);\n\
\t} else {\n\
\t\tthis.lock(name);\n\
\t}\n\
};\n\
\n\
\n\
/**\n\
 * Open the door only if all locks are unlocked.\n\
 * and emit open event.\n\
 * \n\
 * @return {Boolean} true if open\n\
 * @api public\n\
 */\n\
\n\
Doors.prototype.open = function() {\n\
\tif(!this.keys.length) {\n\
\t\tthis.emit('open');\n\
\t\treturn true;\n\
\t}\n\
\treturn false;\n\
};\n\
//@ sourceURL=bredele-doors/index.js"
));
require.register("component-stack/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `stack()`.\n\
 */\n\
\n\
module.exports = stack;\n\
\n\
/**\n\
 * Return the stack.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
function stack() {\n\
  var orig = Error.prepareStackTrace;\n\
  Error.prepareStackTrace = function(_, stack){ return stack; };\n\
  var err = new Error;\n\
  Error.captureStackTrace(err, arguments.callee);\n\
  var stack = err.stack;\n\
  Error.prepareStackTrace = orig;\n\
  return stack;\n\
}//@ sourceURL=component-stack/index.js"
));
require.register("component-assert/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var stack = require('stack');\n\
\n\
/**\n\
 * Load contents of `script`.\n\
 *\n\
 * @param {String} script\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function getScript(script) {\n\
  var xhr = new XMLHttpRequest;\n\
  xhr.open('GET', script, false);\n\
  xhr.send(null);\n\
  return xhr.responseText;\n\
}\n\
\n\
/**\n\
 * Assert `expr` with optional failure `msg`.\n\
 *\n\
 * @param {Mixed} expr\n\
 * @param {String} [msg]\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(expr, msg){\n\
  if (expr) return;\n\
  if (!msg) {\n\
    if (Error.captureStackTrace) {\n\
      var callsite = stack()[1];\n\
      var fn = callsite.getFunctionName();\n\
      var file = callsite.getFileName();\n\
      var line = callsite.getLineNumber() - 1;\n\
      var col = callsite.getColumnNumber() - 1;\n\
      var src = getScript(file);\n\
      line = src.split('\\n\
')[line].slice(col);\n\
      expr = line.match(/assert\\((.*)\\)/)[1].trim();\n\
      msg = expr;\n\
    } else {\n\
      msg = 'assertion failed';\n\
    }\n\
  }\n\
\n\
  throw new Error(msg);\n\
};\n\
//@ sourceURL=component-assert/index.js"
));
require.register("bredele-trim/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose 'trim'\n\
 * @param  {String} str\n\
 * @api public\n\
 */\n\
module.exports = function(str){\n\
  if(str.trim) return str.trim();\n\
  return str.replace(/^\\s*|\\s*$/g, '');\n\
};//@ sourceURL=bredele-trim/index.js"
));
require.register("bredele-interpolation/index.js", Function("exports, require, module",
"//thanks IE8\n\
var indexOf = require('indexof');\n\
var trim = require('trim');\n\
\n\
// function parse(expr){\n\
//   return new Function('model', expr);\n\
// }\n\
\n\
/**\n\
 * Expose 'interpolation'\n\
 *\n\
 * @param {String} str\n\
 * @param {Object} model\n\
 * @return {String} interpolation's result\n\
 */\n\
\n\
module.exports.text = function(text, model){\n\
  //TODO: refactor with attrs\n\
  return text.replace(/\\{([^}]+)\\}/g, function(_, expr){\n\
    //var fn = parse('return '+ expr.trim());\n\
    var value = model.get(trim(expr));\n\
    return value ? value : '';\n\
  });\n\
};\n\
\n\
module.exports.attrs = function(text, model){\n\
  var exprs = [];\n\
  text.replace(/\\{([^}]+)\\}/g, function(_, expr){\n\
    var value = trim(expr);\n\
    if(!~indexOf(exprs, value)) exprs.push(value);\n\
  });\n\
  return exprs;\n\
};//@ sourceURL=bredele-interpolation/index.js"
));
require.register("component-domify/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `parse`.\n\
 */\n\
\n\
module.exports = parse;\n\
\n\
/**\n\
 * Wrap map from jquery.\n\
 */\n\
\n\
var map = {\n\
  option: [1, '<select multiple=\"multiple\">', '</select>'],\n\
  optgroup: [1, '<select multiple=\"multiple\">', '</select>'],\n\
  legend: [1, '<fieldset>', '</fieldset>'],\n\
  thead: [1, '<table>', '</table>'],\n\
  tbody: [1, '<table>', '</table>'],\n\
  tfoot: [1, '<table>', '</table>'],\n\
  colgroup: [1, '<table>', '</table>'],\n\
  caption: [1, '<table>', '</table>'],\n\
  tr: [2, '<table><tbody>', '</tbody></table>'],\n\
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n\
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],\n\
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],\n\
  _default: [0, '', '']\n\
};\n\
\n\
/**\n\
 * Parse `html` and return the children.\n\
 *\n\
 * @param {String} html\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function parse(html) {\n\
  if ('string' != typeof html) throw new TypeError('String expected');\n\
\n\
  html = html.replace(/^\\s+|\\s+$/g, ''); // Remove leading/trailing whitespace\n\
\n\
  // tag name\n\
  var m = /<([\\w:]+)/.exec(html);\n\
  if (!m) throw new Error('No elements were generated.');\n\
  var tag = m[1];\n\
\n\
  // body support\n\
  if (tag == 'body') {\n\
    var el = document.createElement('html');\n\
    el.innerHTML = html;\n\
    return el.removeChild(el.lastChild);\n\
  }\n\
\n\
  // wrap map\n\
  var wrap = map[tag] || map._default;\n\
  var depth = wrap[0];\n\
  var prefix = wrap[1];\n\
  var suffix = wrap[2];\n\
  var el = document.createElement('div');\n\
  el.innerHTML = prefix + html + suffix;\n\
  while (depth--) el = el.lastChild;\n\
\n\
  var els = el.children;\n\
  if (1 == els.length) {\n\
    return el.removeChild(els[0]);\n\
  }\n\
\n\
  var fragment = document.createDocumentFragment();\n\
  while (els.length) {\n\
    fragment.appendChild(el.removeChild(els[0]));\n\
  }\n\
\n\
  return fragment;\n\
}\n\
//@ sourceURL=component-domify/index.js"
));
require.register("bredele-node-substitution/index.js", Function("exports, require, module",
"var interpolation = require('interpolation');\n\
\n\
/**\n\
 * Expose 'node substitution'\n\
 */\n\
\n\
module.exports = Substitution;\n\
\n\
\n\
/**\n\
 * Node substitution constructor.\n\
 * @param {HTMLElement} node  type 3\n\
 * @param {Store} store \n\
 */\n\
\n\
function Substitution(node, store) { //may be use an adapter\n\
  this.node = node;\n\
  this.store = store;\n\
  //cache text template\n\
  this.text = node.nodeValue;\n\
\n\
  this.exprs = interpolation.attrs(this.text);\n\
  for(var l = this.exprs.length; l--;){ //TODO: do own each package with a fast loop\n\
    var expr = this.exprs[l];\n\
    var _this = this;\n\
    store.on('change ' + expr, function(){ //TODO: have emitter with scope\n\
      _this.apply();\n\
    });\n\
  }\n\
  this.apply();\n\
}\n\
\n\
\n\
/**\n\
 * Replace text content with store values.\n\
 * @api public\n\
 */\n\
\n\
Substitution.prototype.apply = function() {\n\
  this.node.nodeValue = interpolation.text(this.text, this.store);\n\
};//@ sourceURL=bredele-node-substitution/index.js"
));
require.register("bredele-data-binding/index.js", Function("exports, require, module",
"var Interpolation = require('node-substitution');\n\
var indexOf = require('indexof');\n\
\n\
/**\n\
 * Expose 'data binding'\n\
 */\n\
\n\
module.exports = Binding;\n\
\n\
\n\
/**\n\
 * Intitialize a binding.\n\
 * @param {Object} model \n\
 */\n\
\n\
function Binding(model){\n\
  //TODO: mixin with store if not instanceof store\n\
  this.model = model;\n\
  this.plugins = {};\n\
}\n\
\n\
\n\
/**\n\
 * Add binding by name\n\
 * @param {String} name  \n\
 * @param {Object} plugin \n\
 * @api public\n\
 */\n\
\n\
Binding.prototype.add = function(name, plugin) {\n\
  this.plugins[name] = plugin;\n\
};\n\
\n\
\n\
/**\n\
 * Attribute binding.\n\
 * @param  {HTMLElement} node \n\
 * @api private\n\
 */\n\
Binding.prototype.attrsBinding = function(node){\n\
  var attributes = node.attributes;\n\
  //reverse loop doesn't work on IE...\n\
  for(var i = 0, l = attributes.length; i < l; i++){\n\
    var attribute = attributes[i];\n\
    var name = attribute.nodeName;\n\
    var plugin = this.plugins[name.substring(5)];\n\
    var content = attribute.nodeValue;\n\
    if(plugin && (name.substring(0,5) === 'data-')) {\n\
      if(typeof plugin === 'function'){\n\
        plugin.call(this.model, node, content);\n\
      } else {\n\
        var expr = content.split(':');\n\
        var method = expr[0];\n\
        var params = expr[1].split(',');\n\
        params.splice(0,0,node);\n\
        plugin[method].apply(plugin, params);\n\
      }\n\
    } else {\n\
      if(indexOf(content, '{') > -1){\n\
        new Interpolation(attribute, this.model);\n\
      }\n\
    }\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Apply bindings on a single node\n\
 * @param  {DomElement} node \n\
 * @api private\n\
 */\n\
\n\
Binding.prototype.applyBindings = function(node) {\n\
  //dom element\n\
  if (node.nodeType === 1) {\n\
    this.attrsBinding(node);\n\
  }\n\
  // text node\n\
  if (node.nodeType == 3) {\n\
    new Interpolation(node, this.model);\n\
  }\n\
};\n\
\n\
/**\n\
 * Apply bindings on nested DOM element.\n\
 * @param  {DomElement} node \n\
 * @api public\n\
 */\n\
\n\
Binding.prototype.apply = function(node) {\n\
  this.applyBindings(node);\n\
\n\
  //child nodes are elements and text\n\
  for (var i = 0; i < node.childNodes.length; i++) {\n\
    var child = node.childNodes[i];\n\
    this.apply(child);\n\
  }\n\
};\n\
//@ sourceURL=bredele-data-binding/index.js"
));
require.register("bredele-view/index.js", Function("exports, require, module",
"var Binding = require('data-binding');\n\
var Store = require('store');\n\
\n\
//TODO: do our own component\n\
//with just what we need\n\
function domify(tmpl){\n\
  if(tmpl instanceof HTMLElement) return tmpl;\n\
  //may be by applying binding on this node we can have multiple\n\
  //children\n\
  var div = document.createElement('div');\n\
  div.innerHTML = tmpl;\n\
  return div.firstChild;\n\
}\n\
\n\
/**\n\
 * Expose 'View'\n\
 */\n\
\n\
module.exports = View;\n\
\n\
\n\
/**\n\
 * View constructor.\n\
 * We keep the constructor clean for override.\n\
 * @api public\n\
 */\n\
\n\
function View(){\n\
  this.dom = null;\n\
  this.store = null;\n\
  this.binding = new Binding();\n\
}\n\
\n\
\n\
/**\n\
 * Turn HTML into DOM with data store.\n\
 * The template is either a string or \n\
 * an existing HTML element.\n\
 * @param  {String|HTMLElement} tmpl  \n\
 * @param  {Object} store can be nothing, an object or a store\n\
 * @api public\n\
 */\n\
\n\
View.prototype.template = function(tmpl, store, mixin) {\n\
  //TODO: I would like ideally work on adapter and not store\n\
  this.store = new Store(store);\n\
  //TODO: refactor data-biding, we did that because we can't initialize binding with model\n\
  this.binding.model = this.store;\n\
  this.dom = domify(tmpl);\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Add binding plugin.\n\
 * @param  {String} name \n\
 * @param  {Object | Function} plug \n\
 * @return {View}\n\
 * @api public\n\
 */\n\
\n\
View.prototype.plugin = function(name, plug) {\n\
  this.binding.add(name, plug);\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Place widget in document.\n\
 * @param {HTMLElement} node\n\
 * @api public\n\
 */\n\
\n\
View.prototype.insert = function(node) {\n\
  this.alive();\n\
  node.appendChild(this.dom);\n\
};\n\
\n\
\n\
/**\n\
 * Apply data-binding on dom.\n\
 * @param {HTMLElement} node widget's dom if undefined\n\
 * @api publi\n\
 */\n\
\n\
View.prototype.alive = function(node) {\n\
  this.binding.apply(node || this.dom);\n\
};\n\
\n\
\n\
View.prototype.destroy = function() {\n\
  \n\
};//@ sourceURL=bredele-view/index.js"
));
require.register("bredele-each/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose 'each'\n\
 */\n\
\n\
module.exports = function(obj, fn, scope){\n\
  if( obj instanceof Array) {\n\
    array(obj, fn, scope);\n\
  } else if(typeof obj === 'object') {\n\
    object(obj, fn, scope);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Object iteration.\n\
 * @param  {Object}   obj   \n\
 * @param  {Function} fn    \n\
 * @param  {Object}   scope \n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn, scope) {\n\
  for (var i in obj) {\n\
    if (obj.hasOwnProperty(i)) {\n\
      fn.call(scope, i, obj[i]);\n\
    }\n\
  }\n\
}\n\
\n\
\n\
/**\n\
 * Array iteration.\n\
 * @param  {Array}   obj   \n\
 * @param  {Function} fn    \n\
 * @param  {Object}   scope \n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn, scope){\n\
  for(var i = 0, l = obj.length; i < l; i++){\n\
    fn.call(scope, i, obj[i]);\n\
  }\n\
}//@ sourceURL=bredele-each/index.js"
));
require.register("bredele-clone/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose 'clone'\n\
 * @param  {Object} obj \n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj) {\n\
  if(obj instanceof Array) {\n\
    return obj.slice(0);\n\
  }\n\
  return clone(obj);\n\
};\n\
\n\
\n\
/**\n\
 * Clone object.\n\
 * @param  {Object} obj \n\
 * @api private\n\
 */\n\
\n\
function clone(obj){\n\
  if(typeof obj === 'object') {\n\
    var copy = {};\n\
    for (var key in obj) {\n\
      if (obj.hasOwnProperty(key)) {\n\
        copy[key] = clone(obj[key]);\n\
      }\n\
    }\n\
    return copy;\n\
  }\n\
  return obj;\n\
}//@ sourceURL=bredele-clone/index.js"
));
require.register("bredele-store/index.js", Function("exports, require, module",
"var Emitter = require('emitter'); //TODO:replace by our own with scope\n\
var clone = require('clone');\n\
var each = require('each');\n\
\n\
/**\n\
 * Expose 'Store'\n\
 */\n\
\n\
module.exports = Store;\n\
\n\
\n\
/**\n\
 * Store constructor\n\
 * @api public\n\
 */\n\
\n\
function Store(data) {\n\
  if(data instanceof Store) return data;\n\
  this.data = data || {};\n\
  this.formatters = {};\n\
}\n\
\n\
\n\
Emitter(Store.prototype);\n\
\n\
/**\n\
 * Set store attribute.\n\
 * @param {String} name\n\
 * @param {Everything} value\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.set = function(name, value, plugin) { //add object options\n\
  var prev = this.data[name];\n\
  if(prev !== value) {\n\
    this.data[name] = value;\n\
    this.emit('change', name, value, prev);\n\
    this.emit('change ' + name, value, prev);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Get store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.get = function(name) {\n\
  var formatter = this.formatters[name];\n\
  var value = this.data[name];\n\
  if(formatter) {\n\
    value = formatter[0].call(formatter[1], value);\n\
  }\n\
  return value;\n\
};\n\
\n\
/**\n\
 * Get store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api private\n\
 */\n\
\n\
Store.prototype.has = function(name) {\n\
  //NOTE: I don't know if it should be public\n\
  return this.data.hasOwnProperty(name);\n\
};\n\
\n\
\n\
/**\n\
 * Delete store attribute.\n\
 * @param {String} name\n\
 * @return {Everything}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.del = function(name) {\n\
  //TODO:refactor this is ugly\n\
  if(this.has(name)){\n\
    if(this.data instanceof Array){\n\
      this.data.splice(name, 1);\n\
    } else {\n\
      delete this.data[name]; //NOTE: do we need to return something?\n\
    }\n\
    this.emit('deleted', name);\n\
    this.emit('deleted ' + name);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Set format middleware.\n\
 * Call formatter everytime a getter is called.\n\
 * A formatter should always return a value.\n\
 * @param {String} name\n\
 * @param {Function} callback\n\
 * @param {Object} scope\n\
 * @return this\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.format = function(name, callback, scope) {\n\
  this.formatters[name] = [callback,scope];\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Compute store attributes\n\
 * @param  {String} name\n\
 * @return {Function} callback                \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.compute = function(name, callback) {\n\
  //NOTE: I want something clean instaead passing the computed \n\
  //attribute in the function\n\
  var str = callback.toString();\n\
  var attrs = str.match(/this.[a-zA-Z0-9]*/g);\n\
\n\
  this.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)\n\
  for(var l = attrs.length; l--;){\n\
    this.on('change ' + attrs[l].slice(5), function(){\n\
      this.set(name, callback.call(this.data));\n\
    });\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Reset store\n\
 * @param  {Object} data \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.reset = function(data) {\n\
  var copy = clone(this.data);\n\
  this.data = data;\n\
  //remove undefined attributes\n\
  each(copy, function(key, val){\n\
    if(typeof data[key] === 'undefined'){\n\
      this.emit('deleted', key);\n\
      this.emit('deleted ' + key);\n\
    }\n\
  }, this);\n\
  //set new attributes\n\
  each(data, function(key, val){\n\
    //TODO:refactor with this.set\n\
    var prev = copy[key];\n\
    if(prev !== val) {\n\
      this.emit('change', key, val, prev);\n\
      this.emit('change ' + key, val, prev);\n\
    }\n\
  }, this);\n\
};\n\
\n\
\n\
/**\n\
 * Stringify model\n\
 * @return {String} json\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.toJSON = function() {\n\
  return JSON.stringify(this.data);\n\
};//@ sourceURL=bredele-store/index.js"
));
require.register("component-event/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Bind `el` event `type` to `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, type, fn, capture){\n\
  if (el.addEventListener) {\n\
    el.addEventListener(type, fn, capture || false);\n\
  } else {\n\
    el.attachEvent('on' + type, fn);\n\
  }\n\
  return fn;\n\
};\n\
\n\
/**\n\
 * Unbind `el` event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  if (el.removeEventListener) {\n\
    el.removeEventListener(type, fn, capture || false);\n\
  } else {\n\
    el.detachEvent('on' + type, fn);\n\
  }\n\
  return fn;\n\
};\n\
//@ sourceURL=component-event/index.js"
));
require.register("component-matches-selector/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var query = require('query');\n\
\n\
/**\n\
 * Element prototype.\n\
 */\n\
\n\
var proto = Element.prototype;\n\
\n\
/**\n\
 * Vendor function.\n\
 */\n\
\n\
var vendor = proto.matches\n\
  || proto.webkitMatchesSelector\n\
  || proto.mozMatchesSelector\n\
  || proto.msMatchesSelector\n\
  || proto.oMatchesSelector;\n\
\n\
/**\n\
 * Expose `match()`.\n\
 */\n\
\n\
module.exports = match;\n\
\n\
/**\n\
 * Match `el` to `selector`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
function match(el, selector) {\n\
  if (vendor) return vendor.call(el, selector);\n\
  var nodes = query.all(selector, el.parentNode);\n\
  for (var i = 0; i < nodes.length; ++i) {\n\
    if (nodes[i] == el) return true;\n\
  }\n\
  return false;\n\
}\n\
//@ sourceURL=component-matches-selector/index.js"
));
require.register("discore-closest/index.js", Function("exports, require, module",
"var matches = require('matches-selector')\n\
\n\
module.exports = function (element, selector, checkYoSelf, root) {\n\
  element = checkYoSelf ? element : element.parentNode\n\
  root = root || document\n\
\n\
  do {\n\
    if (matches(element, selector))\n\
      return element\n\
    // After `matches` on the edge case that\n\
    // the selector matches the root\n\
    // (when the root is not the document)\n\
    if (element === root)\n\
      return\n\
    // Make sure `element !== document`\n\
    // otherwise we get an illegal invocation\n\
  } while ((element = element.parentNode) && element !== document)\n\
}//@ sourceURL=discore-closest/index.js"
));
require.register("component-delegate/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var closest = require('closest')\n\
  , event = require('event');\n\
\n\
/**\n\
 * Delegate event `type` to `selector`\n\
 * and invoke `fn(e)`. A callback function\n\
 * is returned which may be passed to `.unbind()`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, selector, type, fn, capture){\n\
  return event.bind(el, type, function(e){\n\
    var target = e.target || e.srcElement;\n\
    e.delegateTarget = closest(target, selector, true, el);\n\
    if (e.delegateTarget) fn.call(el, e);\n\
  }, capture);\n\
};\n\
\n\
/**\n\
 * Unbind event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  event.unbind(el, type, fn, capture);\n\
};\n\
//@ sourceURL=component-delegate/index.js"
));
require.register("bredele-event-plugin/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var ev = require('event'),\n\
    delegate = require('delegate');\n\
\n\
/**\n\
 * Map touch events.\n\
 * @type {Object}\n\
 * @api private\n\
 */\n\
\n\
var mapper = {\n\
\t'click' : 'touchstart',\n\
\t'mousedown' : 'touchstart',\n\
\t'mouseup' : 'touchend',\n\
\t'mousemove' : 'touchmove'\n\
};\n\
\n\
\n\
/**\n\
 * Expose 'Event plugin'\n\
 */\n\
\n\
module.exports = Event;\n\
\n\
\n\
/**\n\
 * Event plugin constructor\n\
 * @param {Object} view event plugin scope\n\
 * @param {Boolean} isTouch optional\n\
 * @api public\n\
 */\n\
\n\
function Event(view, isTouch){\n\
  this.view = view;\n\
  this.isTouch = isTouch || (window.ontouchstart !== undefined);\n\
}\n\
\n\
\n\
/**\n\
 * Listen events.\n\
 * @param {HTMLElement} node \n\
 * @param {String} type event's type\n\
 * @param {String} callback view's callback name\n\
 * @param {String} capture useCapture\n\
 * @api private\n\
 */\n\
\n\
Event.prototype.on = function(node, type, callback, capture) {\n\
  var _this = this;\n\
  ev.bind(node, this.map(type), function(e){\n\
    _this.view[callback].call(_this.view, e, node);\n\
  }, (capture === 'true'));\n\
};\n\
\n\
\n\
/**\n\
 * Event delegation.\n\
 * @param {HTMLElement} node \n\
 * @param {String} selector\n\
 * @param {String} type event's type\n\
 * @param {String} callback view's callback name\n\
 * @param {String} capture useCapture\n\
 * @api private\n\
 */\n\
\n\
Event.prototype.delegate = function(node, selector, type, callback, capture) {\n\
  var _this = this;\n\
  delegate.bind(node, selector, this.map(type), function(e){\n\
    _this.view[callback].call(_this.view, e, node);\n\
  }, capture);\n\
};\n\
\n\
\n\
/**\n\
 * Map events (desktop and mobile)\n\
 * @param  {String} type event's name\n\
 * @return {String} mapped event\n\
 */\n\
\n\
Event.prototype.map = function(type) {\n\
\treturn this.isTouch ? (mapper[type] || type) : type;\n\
};//@ sourceURL=bredele-event-plugin/index.js"
));
require.register("bredele-each-plugin/index.js", Function("exports, require, module",
"var Binding = require('data-binding');\n\
var Store = require('store');\n\
\n\
\n\
/**\n\
 * Expose 'event-plugin'\n\
 */\n\
\n\
module.exports = Plugin;\n\
\n\
\n\
/**\n\
 * Plugin constructor.\n\
 * @param {Object} model (should have getter/setter and inherit from emitter)\n\
 * @api public\n\
 */\n\
\n\
function Plugin(store){\n\
  this.store = store;\n\
  this.items = {};\n\
}\n\
\n\
\n\
/**\n\
 * Each util.\n\
 * Iterate through store.\n\
 * @param  {HTMLElement} node \n\
 * @api public\n\
 */\n\
\n\
Plugin.prototype.each = function(node) {\n\
  var data = this.store.data;\n\
  var first = node.children[0];\n\
  var _this = this;\n\
  this.node = node;\n\
  //NOTE: may be instead that get the string of node and pass to the renderer\n\
  //do benchmark\n\
  this.clone = first.cloneNode(true);\n\
\n\
  node.removeChild(first);\n\
\n\
\n\
  this.store.on('change', function(key, value){\n\
    var item = _this.items[key];\n\
    if(item) {\n\
      //NOTE: should we unbind in store when we reset?\n\
      item.reset(value); //do our own emitter to have scope\n\
    } else {\n\
      //create item renderer\n\
      _this.addItem(key, value);\n\
    }\n\
  });\n\
\n\
  this.store.on('deleted', function(key){\n\
    _this.delItem(key);\n\
  });\n\
\n\
  //NOTE: might be in store (store.loop)\n\
  for(var i = 0, l = data.length; i < l; i++){\n\
    this.addItem(i, data[i]);\n\
  }\n\
};\n\
\n\
/**\n\
 * Create item renderer from data.\n\
 * @param  {Object} data \n\
 * @api private\n\
 */\n\
\n\
Plugin.prototype.addItem = function(key, data) {\n\
  var item = new ItemRenderer(this.clone, data);\n\
  this.items[key] = item;\n\
  this.node.appendChild(item.dom);\n\
};\n\
\n\
Plugin.prototype.delItem = function(idx) {\n\
    var item = this.items[idx];\n\
    item.unbind(this.node);\n\
    delete this.items[idx];\n\
    item = null; //for garbage collection\n\
};\n\
\n\
\n\
/**\n\
 * Item renderer.\n\
 * Represents the item that going to be repeated.\n\
 * @param {HTMLElement} node \n\
 * @param {Store} data \n\
 * @api private\n\
 */\n\
\n\
function ItemRenderer(node, data){\n\
  //NOTE: is it more perfomant to work with string?\n\
  this.dom = node.cloneNode(true);\n\
  this.store = new Store(data);\n\
  this.binding = new Binding(this.store); //we have to have a boolean parameter to apply interpolation &|| plugins\n\
  this.binding.apply(this.dom);\n\
}\n\
\n\
\n\
/**\n\
 * Unbind an item renderer from its ancestor.\n\
 * @param  {HTMLElement} node \n\
 * @api private\n\
 */\n\
\n\
ItemRenderer.prototype.unbind = function(node) {\n\
  //NOTE: is there something else to do to clean the memory?\n\
  this.store.off();\n\
  node.removeChild(this.dom);\n\
};\n\
\n\
\n\
/**\n\
 * Reset iten renderer.\n\
 * @param  {Object} data \n\
 * @api private\n\
 */\n\
\n\
ItemRenderer.prototype.reset = function(data) {\n\
  this.store.reset(data);\n\
};\n\
\n\
//@ sourceURL=bredele-each-plugin/index.js"
));
require.register("component-classes/index.js", Function("exports, require, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var index = require('indexof');\n\
\n\
/**\n\
 * Whitespace regexp.\n\
 */\n\
\n\
var re = /\\s+/;\n\
\n\
/**\n\
 * toString reference.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Wrap `el` in a `ClassList`.\n\
 *\n\
 * @param {Element} el\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(el){\n\
  return new ClassList(el);\n\
};\n\
\n\
/**\n\
 * Initialize a new ClassList for `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @api private\n\
 */\n\
\n\
function ClassList(el) {\n\
  if (!el) throw new Error('A DOM element reference is required');\n\
  this.el = el;\n\
  this.list = el.classList;\n\
}\n\
\n\
/**\n\
 * Add class `name` if not already present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.add = function(name){\n\
  // classList\n\
  if (this.list) {\n\
    this.list.add(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (!~i) arr.push(name);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove class `name` when present, or\n\
 * pass a regular expression to remove\n\
 * any which match.\n\
 *\n\
 * @param {String|RegExp} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.remove = function(name){\n\
  if ('[object RegExp]' == toString.call(name)) {\n\
    return this.removeMatching(name);\n\
  }\n\
\n\
  // classList\n\
  if (this.list) {\n\
    this.list.remove(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (~i) arr.splice(i, 1);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove all classes matching `re`.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {ClassList}\n\
 * @api private\n\
 */\n\
\n\
ClassList.prototype.removeMatching = function(re){\n\
  var arr = this.array();\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (re.test(arr[i])) {\n\
      this.remove(arr[i]);\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Toggle class `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.toggle = function(name){\n\
  // classList\n\
  if (this.list) {\n\
    this.list.toggle(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  if (this.has(name)) {\n\
    this.remove(name);\n\
  } else {\n\
    this.add(name);\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return an array of classes.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.array = function(){\n\
  var str = this.el.className.replace(/^\\s+|\\s+$/g, '');\n\
  var arr = str.split(re);\n\
  if ('' === arr[0]) arr.shift();\n\
  return arr;\n\
};\n\
\n\
/**\n\
 * Check if class `name` is present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.has =\n\
ClassList.prototype.contains = function(name){\n\
  return this.list\n\
    ? this.list.contains(name)\n\
    : !! ~index(this.array(), name);\n\
};\n\
//@ sourceURL=component-classes/index.js"
));
require.register("component-query/index.js", Function("exports, require, module",
"\n\
function one(selector, el) {\n\
  return el.querySelector(selector);\n\
}\n\
\n\
exports = module.exports = function(selector, el){\n\
  el = el || document;\n\
  return one(selector, el);\n\
};\n\
\n\
exports.all = function(selector, el){\n\
  el = el || document;\n\
  return el.querySelectorAll(selector);\n\
};\n\
\n\
exports.engine = function(obj){\n\
  if (!obj.one) throw new Error('.one callback required');\n\
  if (!obj.all) throw new Error('.all callback required');\n\
  one = obj.one;\n\
  exports.all = obj.all;\n\
};\n\
//@ sourceURL=component-query/index.js"
));
require.register("demo/index.js", Function("exports, require, module",
"\n\
var View = require('view'),\n\
\t\tDoor = require('doors'),\n\
\t\tStore = require('store'),\n\
\t\tEachPlugin = require('each-plugin'),\n\
\t\tEventPlugin = require('event-plugin'),\n\
\t\tquery = require('query'),\n\
\t\tclasses = require('classes');\n\
\n\
var locks = new Door('demo', ['l1', 'l2']);\n\
var door = query('.door');\n\
\n\
\n\
function closeDoor(){\n\
\tif(locks.keys.length === 0) {\n\
\t\tclasses(door).remove('close');\n\
\t} else {\n\
\t\tclasses(door).add('close');\n\
\t}\n\
}\n\
\n\
locks.on('open', function(){\n\
\tclasses(door).remove('close');\n\
});\n\
\n\
\n\
var store = new Store([{\n\
\tname:'l1'\n\
}, {\n\
\tname: 'l2'\n\
}]);\n\
\n\
\n\
var view = new View();\n\
view.plugin('list', new EachPlugin(store));\n\
view.plugin('event', new EventPlugin({\n\
\tadd: function(){\n\
\t\tvar length = store.data.length,\n\
\t\t\t\tname = 'l'+(length + 1);\n\
\n\
\t\tstore.set(length, {\n\
\t\t\tname: name\n\
\t\t});\n\
\n\
\t\tlocks.add(name);\n\
\t\tcloseDoor();\n\
\t},\n\
\ttoggle: function(el, node){\n\
\t\tvar target = el.target,\n\
\t\t\t\tname = target.getAttribute('for').substring(1);\n\
\n\
\t\tlocks.toggle(name, classes(target).has('on'));\n\
\t\tcloseDoor();\n\
\t}\n\
}));\n\
view.alive(query('.locks-panel'));\n\
//@ sourceURL=demo/index.js"
));












require.alias("bredele-doors/index.js", "demo/deps/doors/index.js");
require.alias("bredele-doors/index.js", "demo/deps/doors/index.js");
require.alias("bredele-doors/index.js", "doors/index.js");
require.alias("component-emitter/index.js", "bredele-doors/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-indexof/index.js", "bredele-doors/deps/indexof/index.js");

require.alias("bredele-doors/index.js", "bredele-doors/index.js");
require.alias("bredele-view/index.js", "demo/deps/view/index.js");
require.alias("bredele-view/index.js", "demo/deps/view/index.js");
require.alias("bredele-view/index.js", "view/index.js");
require.alias("bredele-data-binding/index.js", "bredele-view/deps/data-binding/index.js");
require.alias("bredele-data-binding/index.js", "bredele-view/deps/data-binding/index.js");
require.alias("bredele-store/index.js", "bredele-data-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-data-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-node-substitution/index.js", "bredele-data-binding/deps/node-substitution/index.js");
require.alias("bredele-node-substitution/index.js", "bredele-data-binding/deps/node-substitution/index.js");
require.alias("component-assert/index.js", "bredele-node-substitution/deps/assert/index.js");
require.alias("component-stack/index.js", "component-assert/deps/stack/index.js");

require.alias("bredele-interpolation/index.js", "bredele-node-substitution/deps/interpolation/index.js");
require.alias("bredele-interpolation/index.js", "bredele-node-substitution/deps/interpolation/index.js");
require.alias("component-indexof/index.js", "bredele-interpolation/deps/indexof/index.js");

require.alias("bredele-trim/index.js", "bredele-interpolation/deps/trim/index.js");
require.alias("bredele-trim/index.js", "bredele-interpolation/deps/trim/index.js");
require.alias("bredele-trim/index.js", "bredele-trim/index.js");
require.alias("bredele-interpolation/index.js", "bredele-interpolation/index.js");
require.alias("bredele-store/index.js", "bredele-node-substitution/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-node-substitution/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-domify/index.js", "bredele-node-substitution/deps/domify/index.js");

require.alias("bredele-node-substitution/index.js", "bredele-node-substitution/index.js");
require.alias("component-indexof/index.js", "bredele-data-binding/deps/indexof/index.js");

require.alias("bredele-data-binding/index.js", "bredele-data-binding/index.js");
require.alias("bredele-store/index.js", "bredele-view/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-view/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-view/index.js", "bredele-view/index.js");
require.alias("bredele-store/index.js", "demo/deps/store/index.js");
require.alias("bredele-store/index.js", "demo/deps/store/index.js");
require.alias("bredele-store/index.js", "store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-event-plugin/index.js", "demo/deps/event-plugin/index.js");
require.alias("bredele-event-plugin/index.js", "demo/deps/event-plugin/index.js");
require.alias("bredele-event-plugin/index.js", "event-plugin/index.js");
require.alias("component-event/index.js", "bredele-event-plugin/deps/event/index.js");

require.alias("component-delegate/index.js", "bredele-event-plugin/deps/delegate/index.js");
require.alias("discore-closest/index.js", "component-delegate/deps/closest/index.js");
require.alias("discore-closest/index.js", "component-delegate/deps/closest/index.js");
require.alias("component-matches-selector/index.js", "discore-closest/deps/matches-selector/index.js");
require.alias("component-query/index.js", "component-matches-selector/deps/query/index.js");

require.alias("discore-closest/index.js", "discore-closest/index.js");
require.alias("component-event/index.js", "component-delegate/deps/event/index.js");

require.alias("bredele-event-plugin/index.js", "bredele-event-plugin/index.js");
require.alias("bredele-each-plugin/index.js", "demo/deps/each-plugin/index.js");
require.alias("bredele-each-plugin/index.js", "demo/deps/each-plugin/index.js");
require.alias("bredele-each-plugin/index.js", "each-plugin/index.js");
require.alias("bredele-data-binding/index.js", "bredele-each-plugin/deps/data-binding/index.js");
require.alias("bredele-data-binding/index.js", "bredele-each-plugin/deps/data-binding/index.js");
require.alias("bredele-store/index.js", "bredele-data-binding/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-data-binding/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-node-substitution/index.js", "bredele-data-binding/deps/node-substitution/index.js");
require.alias("bredele-node-substitution/index.js", "bredele-data-binding/deps/node-substitution/index.js");
require.alias("component-assert/index.js", "bredele-node-substitution/deps/assert/index.js");
require.alias("component-stack/index.js", "component-assert/deps/stack/index.js");

require.alias("bredele-interpolation/index.js", "bredele-node-substitution/deps/interpolation/index.js");
require.alias("bredele-interpolation/index.js", "bredele-node-substitution/deps/interpolation/index.js");
require.alias("component-indexof/index.js", "bredele-interpolation/deps/indexof/index.js");

require.alias("bredele-trim/index.js", "bredele-interpolation/deps/trim/index.js");
require.alias("bredele-trim/index.js", "bredele-interpolation/deps/trim/index.js");
require.alias("bredele-trim/index.js", "bredele-trim/index.js");
require.alias("bredele-interpolation/index.js", "bredele-interpolation/index.js");
require.alias("bredele-store/index.js", "bredele-node-substitution/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-node-substitution/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("component-domify/index.js", "bredele-node-substitution/deps/domify/index.js");

require.alias("bredele-node-substitution/index.js", "bredele-node-substitution/index.js");
require.alias("component-indexof/index.js", "bredele-data-binding/deps/indexof/index.js");

require.alias("bredele-data-binding/index.js", "bredele-data-binding/index.js");
require.alias("bredele-store/index.js", "bredele-each-plugin/deps/store/index.js");
require.alias("bredele-store/index.js", "bredele-each-plugin/deps/store/index.js");
require.alias("component-emitter/index.js", "bredele-store/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-store/deps/each/index.js");
require.alias("bredele-each/index.js", "bredele-each/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-store/deps/clone/index.js");
require.alias("bredele-clone/index.js", "bredele-clone/index.js");
require.alias("bredele-store/index.js", "bredele-store/index.js");
require.alias("bredele-each-plugin/index.js", "bredele-each-plugin/index.js");
require.alias("component-classes/index.js", "demo/deps/classes/index.js");
require.alias("component-classes/index.js", "classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("component-query/index.js", "demo/deps/query/index.js");
require.alias("component-query/index.js", "query/index.js");

require.alias("demo/index.js", "demo/index.js");
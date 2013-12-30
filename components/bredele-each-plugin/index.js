var Binding = require('binding');
var Store = require('store');


/**
 * Expose 'event-plugin'
 */

module.exports = Plugin;


/**
 * Plugin constructor.
 * @param {Object} model (should have getter/setter and inherit from emitter)
 * @api public
 */

function Plugin(store){
  this.store = store;
  this.items = {};
}


/**
 * Each util.
 * Iterate through store.
 * @param  {HTMLElement} node 
 * @api public
 */

Plugin.prototype.each = function(node) {
  var data = this.store.data;
  var first = node.children[0];
  var _this = this;
  this.node = node;
  //NOTE: may be instead that get the string of node and pass to the renderer
  //do benchmark
  this.clone = first.cloneNode(true);

  node.removeChild(first);


  this.store.on('change', function(key, value){
    var item = _this.items[key];
    if(item) {
      //NOTE: should we unbind in store when we reset?
      item.reset(value); //do our own emitter to have scope
    } else {
      //create item renderer
      _this.addItem(key, value);
    }
  });

  this.store.on('deleted', function(key){
    _this.delItem(key);
  });

  //NOTE: might be in store (store.loop)
  for(var i = 0, l = data.length; i < l; i++){
    this.addItem(i, data[i]);
  }
};

/**
 * Create item renderer from data.
 * @param  {Object} data 
 * @api private
 */

Plugin.prototype.addItem = function(key, data) {
  var item = new ItemRenderer(this.clone, data);
  this.items[key] = item;
  this.node.appendChild(item.dom);
};

Plugin.prototype.delItem = function(idx) {
    var item = this.items[idx];
    item.unbind(this.node);
    delete this.items[idx];
    item = null; //for garbage collection
};


/**
 * Item renderer.
 * Represents the item that going to be repeated.
 * @param {HTMLElement} node 
 * @param {Store} data 
 * @api private
 */

function ItemRenderer(node, data){
  //NOTE: is it more perfomant to work with string?
  this.dom = node.cloneNode(true);
  this.store = new Store(data);
  this.binding = new Binding(this.store); //we have to have a boolean parameter to apply interpolation &|| plugins
  this.binding.apply(this.dom);
}


/**
 * Unbind an item renderer from its ancestor.
 * @param  {HTMLElement} node 
 * @api private
 */

ItemRenderer.prototype.unbind = function(node) {
  //NOTE: is there something else to do to clean the memory?
  this.store.off();
  node.removeChild(this.dom);
};


/**
 * Reset iten renderer.
 * @param  {Object} data 
 * @api private
 */

ItemRenderer.prototype.reset = function(data) {
  this.store.reset(data);
};


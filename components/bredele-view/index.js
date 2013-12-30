var Binding = require('binding');
var Store = require('store');

//TODO: do our own component
//with just what we need
function domify(tmpl){
  if(tmpl instanceof HTMLElement) return tmpl;
  //may be by applying binding on this node we can have multiple
  //children
  var div = document.createElement('div');
  div.innerHTML = tmpl;
  return div.firstChild;
}

/**
 * Expose 'View'
 */

module.exports = View;


/**
 * View constructor.
 * We keep the constructor clean for override.
 * @api public
 */

function View(){
  this.dom = null;
  this.store = null;
  this.binding = new Binding();
}


/**
 * Turn HTML into DOM with data store.
 * The template is either a string or 
 * an existing HTML element.
 * @param  {String|HTMLElement} tmpl  
 * @param  {Object} store can be nothing, an object or a store
 * @api public
 */

View.prototype.template = function(tmpl, store, mixin) {
  //TODO: I would like ideally work on adapter and not store
  this.store = new Store(store);
  //TODO: refactor data-biding, we did that because we can't initialize binding with model
  this.binding.model = this.store;
  this.dom = domify(tmpl);
  return this;
};


/**
 * Add binding plugin.
 * @param  {String} name 
 * @param  {Object | Function} plug 
 * @return {View}
 * @api public
 */

View.prototype.plugin = function(name, plug) {
  this.binding.data(name, plug);
  return this;
};


/**
 * Place widget in document.
 * @param {HTMLElement} node
 * @api public
 */

View.prototype.insert = function(node) {
  this.alive();
  node.appendChild(this.dom);
};


/**
 * Apply data-binding on dom.
 * @param {HTMLElement} node widget's dom if undefined
 * @api publi
 */

View.prototype.alive = function(node) {
  this.binding.apply(node || this.dom);
};


View.prototype.destroy = function() {
  
};
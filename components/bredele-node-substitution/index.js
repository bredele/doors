var interpolation = require('interpolation');

/**
 * Expose 'node substitution'
 */

module.exports = Substitution;


/**
 * Node substitution constructor.
 * @param {HTMLElement} node  type 3
 * @param {Store} store 
 */

function Substitution(node, store) { //may be use an adapter
  this.node = node;
  this.store = store;
  //cache text template
  this.text = node.nodeValue;

  this.exprs = interpolation.attrs(this.text);
  for(var l = this.exprs.length; l--;){ //TODO: do own each package with a fast loop
    var expr = this.exprs[l];
    var _this = this;
    store.on('change ' + expr, function(){ //TODO: have emitter with scope
      _this.apply();
    });
  }
  this.apply();
}


/**
 * Replace text content with store values.
 * @api public
 */

Substitution.prototype.apply = function() {
  this.node.nodeValue = interpolation.text(this.text, this.store);
};
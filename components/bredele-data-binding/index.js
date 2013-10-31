var Interpolation = require('node-substitution');
var indexOf = require('indexof');

/**
 * Expose 'data binding'
 */

module.exports = Binding;


/**
 * Intitialize a binding.
 * @param {Object} model 
 */

function Binding(model){
  //TODO: mixin with store if not instanceof store
  this.model = model;
  this.plugins = {};
}


/**
 * Add binding by name
 * @param {String} name  
 * @param {Object} plugin 
 * @api public
 */

Binding.prototype.add = function(name, plugin) {
  this.plugins[name] = plugin;
};


/**
 * Attribute binding.
 * @param  {HTMLElement} node 
 * @api private
 */
Binding.prototype.attrsBinding = function(node){
  var attributes = node.attributes;
  //reverse loop doesn't work on IE...
  for(var i = 0, l = attributes.length; i < l; i++){
    var attribute = attributes[i];
    var name = attribute.nodeName;
    var plugin = this.plugins[name.substring(5)];
    var content = attribute.nodeValue;
    if(plugin && (name.substring(0,5) === 'data-')) {
      if(typeof plugin === 'function'){
        plugin.call(this.model, node, content);
      } else {
        var expr = content.split(':');
        var method = expr[0];
        var params = expr[1].split(',');
        params.splice(0,0,node);
        plugin[method].apply(plugin, params);
      }
    } else {
      if(indexOf(content, '{') > -1){
        new Interpolation(attribute, this.model);
      }
    }
  }
};


/**
 * Apply bindings on a single node
 * @param  {DomElement} node 
 * @api private
 */

Binding.prototype.applyBindings = function(node) {
  //dom element
  if (node.nodeType === 1) {
    this.attrsBinding(node);
  }
  // text node
  if (node.nodeType == 3) {
    new Interpolation(node, this.model);
  }
};

/**
 * Apply bindings on nested DOM element.
 * @param  {DomElement} node 
 * @api public
 */

Binding.prototype.apply = function(node) {
  this.applyBindings(node);

  //child nodes are elements and text
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes[i];
    this.apply(child);
  }
};

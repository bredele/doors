//thanks IE8
var indexOf = require('indexof');
var trim = require('trim');


/**
 * Expose 'interpolation'
 *
 * @param {String} str
 * @param {Object} model
 * @return {String} interpolation's result
 */

module.exports.text = function(text, model){
  //TODO: refactor with attrs
  return text.replace(/\{([^}]+)\}/g, function(_, expr){
    var value = model.get(trim(expr));
    return value ? value : '';
  });
};

module.exports.attrs = function(text, model){
  var exprs = [];
  text.replace(/\{([^}]+)\}/g, function(_, expr){
    var value = trim(expr);
    if(!~indexOf(exprs, value)) exprs.push(value);
  });
  return exprs;
};

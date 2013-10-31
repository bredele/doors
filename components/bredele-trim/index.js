
/**
 * Expose 'trim'
 * @param  {String} str
 * @api public
 */
module.exports = function(str){
  if(str.trim) return str.trim();
  return str.replace(/^\s*|\s*$/g, '');
};
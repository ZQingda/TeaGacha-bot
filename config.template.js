var exports = module.exports = {
  token: ""
}

exports.getPrefix = function () {
  return this.prefix || '$';
}

exports.setPrefix = function (prefix) {
  this.prefix = prefix;
  return this.prefix;
}
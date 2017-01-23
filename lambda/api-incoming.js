module.exports = {
  parseFunctionNameFromPath: function(uriPath) {
    if (uriPath[0] === '/') uriPath = uriPath.substr(1);
    return uriPath.split('/')[2];
  },
};

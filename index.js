var crypto = require('crypto');

module.exports = WebpackChunkHash;

function WebpackChunkHash(options)
{
  options = options || {};

  this.algorithm = options.algorithm || 'md5';
  this.digest = options.digest || 'hex';
}

WebpackChunkHash.prototype.apply = function(compiler)
{
  var _plugin = this;

  compiler.plugin('compilation', function(compilation)
  {
    compilation.plugin('chunk-hash', function(chunk, chunkHash)
    {
      var source = chunk.modules.map(getModuleSource).sort(sortById).reduce(concatenateSource, '')
        , hash   = crypto.createHash(_plugin.algorithm).update(source)
        ;

      chunkHash.digest = function(digest)
      {
        return hash.digest(digest || _plugin.digest);
      };
    });
  });
};

// helpers

function sortById(a, b)
{
  return a.id - b.id;
}

function getModuleSource(module)
{
  return {
    id    : module.id,
    source: (module._source || {})._value || ''
  };
}

function concatenateSource(result, module)
{
  return result + module.id + ':' + module.source;
}

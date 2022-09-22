const path = require('path');
const {
  override,
  babelInclude,
  disableEsLint,
  setWebpackStats
} = require('customize-cra');

module.exports = function (config, env) {
  return override(
    disableEsLint(),
    setWebpackStats('errors-only'),
    babelInclude([
      path.resolve('src')
    ])
  )(config, env);
}

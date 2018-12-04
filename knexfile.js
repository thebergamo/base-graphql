// Update with your config settings.
var config = require("./src/config");

console.log(config);

module.exports = {
  development: config.database,
  staging: config.database,
  production: config.database
};

const electronConfigs = require("./webpack.app.config.js");
const reactConfigs = require("./webpack.web.config.js");

module.exports = [electronConfigs, reactConfigs];

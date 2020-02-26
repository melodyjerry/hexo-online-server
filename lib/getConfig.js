var fs = require('fs');
var config=JSON.parse(fs.readFileSync(hexo.config.onlineConfigPath));
module.exports = config;
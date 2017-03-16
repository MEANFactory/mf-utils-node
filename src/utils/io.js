module.exports = {
    getFolders  : getFolders
};

var fs      = require('fs'),
    path    = require('path');

function getFolders(folderPath) {

    if (folderPath.indexOf('../') === 0 || folderPath.indexOf('./')) {
        folderPath = path.resolve(folderPath);
    }

    return fs.readdirSync(folderPath).filter(function(file) {
        return fs.statSync(path.join(folderPath, file)).isDirectory();
    });
}

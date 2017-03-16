module.exports = {
    getKey          : getKey,
    getOperation    : getOperation,
    getAuditFields  : getAuditFields
};

var numbers = require('./numbers');
var objects = require('./objects');

function getKey (schema, pathName) {

    var field   = schema.paths[pathName];
    var options = (field && field.options) ? field.options : {};

    var key;
    if (pathName === '_id') { key = 'id'; }
    else if (options && options.key) { key = options.key; }
    else if (options && options.name) { key = options.name; }
    else if (options && options.ref) { key = options.ref; }
    else { key = pathName; }

    if (key.indexOf('.') < 0 && key.trim().indexOf(' ') < 0) {
        return objects.toKey(key);
    } else {
        return key;
    }
}

function getOperation (schema, pathName, attributeName) {
    var field = schema.paths[pathName];
    if (!field || !field.options) { return null; }
    var setting = field.options[attributeName];
    if (typeof setting === 'undefined') { return null; }
    return numbers.parseOperation(setting);
}

function getAuditFields (schema) {

    var result = {};

    schema.eachPath(function(pathName, schemaType){

        var field   = schema.paths[pathName];
        var options = (field && field.options) ? field.options : {};

        switch (options.auditType) {
            case 'CREATED':
                result.created = field;
                break;
            case 'UPDATED':
                result.updated = field;
                break;
            case 'DELETED':
                result.deleted = field;
                break;
            case 'MEMBER':
                result.member = field;
                break;
            default:
                break;
        }
    });

    return result;

}

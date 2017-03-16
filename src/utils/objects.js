var _       = require('lodash'),
    arrays  = require('./arrays'),
    strings = require('./strings');

module.exports = {
    countDefined      : countDefined,
    setValue          : setValue,
    toKey             : toKey,
    toPath            : toPath,
    isDefined         : isDefined,
    ifDefined         : ifDefined,
    isNull            : isNull,
    isValid           : isValid,
    isValidPath       : isValidPath,
    isValidKey        : isValidKey,
    isUndefined       : isUndefined,
    ifUndefined       : ifUndefined,
    getId             : getId,
    getValueFromPath  : getValueFromPath,
    getValue          : getValue,
    getValues         : getValues,
    omit              : omit,
    merge             : merge
};


function isDefined (value) {
    return (typeof value !== 'undefined');
}
function ifDefined (value, defaultValue) {
    return isDefined(value) ? value : defaultValue;
}
function countDefined (values) {
    if (!(values instanceof Array)) { return -1; }
    var count = 0;
    values.forEach(function(value){
       if (isDefined(value)){ count++; }
    });
    return count;
}




function isNull (value) {
    return (value === null);
}





function isUndefined (value) {
    return (typeof value === 'undefined');
}
function ifUndefined (value, defaultValue) {
    return isUndefined(value) ? defaultValue : value;
}

function isValidKey (value) {
    value = value || '';
    return (value.trim().length > 0 &&
        strings.isValid(value, strings.ALPHANUMERIC + '_- ', false) &&
        ([' ', '-'].indexOf(value[0]) < 0) &&
        ([' ', '-'].indexOf(value[value.length - 1]) < 0));
}

function toKey (value) {
    if (strings.isLowerCase(value)) { return value.trim(); }
    if (strings.isUpperCase(value)) { return value.trim().toLowerCase(); }
    return strings.toCamelCase(value || '');
}

function setValue (obj, path, value) {

    var keys, key;

    if (!path || !path.length || Object.prototype.toString.call(path) !== '[object String]') {
        return false;
    }

    if (obj !== Object(obj)) { obj = {}; }

    var delimeter = (path.indexOf('.') < 0 && path.trim().indexOf(' ') > 0) ? ' ' : '.';

    keys = path.split(delimeter);
    while (keys.length > 1) {
        key = toKey(keys.shift());
        if (obj !== Object(obj)) { obj = {}; }
        if (!(key in obj)) {
            obj[key] = {};
        }
        obj = obj[key];
    }
    obj[toKey(keys[0])] = value;
    return obj;
}

function toPath (value) {
    if (typeof value !== 'string') { return null; }
    value = value.trim();
    if (value.length < 1) { return null; }
    var delim = (value.trim().indexOf('.') > 0) ? '.' : ' ';
    var parts = value.split(delim).filter(function(part){
        return isValidKey(part);
    });
    return parts.join('.');
}
function isValidPath (value) {
    var path = toPath(value);
    return (path && path.length > 0);
}

function getValues (objects, key) {
    var result = [];
    key = key || '';
    if (typeof key !== 'string' || key.length < 1) { return undefined; }
    [].concat(objects).filter(function(o){
        return (typeof o === 'object' &&
                o != null &&
                !(o instanceof Array) &&
                o.hasOwnProperty(key));
    }).forEach(function(o){
        if (result.indexOf(o[key]) < 0) { result.push(o[key]); }
    });
    return result;
}
function getValue (obj, key) {
    var values = getValues(obj, key);
    return (arrays.count(values) === 1) ? values[0] : undefined;
}

function isValid (obj, strict) {
    if (strict === false) {
        return (typeof obj === 'object');
    } else {
        return (typeof obj === 'object' &&
                !(obj instanceof Array) &&
                !(obj instanceof Boolean) &&
                !(obj instanceof Number) &&
                !(obj instanceof String));
    }
}

function getValueFromPath(obj, path) {

    var parts = (path || '').split('.');
    if (parts.length < 1 || (parts === 1 && parts[0].length < 1)) { return undefined; }

    var current = obj || {};

    for (var i = 0; i < parts.length; i += 1) {
        if (!isValid(current) || !current.hasOwnProperty(parts[i])) {
            return undefined;
        } else {
            current = current[parts[i]];
        }
    }
    return current;
}

function omit (itemOrArray, fieldOrFields) {

    var items   = [].concat(itemOrArray);
    var fields  = [].concat(fieldOrFields || []);

    for (var i = 0; i < items.length; i += 1) {

        items[i] = _.omit(items[i], fields);

        var keys = Object.keys(items[i]);
        for (var k = 0; k < (keys || []).length; k += 1) {
            var key = keys[k];
            if (typeof items[i][key] === 'object') {
                items[i][key] = omit(items[i][key], fields);
            }
        }

    }

    return Array.isArray(itemOrArray) ? items : (items.length > 0 ? items[0] : null);
}

function merge(target, source) {

    target = target || {};
    source = source || {};

    if (!isValid(target, true) || !isValid(source, true)) {
        return undefined;
    }

    var keys = Object.keys(source);
    for (var k = 0; k < (keys || []).length; k += 1) {

        var key = keys[k];

        if (!isDefined(source[key]) && !isDefined(target[key])) {
            target[key] = undefined;
            continue;
        }

        if (!isDefined(source[key])) { continue; }

        if (!isDefined(target[key]) || isNull(target[key])) {
            target[key] = JSON.parse(JSON.stringify(source[key]));
            continue;
        }

        if (arrays.isArray(target[key]) && arrays.isArray(source[key])) {
            target[key] = JSON.parse(JSON.stringify(arrays.merge(target[key], source[key])));
            continue;
        }

        if (isValid(target[key], true) && isValid(source[key], true)) {
            target[key] = merge(target[key], source[key]);
            continue;
        }

        target[key] = target[key] || source[key];
    }

  return target;
}

function getId (item) {
    if (isUndefined(item)) { return item; }
    if (isValid(item)) {
        return item['_id'] || item.id;
    }
    return strings.isValid(item) ? item : undefined;
}

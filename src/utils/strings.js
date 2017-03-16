var ALPHA         = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var DIGITS        = '0123456789';
var ALPHANUMERIC  = ALPHA + DIGITS;

module.exports = {
    ALPHA           : ALPHA,
    DIGITS          : DIGITS,
    ALPHANUMERIC    : ALPHANUMERIC,
    clean           : clean,
    cleanDigits     : cleanDigits,
    cleanAlphanumeric : cleanAlphanumeric,
    cleanVersion    : cleanVersion,
    isLowerCase     : isLowerCase,
    isUpperCase     : isUpperCase,
    toCamelCase     : toCamelCase,
    unique          : unique,
    isValid         : isValid,
    ifValid         : ifValid,
    isAlpha         : isAlpha,
    isDigits        : isDigits,
    isAlphanumeric  : isAlphanumeric,
    trim            : trim,
    unDouble        : unDouble
};

function clean (value, validChars, isCaseSensitive) {
    if (typeof isCaseSensitive === 'undefined') { isCaseSensitive = false; }
    return (value || '').toString().split('').filter(function(c){
        return ((isCaseSensitive && validChars.indexOf(c) >= 0) ||
                (!isCaseSensitive && validChars.toUpperCase().indexOf(c.toUpperCase()) >= 0));
    }).join('');
}
function cleanDigits (value) {
    return clean(value, DIGITS);
}
function cleanAlphanumeric (value) {
    return clean(value, ALPHA + ALPHANUMERIC);
}
function cleanVersion (value, tail) {
    tail = (typeof tail === 'undefined' || tail === null || tail) ? true : false;
    value = (value || '').split('').filter(function(c){
        return ((DIGITS + '.').indexOf(c) >= 0);
    }).join('');
    if (tail && value.length > 1 && value.split('')[value.length - 1] === '.') { return value; }
    if (value.indexOf('.') >= 0) {
        value = value.split('.').filter(function(part){
            return (part.length > 0);
        }).join('.');
    }
    return value;
}

function isUpperCase (value) {
    var test = (value || '').toUpperCase();
    return (test === value);
}

function isLowerCase (value) {
    var test = (value || '').toLowerCase();
    return (test === value);
}

function toCamelCase (value) {
    return value.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    }).replace(/\s+/g, '');
}

function isValid (value, chars, isCaseSensitive) {
    if (!value ||
        !value.length ||
        Object.prototype.toString.call(value) !== '[object String]') {
        return false;
    }
    if (typeof chars === 'string' && chars.length > 0) {
        var _value = (!!isCaseSensitive) ? value : value.toLowerCase();
        var _chars = (!!isCaseSensitive) ? chars : chars.toLowerCase();
        for (var i = 0; i < _value.length; i += 1) {
            if (_chars.indexOf(_value[i]) < 0) { return false; }
        }
        return true;
    } else {
        return (value.trim().length > 0);
    }
}
function ifValid (value, defaultValue) {
    return isValid(value) ? value : defaultValue;
}

function isAlpha (value) {
    return isValid(value, ALPHA, false);
}
function isDigits (value) {
    return isValid(value, DIGITS);
}
function isAlphanumeric (value) {
    return isValid(value, ALPHANUMERIC, false);
}

function unDouble (value) {
    var chars = (value || '').toUpperCase().split('').filter(function(c){
        return (ALPHANUMERIC.indexOf(c) < 0);
    });
    if (chars.length < 1) { return value; }
    chars.forEach(function(c){
        var target = [c, c].join('');
        while (value.indexOf(target) >= 0) {
            value = value.replace(target, c);
        }
    });
    return value;
}

function unique (values) {
    var result = [];
    [].concat(values).filter(function(v){
        return (typeof v === 'string' && v.trim().length > 0);
    }).forEach(function(value){
        if (result.indexOf(value) < 0) { result.push(value); }
    });
    return result;
}

function trim(value) {
    return ifValid(value) ? value.trim() : undefined;
}

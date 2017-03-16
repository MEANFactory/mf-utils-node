module.exports = {
    isValid     : isValid,
    ifValid     : ifValid,
    toBoolean   : toBoolean
};

function isValid (value, strict) {
    if (typeof strict === 'undefined') { strict = true; }
    if (strict) {
        return (typeof value === 'boolean');
    } else if (typeof value === 'string') {
        return (['true', 'false', '1', '0', 'on', 'off', 'yes', 'no'].indexOf(value.toLowerCase()) >= 0);
    } else if (typeof value === 'number') {
        return ([1, 0, -1].indexOf(value) >= 0);
    } else {
        return !!value;
    }
}

function toBoolean (value, strict) {
    if (!isValid(value, strict)) { return undefined; }
    if (strict) {
        return value;
    } else if (typeof value === 'string' && ['true', '1', '-1', 'on', 'yes'].indexOf(value.toLowerCase()) >= 0) {
        return true;
    } else if (typeof value === 'string' && ['false', '0', 'off', 'no'].indexOf(value.toLowerCase()) >= 0) {
        return false;
    } else if (typeof value === 'number' && value === 0) {
        return false;
    } else if (typeof value === 'number' && (value === 1 || value === -1)) {
        return true;
    } else {
        return !!value;
    }
}

function ifValid (value, strict, defaultValue) {
    var _strict;
    var _default;
    if (typeof defaultValue === 'undefined') {
        _default = strict;
    } else {
        _strict = strict;
        _default = defaultValue;
    }
    return isValid(value, _strict) ? value : _default;
}

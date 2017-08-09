var objects = require('./objects'),
    strings = require('./strings');

module.exports = {
    getOperationText    : getOperationText,
    isDigits            : strings.isDigits,
    isNumber            : isNumber,
    isSymbol            : isSymbol,
    isValidOperation    : isValidOperation,
    parseOperation      : parseOperation,

    fromBase36  : fromBase36,
    toBase36    : toBase36,
    nextBase36  : nextBase36
};

function isSymbol (value) {
    if (!strings.isValid(value)) { return false; }
    return (['>', '<', '=', '==', '===', '<=', '>='].indexOf(value) >= 0);
}
function isNumber (value) {
    return (!isNaN(parseFloat(value)) && isFinite(value));
}

function getOperationText (operation) {
    operation = operation || {};
    switch (operation.operation) {
        case '>':
            return 'greater than';
        case '>=':
            return 'greater than or equal to';
        case '<':
            return 'less than';
        case '<=':
            return 'less than or equal to';
        case '===':
            return 'equal to';
        default:
            return null;
    }
}

function parseOperation (value) {

    if (typeof value === 'string') {

        var parts = value.split(' ').filter(function(v){
            return (isSymbol(v) || strings.isDigits(v));
        });

        if (parts.length === 1 && strings.isDigits(parts[0])) {
            return {
                operation   : '===',
                right       : parseInt(parts[0])
            };
        }

        if (parts.length === 2 && isSymbol(parts[0]) && strings.isDigits(parts[1])) {
            return {
                operation   : parts[0],
                right       : parseInt(parts[1])
            };
        }

        if (parts.length === 3 && strings.isDigits(parts[0]) && isSymbol(parts[1]) && strings.isDigits(parts[2])) {
            return {
                left        : parseInt(parts[0]),
                operation   : parts[1],
                right       : parseInt(parts[2]),
            };
        }

        return null;
    }

    if (typeof value === 'number' && isNumber(value)) {
        return {
            operation   : '===',
            right       : parseInt(value)
        };
    }

    return null;
}

function isValidOperation (value, isLeftRequired) {
    var opr = parseOperation(value);
    if (!opr) { return false; }
    if (isLeftRequired && objects.isUndefined(opr.left)) { return false; }
    return (!objects.isUndefined(opr.operation) && isNumber(opr.right));
}

function fromBase36(value){
    if (typeof value !== 'string'){ return undefined; }
    var result;
    try {
        result = parseInt(value, 36);
    } catch (ex) {
        return undefined;
    }
    return result;
}
function toBase36(value){
    if (typeof value === 'number') {
        if (!Number.isInteger(value)) { return undefined; }
    } else if (typeof value === 'string') {
        if (!strings.isDigits(value)) { return undefined; }
    } else {
        return undefined;
    }
    value = (typeof value === 'number') ? value : parseInt(value);
    return value.toString(36);
}
function nextBase36(value){
    if (typeof value === 'number') {
        if (!Number.isInteger(value)) { return undefined; }
    } else if (typeof value === 'string') {
        if (!strings.isDigits(value)) { return undefined; }
    } else if (typeof value === 'undefined') {
        value = -1;
    } else {
        return undefined;
    }
    value = (typeof value === 'number') ? value : parseInt(value);
    value++;
    value.toString(36);
}

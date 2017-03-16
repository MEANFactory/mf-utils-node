'use strict';

module.exports = {
    createCode  : createCode,
    createSalt  : createSalt,
    hash        : hash,
};

var crypto  = require('crypto');
var strings = require('./strings');

var SALT_OPTION = 'base64';
var HMAC_OPTION = 'sha1';
var DIGEST_OPTION = 'hex';

function createCode(totalLength, chars) {
    chars = chars || strings.ALPHANUMERIC;
    var rnd = crypto.randomBytes(totalLength),
        value = new Array(totalLength),
        len = chars.length;

    for (var i = 0; i < totalLength; i+=1) {
        value[i] = chars[rnd[i] % len];
    }

    return value.join('');
}

function createSalt(byteCount) {
    return crypto.randomBytes(byteCount).toString(SALT_OPTION);
}

function hash(value, salt) {
    var hmac = crypto.createHmac(HMAC_OPTION, salt);
    return hmac.update(value).digest(DIGEST_OPTION);
}

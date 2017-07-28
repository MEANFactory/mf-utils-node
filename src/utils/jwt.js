/*jslint node: true */
/* jshint -W106 */

'use strict';

module.exports = {

    isValidPayload  : legacy_isValidPayload,
    fromPayload     : legacy_fromPayload,
    fromToken       : legacy_fromToken,
    toPayload       : legacy_toPayload,
    toToken         : legacy_toToken,

    token: {
        encode      : token_encode,
        decode      : token_decode,
        fromData    : token_fromData,
        fromPayload : token_fromPayload,
        fromValues  : legacy_toToken,
        isValid     : token_isValid,
        toData      : token_toData,
        toPayload   : token_toPayload,
        validate    : token_validate,
        verify      : token_verify,
    },
    payload: {
        encode      : token_fromPayload,
        fromToken   : token_toPayload,
        fromData    : data_toPayload,
        fromValues  : values_toPayload,
        isValid     : payload_isValid,
        toToken     : token_fromPayload,
        toData      : payload_toData,
        validate    : payload_validate
    },
    data: {
        encode      : token_fromData,
        fromToken   : token_toData,
        fromPayload : payload_toData,
        isValid     : data_isValid,
        toToken     : token_fromData,
        toPayload   : data_toPayload,
        validate    : data_validate,
    },
    values: {
        parseDate   : values_parseDate,
        toPayload   : values_toPayload,
        toData      : values_toData
    }
};

var dates   = require('./dates'),
    jwt     = require('jsonwebtoken'),
    moment  = require('moment'),
    strings = require('./strings');

// LEGACY --------------------------------------------------------------
function legacy_isValidPayload(payload){
    return payload_isValid(payload, true);
}
function legacy_fromPayload(payload){
    return payload_toData(payload, false);
}
function legacy_fromToken(token, secret){
    var decoded = token_decode(token, secret);
    if (!decoded || !decoded.payload) { return null; }
    return legacy_fromPayload(decoded.payload);
}
function legacy_toPayload(userId, accountId, sessionId, createdDate, expiryDate){
    return values_toPayload(userId, accountId, sessionId, createdDate, expiryDate);
}
function legacy_toToken(userId, accountId, sessionId, createdDate, expiryDate, secret){
    var payload = legacy_toPayload(userId, accountId, sessionId, createdDate, expiryDate);
    return token_fromPayload(payload, secret);
}


// TOKEN ---------------------------------------------------------------
function token_validate (value, allowExpired) {
    if (typeof value === 'undefined') { return 'No token supplied'; }
    if (!strings.isValid(value)) { return 'Invalid token format'; }
    var payload = token_toPayload(value);
    if (!payload) { return 'Invalid token supplied'; }
    return payload_validate(payload, allowExpired);
}
function token_isValid (value, allowExpired) {
    return (typeof token_validate(value, allowExpired) === 'undefined');
}
function token_decode (value) {
    var decoded;
    try {
        decoded = jwt.decode(value, { complete: true });
    } catch (e) {
    }
    return decoded;
}
function token_toPayload (value) {
    return (token_decode(value) || {}).payload;
}
function token_toData (value) {
    var payload = token_toPayload(value);
    return payload_toData(payload);
}
function token_verify (value, secretOrPublicKey, options){
    var decoded;
    try {
        decoded = jwt.verify(value, secretOrPublicKey, options);
    } catch (e) {
        return false;
    }
    return (typeof decoded !== 'undefined');
}
function token_encode(value, secretOrPrivateKey, options, throwError){
    try {
        var result = jwt.sign(value, secretOrPrivateKey, options);
        return result;
    } catch (err) {
        if (throwError) { throw err; }
        else { return undefined; }
    }
}
function token_fromData(data, secretOrPrivateKey) {
    if (!data_isValid(data)) { return undefined; }
    var payload = data_toPayload(data);
    return token_encode(payload, secretOrPrivateKey);
}
function token_fromPayload(payload, secretOrPrivateKey) {
    if (!payload_isValid(payload)) { return undefined; }
    return token_encode(payload, secretOrPrivateKey);
}



// PAYLOAD -------------------------------------------------------------
function payload_validate (value, allowExpired) {
    allowExpired = (allowExpired === true || allowExpired === false) ? allowExpired : false;
    if (typeof value === 'undefined') { return 'No payload supplied'; }
    if (typeof value !== 'object' || (value instanceof Array)) { return 'Invalid payload supplied'; }
    if (!strings.isValid(value.sub)) { return 'Missing User ID'; }
    if (value.aid && !strings.isValid(value.aid)) { return 'Invalid Account ID'; }
    if (!strings.isValid(value.iss)) { return 'Invalid Session ID'; }
    if (typeof value.ait === 'undefined') { return 'Missing Created Date'; }
    if (!dates.isUnixDateStamp(value.iat)) { return 'Invalid Created Date'; }
    if (typeof value.exp === 'undefined') { return 'Missing Expiry Date'; }
    if (!dates.isUnixDateStamp(value.exp)) { return 'Invalid Expiry Date'; }
    if (!allowExpired && (new Date()) >= (new Date(value.exp * 1000))) { return 'Expired'; }
    return undefined;
}
function payload_isValid (value, allowExpired) {
    return (typeof payload_isValid(value, allowExpired) === 'undefined');
}
function payload_toData (payload, strict) {
    if (typeof payload === 'undefined') { return undefined; }
    if (typeof payload !== 'object' || (payload instanceof Array)) { return undefined; }
    strict = (strict === true || strict === false) ? strict : false;
    if (strict && !payload_isValid(payload)) { return undefined; }
    return {
        userId      : strings.ifValid(payload.sub, undefined),
        accountId   : strings.ifValid(payload.aid, undefined),
        sessionId   : strings.ifValid(payload.iss, undefined),
        createdDate : dates.isUnixDateStamp(payload.iat) ? new Date(payload.iat * 1000) : undefined,
        expiryDate  : dates.isUnixDateStamp(payload.exp) ? new Date(payload.exp * 1000) : undefined,
    };
}

// DATA ----------------------------------------------------------------
function data_validate (data, allowExpired) {
    allowExpired = (allowExpired === true || allowExpired === false) ? allowExpired : false;
    if (!strings.isValid(data.userId)) { return 'Missing User ID'; }
    if (data.accountId && !strings.isValid(data.accountId)) { return 'Invalid Account ID'; }
    if (!strings.isValid(data.sessionId)) { return 'Invalid Session ID'; }
    if (typeof data.createdDate === 'undefined') { return 'Missing Created Date'; }
    if (!(data.createdDate instanceof Date)) { return 'Invalid Created Date'; }
    if (typeof data.expiryDate === 'undefined') { return 'Missing Expiry Date'; }
    if (!(data.expiryDate instanceof Date)) { return 'Invalid Expiry Date'; }
    if (!allowExpired && data.expiryDate <= (new Date())) { return 'Expired'; }
    return undefined;
}
function data_isValid (item, allowExpired) {
    return (typeof data_validate(item, allowExpired) === 'undefined');
}
function data_toPayload (data, strict) {
    if (typeof data === 'undefined') { return undefined; }
    if (typeof data !== 'object' || (data instanceof Array)) { return undefined; }
    strict = (strict === true || strict === false) ? strict : false;
    if (strict && !data_isValid(data)) { return undefined; }
    return {
        sub   : strings.ifValid(data.userId, undefined),
        aid   : strings.ifValid(data.accountId, undefined),
        iss   : strings.ifValid(data.sessionId, undefined),
        iat   : dates.toUnixDateStamp(data.createdDate),
        exp   : dates.toUnixDateStamp(data.expiryDate)
    };
}

// VALUES --------------------------------------------------------------
function values_parseDate(value){
    if (typeof value === 'undefined') { return undefined; }
    if (value instanceof Date) { return value; }
    if (dates.isUnixDateStamp(value)){ return (new Date(value * 1000)); }
    return undefined;
}
function values_toData(userId, accountId, sessionId, createdDate, expiryDate){
    return {
        userId      : strings.ifValid(userId, undefined),
        accountId   : strings.ifValid(accountId, undefined),
        sessionId   : strings.ifValid(sessionId, undefined),
        createdDate : values_parseDate(createdDate),
        expiryDate  : values_parseDate(expiryDate)
    };
}
function values_toPayload(userId, accountId, sessionId, createdDate, expiryDate){
    return {
        sub : strings.ifValid(userId, undefined),
        aid : strings.ifValid(accountId, undefined),
        iss : strings.ifValid(sessionId, undefined),
        iat : (values_parseDate(createdDate)) ? moment(values_parseDate(createdDate)) : undefined,
        exp : (values_parseDate(expiryDate)) ? moment(values_parseDate(expiryDate)) : undefined
    };
}




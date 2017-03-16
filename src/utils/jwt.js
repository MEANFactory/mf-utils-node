/*jslint node: true */
'use strict';

module.exports = {
    isValidPayload  : isValidPayload,
    fromPayload     : fromPayload,
    fromToken       : fromToken,
    toPayload       : toPayload,
    toToken         : toToken
};

var dates   = require('./dates'),
    jwt     = require('jwt-simple'),
    moment  = require('moment'),
    strings = require('./strings');

function isValidPayload (item) {
    return (
        item &&
        (typeof item === 'object') &&
        (!(item instanceof Array)) &&
        strings.isValid(item.userId) &&
        (!item.accountId || strings.isValid(item.accountId)) &&
        strings.isValid(item.sessionId) &&
        item.createdDate && (item.createdDate instanceof Date) &&
        item.expiryDate && (item.expiryDate instanceof Date)
    );
}

function fromPayload (payload) {

    payload = payload || {};

    var data = {
        userId      : strings.ifValid(payload.sub, undefined),
        accountId   : strings.ifValid(payload.aid, undefined),
        sessionId   : strings.ifValid(payload.iss, undefined),
        createdDate : dates.isUnixDateStamp(payload.iat) ? new Date(payload.iat * 1000) : undefined,
        expiryDate  : dates.isUnixDateStamp(payload.exp) ? new Date(payload.exp * 1000) : undefined,
    };

    return data;
}

function toPayload (userId, accountId, sessionId, createdDate, expiryDate) {

    userId      = strings.ifValid(userId, undefined);
    accountId   = strings.ifValid(accountId, undefined);
    sessionId   = strings.ifValid(sessionId, undefined);
    createdDate = (typeof createdDate === 'object' && (createdDate instanceof Date)) ? createdDate : undefined;
    expiryDate  = (typeof expiryDate === 'object' && (expiryDate instanceof Date)) ? expiryDate : undefined;

    var payload = {};

    if (userId) { payload.sub = userId; }
    if (accountId) { payload.aid = accountId; }
    if (sessionId) { payload.iss = sessionId; }
    if (createdDate) { payload.iat = moment(createdDate).unix(); }
    if (expiryDate) { payload.exp = moment(expiryDate).unix(); }

    return payload;
}

function fromToken (token, secret) {
    try {
        var payload = jwt.decode(token, secret);
        return fromPayload(payload);
    } catch (e) {
        return null;
    }
}

function toToken (userId, accountId, sessionId, createdDate, expiryDate, secret) {
    return jwt.encode(toPayload(userId, accountId, sessionId, createdDate, expiryDate), secret);
}

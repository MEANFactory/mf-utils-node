/**
 * Created by MEAN Factory on 2/19/16.
 */

/*jslint node: true */
'use strict';

var email       = require('email-addresses'),
    gravatar    = require('gravatar'),
    strings     = require('./strings');

var me = {
    isValid: isValid,
    isValidText: isValidText,
    isValidLocalPart: isValidLocalPart,
    isValidDomainName: isValidDomainName,
    getLocalPart: getLocalPart,
    getDomainName: getDomainName,
    getText: getText,

    toGravatarUrl: toGravatarUrl
};

function isValid(value) {
    if (!strings.isValid(value)) { return false; }
    var address;
    try { address = email.parseOneAddress(value); }
    catch (err) { return false; }
    return (address && address.local && address.domain);
}

function isValidText(value) {
    if (!strings.isValid(value)) { return false; }
    var address;
    try { address = email.parseOneAddress(value); }
    catch (err) { return false; }
    return (address && (value.toLowerCase() === address.local + '@' + address.domain));
}

function isValidLocalPart(value) {
    if (!strings.isValid(value)) { return false; }
    var address;
    try { address = email.parseOneAddress(value.toLowerCase() + '@test.com'); }
    catch (err) { return false; }
    return (address && (value.toLowerCase() === address.local));
}

function isValidDomainName(value) {
    if (!strings.isValid(value)) { return false; }
    var address;
    try { address = email.parseOneAddress('test@' + value.toLowerCase()); }
    catch (err) { return false; }
    return (address && (value.toLowerCase() === address.domain));
}

function getText(address) {
    return isValid(address) ? (address.local + '@' + address.domain) : undefined;
}

function getLocalPart(address) {
    return isValid(address) ? address.local : undefined;
}

function getDomainName(address) {
    return isValid(address) ? address.domain : undefined;
}

function toGravatarUrl(value, options, protocol) {
    if (!isValidText(value)) { return null; }
    return gravatar.url(value, options, protocol);
}

module.exports = me;

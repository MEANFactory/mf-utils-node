/*jslint node: true */
'use strict';

var moment = require('moment'),
    numbers = require('./numbers'),
    strings = require('./strings');

var minDate = new Date(1900, 0, 1);

module.exports = {

    MIN: minDate,

    add : add,
    subtract : subtract,

    isDate: isDate,
    isDateOrNull: isDateOrNull,
    isUnixDateStamp: isUnixDateStamp,
    isUnixDateStampOrNull: isUnixDateStampOrNull,
    isValidMomentDuration: isValidMomentDuration,

    isValid: isValid,
    isLeapYear: isLeapYear,

    toUnixDateStamp : toUnixDateStamp

};

function add (value, quantity, duration) {
    return moment(value).add(quantity, duration).toDate();
}
function subtract (value, quantity, duration) {
    return moment(value).subtract(quantity, duration).toDate();
}

function isDate(value) {
	return moment(value).isValid();
}
function isDateOrNull(value) {
	return (value === null || isDate(value));
}

function isUnixDateStamp(value) {
	return numbers.isNumber(value) && moment.unix(value).isValid();
}
function isUnixDateStampOrNull(value) {
	return (value == null || isUnixDateStamp(value));
}

function isValidMomentDuration(quantity, duration) {
    if (!strings.isValidString(duration) || !numbers.isValid(quantity)) { return false; }
    return (!(moment().add(quantity, duration))) ? true : false;
}

function isValid (year, month, day) {
    if (isNaN(year) || isNaN(month) || isNaN(day)) { return false; }
    return moment([year, month, day]).isValid();
}

function isLeapYear (year) {
    if (isNaN(year)) { return false; }
    return moment(year, 1, 29).isValid();
}

function toUnixDateStamp(value){
    return isDate(value) ? moment(value).unix() : undefined;
}

/**
 * Created by MEAN Factory on 2/27/16.
 */

'use strict';

var constants = require('./constants'),
    objects   = require('./objects');

var me = {};
me = objects.merge(me, constants.http.status.response);
me = objects.merge(me, constants.http.status.success);
me = objects.merge(me, constants.http.status.redirected);
me = objects.merge(me, constants.http.status.incomplete);
me = objects.merge(me, constants.http.status.errors);

function ApiError (message, status, context) {

    this.name = 'ApiError';

    this.message = message || '';
    this.status  = status || constants.http.status.errors.INTERNAL_SERVER_ERROR;

    Error.captureStackTrace(this, ( context || ApiError ));
}
require('util').inherits(ApiError, Error);

function init (errorOrMessage, status) {

    errorOrMessage = errorOrMessage || '';

    var message = (typeof errorOrMessage === 'string') ? errorOrMessage : errorOrMessage.message;

    return (new ApiError(message, status, init));
}

me.init = init;
me.ApiError = ApiError;

module.exports = me;

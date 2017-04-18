var levels = {
  NONE  : { value: 0,  name: 'None' },
  GUEST : { value: 10, name: 'Guest' },
  USER  : { value: 20, name: 'User' },
  ADMIN : { value: 30, name: 'Admin' },
  OWNER : { value: 40, name: 'Owner' },
  SYSTEM: { value: 50, name: 'System' }
};

var rules = {};
var ops = [
  { key: 'LESS_THAN', alt: 'LT', text: '<' },
  { key: 'GREATER_THAN', alt: 'GT', text: '>' },
  { key: 'LESS_THAN_OR_EQUALS', alt: 'LTE', text: '<=' },
  { key: 'GREATER_THAN_OR_EQUALS', alt: 'GTE', text: '>=' },
  { key: 'EQUALS', alt: 'EQ', text: '>=' },
];
Object.keys(levels).forEach(function(levelKey){
  var level = levels[levelKey];
  ops.forEach(function(op){
    rules[op.key + '_' + levelKey] = op.text + ' ' + level.value;
    rules[op.alt + '_' + levelKey] = op.text + ' ' + level.value;
  });
});

var httpStatusCodes = {
    response: {
        INFO: 100,
        SWITCHING_PROTOCOLS: 101
    },
    success: {
        OK: 200,
        CREATED: 201,
        ACCEPTED: 202,
        NON_AUTHORITIVE_INFORMATION: 203,
        NO_CONTENT: 204,
        RESET_CONTENT: 205,
        PARTIAL_CONTENT: 206
    },
    redirected: {
        MULTIPLE_CHOICES: 300,
        MOVED_PERMANENTLY: 301,
        MOVED_TEMPORARILY: 302,
        SEE_OTHER: 303,
        NOT_MODIFIED: 304,
        USE_PROXY: 305,
        TEMPORARY_REDIRECT: 307
    },
    incomplete: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAYMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        NOT_ACCEPTABLE: 406,
        PROXY_AUTHENTICATION_REQUIRED: 407,
        REQUEST_TIMEOUT: 408,
        CONFLICT: 409,
        GONE: 410,
        LENGTH_REQUIRED: 411,
        PRECONDITION_FAILED: 412,
        REQUEST_ENTITY_TOO_LARGE: 413,
        REQUEST_URI_TOO_LONG: 414,
        UNSUPPORTED_MEDIA_TYPE: 415,
        EXCEPTION_FAILED: 417
    },
    errors: {
        INTERNAL_SERVER_ERROR: 500,
        NOT_IMPLEMENTED: 501,
        BAD_GATEWAY: 502,
        SERVICE_UNAVAILABLE: 503,
        GATEWAY_TIMEOUT: 504,
        HTTP_VERSION_NOT_SUPPORTED: 505
    }
};

module.exports = {
  http: {
      status: httpStatusCodes
  },
  plugins: {
      dto: {
        levels: levels,
        rules : rules
      }
  }
};

/* jshint -W106 */

var request = require('request');

var ACCESS_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token';
var PEOPLE_API_URL = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

module.exports.getProfile = function (code, clientId, secret, redirectUri, done) {

    var params = {
        json : true,
        form : {
            code: code,
            client_id: clientId,
            client_secret: secret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }
    };

    request.post(ACCESS_TOKEN_URL, params, function(err, response, token){

        params = {
            url     : PEOPLE_API_URL,
            headers : { Authorization: 'Bearer ' + token.access_token },
            json    : true
        };

        request.get(params, function(err, response, profile){
            if (profile.error) {
                return done(profile.error.message);
            }

            return done(profile);
        });
    });
};

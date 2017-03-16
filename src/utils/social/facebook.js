/* jshint -W101 */
/* jshint -W106 */

var arrays = require('../arrays'),
    request = require('request');

var PROFILE_FIELDS = ['id', 'about', 'age_range', 'bio', 'birthday',
    'cover', 'devices', 'education', 'email',
    'favorite_athletes', 'favorite_teams', 'first_name', 'gender', 'hometown',
    'inspirational_people', 'interested_in',
    'is_verified', 'languages', 'last_name',
    'link', 'locale', 'location', 'meeting_for', 'middle_name', 'name',
    'name_format', 'political',
    'public_key', 'quotes', 'relationship_status', 'religion',
    'significant_other', 'sports', 'third_party_id', 'timezone',
    'verified',
    'website', 'work'];

// 'page_scoped_id'
// App must be associated with business: 'token_for_business',
// API must be v2.6 or higher 'admin_notes', 'labels',
// noise: 'payment_pricepoints', 'context', 'currency', 'install_type', 'installed', 'is_shared_login', 'security_settings', 'shared_login_upgrade_required_by', 'test_group',  'video_upload_limits', 'viewer_can_send_gift', 'updated_time',

var EDGE_FIELDS = ['accounts', 'achievements', 'adaccountgroups', 'adaccounts',
    'adcontracts', 'admined_groups', 'adnetworkanalytics', 'albums',
    'apprequestformerrecipients', 'apprequests', 'books', 'business_activities',
    'domains', 'events', 'family', 'favorite_requests', 'friendlists',
    'friends', 'games', 'groups', 'ids_for_business', 'invitable_friends',
    'leadgen_forms', 'likes', 'live_videos', 'movies', 'music', 'objects',
    'permissions', 'personal_ad_accounts', 'photos', 'picture',
    'promotable_domains', 'promotable_events', 'request_history',
    'session_keys', 'stream_filters', 'taggable_friends', 'tagged_places',
    'television', 'video_broadcasts', 'videos', 'checkins', 'feed',
    'friendrequests', 'home', 'inbox', 'locations', 'mutualfriends',
    'notifications', 'outbox', 'questions', 'scores', 'subscribers',
    'subscribedto'];

var ALL_FIELDS = [].concat(PROFILE_FIELDS, EDGE_FIELDS);
var BASIC_FIELDS = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];

var ACCESS_TOKEN_URL = 'https://graph.facebook.com/v2.5/oauth/access_token';
var GRAPH_API_URL = 'https://graph.facebook.com/v2.5/me?fields=';

module.exports = {
    getProfile      : getProfile,
    PROFILE_FIELDS  : PROFILE_FIELDS,
    EDGE_FIELDS     : EDGE_FIELDS,
    ALL_FIELDS      : ALL_FIELDS,
    BASIC_FIELDS    : BASIC_FIELDS
};

function getProfile (code, clientId, secret, redirectUri, fields, done) {

    if (typeof done === 'undefined' && typeof fields === 'function') {
        done = fields;
        fields = BASIC_FIELDS;
    }
    fields = arrays.isValid(fields) ? fields : BASIC_FIELDS;

    var params = {
        url: ACCESS_TOKEN_URL,
        qs: {
            code: code,
            client_id: clientId,
            client_secret: secret,
            redirect_uri: redirectUri
        },
        json: true
    };

    request.get(params, function(err, response, accessToken) {

        if (response.statusCode !== 200) {
            return done(accessToken.error.message);
        }

        params = {
            url: GRAPH_API_URL + fields.join(','),
            qs: accessToken,
            json: true
        };

        request.get(params, function(err, response, profile) {
            if (response.statusCode !== 200) {
                return done(profile.error.message);
            }

            return done(null, profile);
        });
    });
}

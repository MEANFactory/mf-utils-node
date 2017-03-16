/* jshint -W101 */

var $           = require('../../../../src/utils'),
    enums       = require('../enums'),
    mongoose    = require('mongoose');

var personSchema = require('./person.model');

var familySchema = mongoose.Schema({

    _id : { type: String, name: 'ID', default: $.uuids.init },

    s   : { type: String, name: 'Sur Name', key: 'surname', required: true, trim: true },
    m   : [ personSchema ]
});

var model = mongoose.model('Family', familySchema);

module.exports = model;

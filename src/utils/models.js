var async   = require('async'),
    arrays  = require('./arrays'),
    objects = require('./objects'),
    strings = require('./strings');

module.exports = {
    seed        : seed,
    updateMany  : updateMany
};

function prefixError (model, err) {
    err = err || {};
    err.message = 'Error seeding ' + model.modelName + ': ' + err.message;
}

function findByIdIfNeeded(model, ids, next) {
    if (arrays.isEmpty(ids)) { return next(); }
    model.find({
        _id : { $in: ids }
    }, next);
}
function seed (model, itemOrArray, next) {

    var ids = objects.getValues(itemOrArray, '_id') || [];

    findByIdIfNeeded(model, ids, function(err, items) {

        if (err) {
            prefixError(model, err);
            return next(err, [], null);
        }

        var seeds = [].concat(itemOrArray).filter(function(s){
            return (!s['_id']) || (!(items || []).find(function(i){
                return (i['_id'] === s['_id']);
            }));
        });
        if (seeds.length < 1) {
            var msg = (arrays.count(itemOrArray) > 0) ? 'no seeds' : 'not needed';
            return next(null, [], msg);
        }

        model.count({}, function (err, existCount) {

            if (err) {
                prefixError(model, err);
                return next(err, [], null);
            }

            var hasIds = [].concat(seeds).filter(function(i){
                return i['_id'];
            });
            var noIds = [].concat(seeds).filter(function(i){
                return !i['_id'];
            });

            if (existCount > 0 && noIds.length > 0 && hasIds.length < 1) {
                return next(null, [], 'seeds must have IDs for populated database');
            }

            var finalSeeds = (existCount > 0) ? hasIds : seeds;
            var msg = (noIds.length > 0 &&
                noIds.length !== seeds.length) ? 'some seeds were skipped due to missing IDs' : null;

            return model.insertMany(seeds, function(err, result) {

                if (err) {
                    prefixError(model, err);
                    return next(err, [], null);
                }

                return next(null, result, msg);
            });
        });
    });
}

function updateMany (models, done) {
    var updated = (models || []).filter(function(m){
        return (m &&
                ((m.isModified === true) ||
                 (typeof m.isModified === 'function' && m.isModified())));
    });
    if (updated.length < 1) { return done(); }
    async.parallel(updated.save, done);
}

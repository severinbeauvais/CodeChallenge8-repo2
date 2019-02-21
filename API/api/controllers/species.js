var _ = require('lodash');
var defaultLog = require('winston').loggers.get('default');
var mongoose = require('mongoose');
var qs = require('qs'); // query strings
var Actions = require('../helpers/actions');
var Utils = require('../helpers/utils');
var tagList = [
  'commonName',
  'latinName',
  'category',
  'dateIntroBC',
  'description',
  'image'
];

var getSanitizedFields = function (fields) {
  return _.remove(fields, function (f) {
    return (_.indexOf(tagList, f) !== -1);
  });
};

exports.protectedOptions = function (args, res) {
  res.status(200).send();
};

// returns count of entries in response header
exports.protectedHead = function (args, res) {
  // build match query if on speciesId route
  var query = {};

  // add in the default fields to the projection so that the incoming query will work for any selected fields
  tagList.push('_id');
  tagList.push('tags');

  // if specified, add ID query parameter
  if (args.swagger.params.speciesId) {
    query = Utils.buildQuery("_id", args.swagger.params.speciesId.value, query);
  }

  // FUTURE: add 'category' query parameter (NB: multi)

  // unless they specifically ask for it, don't return deleted results
  if (args.swagger.params.isDeleted && args.swagger.params.isDeleted.value !== undefined) {
    _.assignIn(query, { isDeleted: args.swagger.params.isDeleted.value });
  } else {
    _.assignIn(query, { isDeleted: false });
  }

  Utils.runDataQuery(
    'Species',
    null, // role
    query,
    tagList, // fields
    null, // sort warmup
    null, // sort
    0, // skip
    1000000, // limit
    true
  ) // count
    .then(function (data) {
      // /api/species/xxx route, return 200 OK with 0 items if necessary
      if (!(args.swagger.params.speciesId && args.swagger.params.speciesId.value) || (data && data.length > 0)) {
        // success
        res.setHeader('x-total-count', data && data.length > 0 ? data[0].total_items : 0);
        return Actions.sendResponse(res, 200, data);
      } else {
        // error
        return Actions.sendResponse(res, 404, data);
      }
    });
};

// gets a single, or list of, species entries
exports.protectedGet = function (args, res) {
  var skip = null;
  var limit = null;

  // build match query if on speciesId route
  var query = {};
  if (args.swagger.params.speciesId) {
    query = Utils.buildQuery("_id", args.swagger.params.speciesId.value, query);
  } else {
    // could be a bunch of results - enable pagination
    var processedParameters = Utils.getSkipLimitParameters(args.swagger.params.pageSize, args.swagger.params.pageNum);
    skip = processedParameters.skip;
    limit = processedParameters.limit;
  }

  // FUTURE: add 'category' query parameter (NB: multi)

  // unless they specifically ask for it, hide deleted results
  if (args.swagger.params.isDeleted && args.swagger.params.isDeleted.value !== undefined) {
    _.assignIn(query, { isDeleted: args.swagger.params.isDeleted.value });
  } else {
    _.assignIn(query, { isDeleted: false });
  }

  Utils.runDataQuery(
    'Species',
    null, // role
    query,
    getSanitizedFields(args.swagger.params.fields.value),
    null, // sort warmup
    null, // sort
    skip, // skip
    limit, // limit
    false
  ) // count
    .then(function (data) {
      return Actions.sendResponse(res, 200, data);
    });
};

// creates a new species entry
exports.protectedPost = function (args, res) {
  var obj = args.swagger.params.species.value;
  defaultLog.info("Posting new species object:", obj);

  var Species = mongoose.model('Species');
  var species = new Species(obj);

  species.createdBy = (args.swagger.params.auth_payload && args.swagger.params.auth_payload.preferred_username) || 'UNKNOWN';
  species.createdDate = Date.now();

  species.save()
    .then(function (obj) {
      // success
      // defaultLog.info("Saved new species object:", obj);
      return Actions.sendResponse(res, 200, obj);
    }).catch(function (err) {
      // error
      console.log("Error in API:", err);
      return Actions.sendResponse(res, 400, err);
    });
};

// updates an existing species entry
exports.protectedPut = function (args, res) {
  var speciesId = args.swagger.params.speciesId.value;
  defaultLog.info("Putting species id:", speciesId);

  var obj = args.swagger.params.speciesObject.value;
  delete obj.tags; // strip security tags - these will not be updated on this route
  defaultLog.info("Putting updated species object:", obj);

  // FUTURE: sanitize/update audits

  var Species = mongoose.model('Species');
  Species.findOneAndUpdate({ _id: speciesId }, obj, { upsert: false, new: true }, function (err, o) {
    if (o) {
      // success
      defaultLog.info("o:", o);
      return Actions.sendResponse(res, 200, o);
    } else {
      // error
      defaultLog.info("Couldn't find that object!");
      return Actions.sendResponse(res, 404, {});
    }
  });
};

// deletes a species entry
exports.protectedDelete = function (args, res) {
  var speciesId = args.swagger.params.speciesId.value;
  defaultLog.info("Deleting species id:", speciesId);

  var Species = mongoose.model('Species');
  Species.findOne({ _id: speciesId }, function (err, o) {
    if (o) {
      defaultLog.info("Deleting object:", o);

      Actions.delete(o)
        .then(function (deleted) {
          // success
          return Actions.sendResponse(res, 200, deleted);
        }, function (err) {
          // error
          return Actions.sendResponse(res, 400, err);
        });
    } else {
      defaultLog.info("Couldn't find that object!");
      return Actions.sendResponse(res, 404, {});
    }
  });
};

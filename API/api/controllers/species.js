var _           = require('lodash');
var defaultLog  = require('winston').loggers.get('default');
var mongoose    = require('mongoose');
var qs          = require('qs');
var Actions     = require('../helpers/actions');
var Utils       = require('../helpers/utils');
var tagList     = ['commonName',
                   'latinName',
                   'category',
                   'dateIntroBC',
                   'description',
                   'image'];

var getSanitizedFields = function (fields) {
  return _.remove(fields, function (f) {
    return (_.indexOf(tagList, f) !== -1);
  });
};

exports.protectedOptions = function (args, res, rest) {
  res.status(200).send();
};

exports.protectedHead = function (args, res, next) {
  // Build match query if on speciesId route
  var query = {};

  // Add in the default fields to the projection so that the incoming query will work for any selected fields.
  tagList.push('_id');
  tagList.push('tags');

  // if specified, add ID query parameter
  if (args.swagger.params.speciesId) {
    query = Utils.buildQuery("_id", args.swagger.params.speciesId.value, query);
  }

  // FUTURE: add 'category' query parameter (NB: multi)

  // Unless they specifically ask for it, hide deleted results.
  if (args.swagger.params.isDeleted && args.swagger.params.isDeleted.value !== undefined) {
    _.assignIn(query, { isDeleted: args.swagger.params.isDeleted.value });
  } else {
    _.assignIn(query, { isDeleted: false });
  }

  Utils.runDataQuery('Species',
                    null, // role
                    query,
                    tagList, // fields
                    null, // sort warmup
                    null, // sort
                    0, // skip
                    1000000, // limit
                    true) // count
  .then(function (data) {
    // /api/comment/ route, return 200 OK with 0 items if necessary
    if (!(args.swagger.params.speciesId && args.swagger.params.speciesId.value) || (data && data.length > 0)) {
      res.setHeader('x-total-count', data && data.length > 0 ? data[0].total_items: 0);
      return Actions.sendResponse(res, 200, data);
    } else {
      return Actions.sendResponse(res, 404, data);
    }
  });
};

exports.protectedGet = function(args, res, next) {
  var skip        = null;
  var limit       = null;

  // Build match query if on speciesId route
  var query = {};
  if (args.swagger.params.speciesId) {
    query = Utils.buildQuery("_id", args.swagger.params.speciesId.value, query);
  } else {
    // Could be a bunch of results - enable pagination
    var processedParameters = Utils.getSkipLimitParameters(args.swagger.params.pageSize, args.swagger.params.pageNum);
    skip = processedParameters.skip;
    limit = processedParameters.limit;
  }

  // Unless they specifically ask for it, hide deleted results.
  if (args.swagger.params.isDeleted && args.swagger.params.isDeleted.value !== undefined) {
    _.assignIn(query, { isDeleted: args.swagger.params.isDeleted.value });
  } else {
    _.assignIn(query, { isDeleted: false });
  }

  Utils.runDataQuery('Species',
                    null, // role
                    query,
                    getSanitizedFields(args.swagger.params.fields.value),
                    null, // sort warmup
                    null, // sort
                    skip, // skip
                    limit, // limit
                    false) // count
  .then(function (data) {
    return Actions.sendResponse(res, 200, data);
  });
};

// Create a new species entry.
exports.protectedPost = function (args, res, next) {
  var obj = args.swagger.params.app.value;

  defaultLog.info("Incoming new object:", obj);

  var Species = mongoose.model('Species');
  var app = new Species(obj);
  app._createdBy = args.swagger.params.auth_payload.preferred_username;
  app.createdDate = Date.now();

  app.save()
  .then(function (savedApp) {
    return new Promise(function (resolve, reject) {

      // TODO: replace all this with regular save code (eg, see Document or Comment)

      return Utils.loginWebADE()
      .then(function (accessToken) {
        _accessToken = accessToken;
        console.log("TTLS API Logged in:", _accessToken);
        // Disp lookup
        return Utils.getApplicationByDispositionID(_accessToken, savedApp.tantalisID);
      }).then(resolve, reject);
    })
    .then(function (data) {
      // Copy in the meta
      savedApp.areaHectares = data.areaHectares;
      savedApp.centroid     = data.centroid;
      savedApp.purpose      = data.TENURE_PURPOSE;
      savedApp.subpurpose   = data.TENURE_SUBPURPOSE;
      savedApp.type         = data.TENURE_TYPE;
      savedApp.subtype      = data.TENURE_SUBTYPE;
      savedApp.status       = data.TENURE_STATUS;
      savedApp.tenureStage  = data.TENURE_STAGE;
      savedApp.location     = data.TENURE_LOCATION;
      savedApp.businessUnit = data.RESPONSIBLE_BUSINESS_UNIT;
      savedApp.cl_file      = data.CROWN_LANDS_FILE;
      savedApp.tantalisID   = data.DISPOSITION_TRANSACTION_SID;

      for(let [idx,client] of Object.entries(data.interestedParties)) {
        if (idx > 0) {
          savedApp.client += ", ";
        }
        if (client.interestedPartyType == 'O') {
          savedApp.client += client.legalName;
        } else {
          savedApp.client += client.firstName + " " + client.lastName;
        }
      }

      Promise.resolve()
      .then(function () {
        // All done with promises in the array, return to the caller.
        console.log("all done");
        return savedApp.save();
      }).then(function (theApp) {
        return Actions.sendResponse(res, 200, theApp);
      });
    }).catch(function (err) {
      console.log("Error in API:", err);
      return Actions.sendResponse(res, 400, err);
    });
  });
};

// Update an existing species entry.
exports.protectedPut = function (args, res, next) {
  var objId = args.swagger.params.speciesId.value;
  defaultLog.info("Putting species id:", args.swagger.params.speciesId.value);

  var obj = args.swagger.params.AppObject.value;
  // Strip security tags - these will not be updated on this route.
  delete obj.tags;
  // defaultLog.info("Incoming updated object:", obj);
  
  // TODO sanitize/update audits.

  var Species = require('mongoose').model('Species');
  Species.findOneAndUpdate({_id: objId}, obj, {upsert:false, new: true}, function (err, o) {
    if (o) {
      defaultLog.info("o:", o);
      return Actions.sendResponse(res, 200, o);
    } else {
      defaultLog.info("Couldn't find that object!");
      return Actions.sendResponse(res, 404, {});
    }
  });
};

exports.protectedDelete = function (args, res, next) {
  var speciesId = args.swagger.params.speciesId.value;
  defaultLog.info("Deleting species id:", speciesId);

  var Species = mongoose.model('Species');
  Species.findOne({_id: speciesId}, function (err, o) {
    if (o) {
      defaultLog.info("o:", o);

      // Set the deleted flag.
      Actions.delete(o)
      .then(function (deleted) {
        // deleted successfully
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

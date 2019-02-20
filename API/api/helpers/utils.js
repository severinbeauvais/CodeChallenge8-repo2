"use strict";

var defaultLog  = require('winston').loggers.get('default');
var mongoose    = require('mongoose');
var _           = require('lodash');

var MAX_LIMIT = 1000;
var DEFAULT_PAGESIZE = 100;

exports.buildQuery = function (property, values, query) {
  var oids = [];
  if (_.isArray(values)) {
    _.each(values, function (i) {
      oids.push(mongoose.Types.ObjectId(i));
    });
  } else {
    oids.push(mongoose.Types.ObjectId(values));
  }
  return _.assignIn(query, {
    [property]: {
      $in: oids
    }
  });
};

exports.getSkipLimitParameters = function (pageSize, pageNum) {
  const params = {};

  var ps = DEFAULT_PAGESIZE; // Default
  if (pageSize && pageSize.value !== undefined) {
    if (pageSize.value > 0) {
      ps = pageSize.value;
    }
  }
  if (pageNum && pageNum.value !== undefined) {
    if (pageNum.value >= 0) {
      params.skip = (pageNum.value * ps);
      params.limit = ps;
    }
  }
  return params;
};

exports.runDataQuery = function (modelName, role, query, fields, sortWarmUp, sort, skip, limit, doCount, preQueryPipelineSteps) {
  return new Promise(function (resolve, reject) {
    var theModel = mongoose.model(modelName);
    var projection = {};

    // Don't project unecessary fields if we are only counting objects.
    if (doCount) {
      projection._id = 1;
      projection.tags = 1;
    } else {
      // Fields we always return.
      var defaultFields = ['_id',
                           'code',
                           'tags'];
      _.each(defaultFields, function (f) {
        projection[f] = 1;
      });

      // Add requested fields - sanitize first by including only those that we can/want to return
      _.each(fields, function (f) {
        projection[f] = 1;
      });
    }

    var aggregations = _.compact([
      {
        "$match": query
      },
      {
        "$project": projection
      },

      sortWarmUp, // used to set up the sort if a temporary projection is needed

      !_.isEmpty(sort) ? { $sort: sort } : null,

      sort ? { $project: projection } : null, // reset the projection just in case the sortWarmUp changed it

      // Do this only if they ask for it.
      doCount && {
        $group: {
          _id: null,
          total_items: { $sum: 1 }
        }
      },
      { $skip: skip || 0 },
      { $limit: limit || MAX_LIMIT }
    ]);

    // Pre-pend the aggregation with other pipeline steps if we are joining on another datasource.
    if (preQueryPipelineSteps && preQueryPipelineSteps.length > 0) {
      for (let step of preQueryPipelineSteps) {
        aggregations.unshift(step);
      }
    }

    theModel.aggregate(aggregations)
      .exec()
      .then(resolve, reject);
  });
};

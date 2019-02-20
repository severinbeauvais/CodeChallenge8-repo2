"use strict";

var _ = require('lodash');

exports.delete = function (o) {
  return new Promise(function (resolve, reject) {
    _.remove(o.tags, function (item) {
      return _.isEqual(item, ['public']); // TODO: don't need this
    });
    o.isDeleted = true;
    o.markModified('tags');
    o.markModified('isDeleted');
    // save then return.
    o.save().then(resolve, function (err) {
      reject({ code: 400, message: err.message });
    });
  });
};

exports.sendResponse = function (res, code, object) {
  res.writeHead(code, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(object));
};
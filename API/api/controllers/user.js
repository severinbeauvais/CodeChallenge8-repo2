var _          = require('lodash');
var defaultLog = require('winston').loggers.get('default');
var mongoose   = require('mongoose');
var Actions    = require('../helpers/actions');
var tagList    = [
  'username',
  'firstName',
  'lastName',
  'email'
];

var getSanitizedFields = function (fields) {
  return _.remove(fields, function (f) {
    return (_.indexOf(tagList, f) !== -1);
  });
};

exports.protectedOptions = function (args, res) {
  res.status(200).send();
};

// updates an existing user entry
exports.protectedPut = function (args, res) {
  var obj = args.swagger.params.userObject.value;
  delete obj.tags; // strip security tags - these will not be updated on this route
  defaultLog.info("Putting updated user object:", obj);

  var User = mongoose.model('User');
  User.findOneAndUpdate({ email: obj.email }, obj, { upsert: true, new: true }, function (err, o) {
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
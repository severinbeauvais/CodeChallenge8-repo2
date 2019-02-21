module.exports = require ('../models')('User', {
  username    : { type: String,  default: '' },
  firstName   : { type: String,  default: '' },
  lastName    : { type: String,  default: '' },
  email       : { type: String,  default: '', unique: true, rquired: true },
  // auditing fields
  createdBy   : { type: String,  default: '' },
  createdDate : { type: Date,    default: Date.now },
  lastLoggedIn: { type: Date,    default: Date.now },
  // soft-delete flag
  isDeleted   : { type: Boolean, default: false }
});

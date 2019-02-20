 module.exports = require ('../models')('Species', {
    commonName       : { type: String, default: '', trim: true },
    latinName        : { type: String, default: '', trim: true },
    category         : { type: String, default: '' },
    dateIntroBC      : { type: Date, default: null },
    description      : { type: String, default: '' },
    image            : {
      data             : { type: String, default: null },
      length           : { type: Number, default: 0 },
      md5              : { type: String, default: '' }
    },
    // auditing fields
    createdDate      : { type: Date, default: Date.now },
    createdBy        : { type: String, default: '' },
    // soft-delete flag
    isDeleted        : { type: Boolean, default: false }
});

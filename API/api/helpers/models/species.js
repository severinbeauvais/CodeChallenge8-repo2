 module.exports = require ('../models')('Species', {
    commonName       : { type: String, default: '', trim: true, required: true },
    latinName        : { type: String, default: '', unique: true, trim: true, required: true },
    category         : { type: String, enum: ['Land Animal', 'Marine Animal', 'Land Plant', 'Marine Plane', 'Fungus'], required: true },
    dateIntroBC      : { type: Date, default: null },
    description      : { type: String, default: '' },
    image            : {
      data             : { type: String, default: null },
      length           : { type: Number, default: 0 },
      md5              : { type: String, default: '' }
    },
    // auditing fields
    createdBy        : { type: String, default: '' },
    createdDate      : { type: Date, default: Date.now },
    // soft-delete flag
    isDeleted        : { type: Boolean, default: false }
});

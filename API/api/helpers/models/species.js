 module.exports = require ('../models')('Species', {
    commonName       : { type: String, default: '', trim: true, required: true },
    latinName        : { type: String, default: '', unique: true, trim: true, required: true },
    category         : { type: String, enum: ['Land Animal', 'Marine Animal', 'Land Plant', 'Marine Plant', 'Fungus'], required: true },
    dateIntroBC      : { type: Date, default: null },
    description      : { type: String, default: '' },
    image            : {
      name             : { type: String, default: null },
      type             : { type: String, default: null },
      data             : { type: String, default: null },
      size             : { type: Number, default: 0 },
      md5              : { type: String, default: null }
    },
    // auditing fields
    createdBy        : { type: String, default: '' },
    createdDate      : { type: Date, default: Date.now },
    // soft-delete flag
    isDeleted        : { type: Boolean, default: false }
});

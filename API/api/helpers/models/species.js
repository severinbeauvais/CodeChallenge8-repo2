 module.exports = require ('../models')('Species', {
    commonName       : { type: String, default: '', trim: true, required: 'Common Name is required' },
    // note: Latin Name is lower-cased and must be unique to avoid duplicate entries
    latinName        : { type: String, default: '', trim: true, lowercase: true, unique: true, required: 'Latin Name is required' },
    category         : { type: String, enum: ['Land Animal', 'Marine Animal', 'Land Plant', 'Marine Plant', 'Fungus'], required: 'Category is required' },
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

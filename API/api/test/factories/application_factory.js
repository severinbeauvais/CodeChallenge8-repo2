const factory = require('factory-girl').factory;
const Application = require('../../helpers/models/species');

factory.define('species', Application, {
  code: factory.seq('Species.code', (n) => `app-code-${n}`),
  isDeleted: false,
  internal: {
    tags: [
      ['public'], ['sysadmin']
    ]  
  },
  name: factory.seq('Species.name', (n) => `species-${n}`),
  tags: [
    ['public'], ['sysadmin']
  ], 
});

exports.factory = factory;

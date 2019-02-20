const test_helper = require('./test_helper');
const applicationFactory = require('./factories/application_factory').factory;
const app = test_helper.app;
const mongoose = require('mongoose');
const request = require('supertest');
const nock = require('nock');
const tantalisResponse = require('./fixtures/tantalis_response.json');
const fieldNames = ['description', 'tantalisID'];
const _ = require('lodash');
const Utils = require('../helpers/utils');

const speciesController = require('../controllers/species.js');
require('../helpers/models/species');
require('../helpers/models/feature');
const Species = mongoose.model('Species');
const Feature = mongoose.model('Feature');
const idirUsername = 'idir/i_am_a_bot';

function paramsWithAppId(req) {
  let params = test_helper.buildParams({'speciesId': req.params.id});
  return test_helper.createSwaggerParams(fieldNames, params);
}

function publicParamsWithAppId(req) {
  let params = test_helper.buildParams({'speciesId': req.params.id});
  return test_helper.createPublicSwaggerParams(fieldNames, params);
}

app.get('/api/species', function(req, res) {
  let swaggerParams = test_helper.createSwaggerParams(fieldNames);
  return speciesController.protectedGet(swaggerParams, res);
});

app.get('/api/species/:id', function(req, res) {
  return speciesController.protectedGet(paramsWithAppId(req), res);
});

app.post('/api/species/', function(req, res) {
  let extraFields = test_helper.buildParams({'app': req.body});
  let params = test_helper.createSwaggerParams(fieldNames, extraFields, idirUsername);
  return speciesController.protectedPost(params, res);
});

app.delete('/api/species/:id', function(req, res) {
  return speciesController.protectedDelete(paramsWithAppId(req), res);
});

app.put('/api/species/:id', function(req, res) {
  let extraFields = test_helper.buildParams({'speciesId': req.params.id, 'SpeciesObject': req.body});
  let params = test_helper.createSwaggerParams(fieldNames, extraFields);
  return speciesController.protectedPut(params, res);
});

const speciesData = [
  {description: 'SPECIAL', name: 'Special application', tags: [['public'], ['sysadmin']], isDeleted: false},
  {description: 'VANILLA', name: 'Vanilla ice cream', tags: [['public']], isDeleted: false},
  {description: 'TOP_SECRET', name: 'Confidential application', tags: [['sysadmin']], isDeleted: false},
  {description: 'DELETED', name: 'Deleted application', tags: [['public'], ['sysadmin']], isDeleted: true},
];


function setupSpecies(speciesData) {
  return new Promise(function(resolve, reject) {
    applicationFactory.createMany('species', speciesData).then(applicationArray => {
      resolve(applicationArray);
    }).catch(error => {
      reject(error);
    });
  });
}

describe('GET /species', () => {
  test('returns a list of non-deleted, public and authenticated species entries', done => {
    setupSpecies(speciesData).then((documents) => {
      request(app).get('/api/species')
        .expect(200)
        .then(response => {
          expect(response.body.length).toEqual(3);
          
          let firstSpecies = _.find(response.body, {description: 'SPECIAL'});
          expect(firstSpecies).toHaveProperty('_id');
          expect(firstSpecies['tags']).toEqual(expect.arrayContaining([["public"], ["sysadmin"]]));

          let secondSpecies = _.find(response.body, {description: 'VANILLA'});
          expect(secondSpecies).toHaveProperty('_id');
          expect(secondSpecies['tags']).toEqual(expect.arrayContaining([["public"]]));

          let secretSpecies = _.find(response.body, {description: 'TOP_SECRET'});
          expect(secretSpecies).toHaveProperty('_id');
          expect(secretSpecies['tags']).toEqual(expect.arrayContaining([["sysadmin"]]));
          done()
        });
    });
  });

  test('returns an empty array when there are no species entries', done => {
    request(app).get('/api/species')
      .expect(200)
      .then(response => {
        expect(response.body.length).toBe(0);
        expect(response.body).toEqual([]);
        done();
      });
  });

  describe('pagination', () => {
    test.skip('it paginates when pageSize is present', () => {});
    test.skip('it paginates when pageNum is present', () => {});
  });
});

describe('GET /species/{id}', () => {
  test('returns a single species entry ', done => {
    setupSpecies(speciesData).then((documents) => {
      Species.findOne({description: 'SPECIAL'}).exec(function(error, application) {
        let specialAppId = application._id.toString();
        let uri = '/api/species/' + specialAppId;

        request(app)
          .get(uri)
          .expect(200)
          .then(response => {
            expect(response.body.length).toBe(1);
            let responseObject = response.body[0];
            expect(responseObject).toMatchObject({
              '_id': specialAppId,
              'tags': expect.arrayContaining([['public'], ['sysadmin']]),
              description: 'SPECIAL'
            });
            done();
          });
      });;
    });
  });
});

describe('DELETE /species/id', () => {
  test('It soft deletes a species entry', done => {
    setupSpecies(speciesData).then((documents) => {
      Species.findOne({description: 'VANILLA'}).exec(function(error, application) {
        let vanillaAppId = application._id.toString();
        let uri = '/api/species/' + vanillaAppId;
        request(app)
          .delete(uri)
          .expect(200)
          .then(response => {
            Species.findOne({description: 'VANILLA'}).exec(function(error, application) {
              expect(application.isDeleted).toBe(true);
              done();
            });
          });
      });
    });
  });

  test('404s if the species entry does not exist', done => {
    let uri = '/api/species/' + 'NON_EXISTENT_ID';
    request(app)
      .delete(uri)
      .expect(404)
      .then(response => {
        done();
      });
  });
});

describe('POST /species', () => {
  let applicationObj = {
    name: 'Victoria',
    description: 'victoria',
    tantalisID: 999999
  };
  let searchResult = {
    DISPOSITION_TRANSACTION_SID: 999999,
    interestedParties: [
      {
        interestedPartyType: 'O',
        legalName: 'Megacorp'
      },
      {
        interestedPartyType: 'I',
        firstName: 'Ajit',
        lastName: 'Pai'
      }
    ],
    parcels: [
      {
        type: 'Feature',
        properties: {
          TENURE_LEGAL_DESCRIPTION: 'READ THESE BORING LEGAL TERMS.',
          TENURE_AREA_IN_HECTARES: 3.333,
          INTRID_SID: 12345,
          TENURE_EXPIRY: 1527878179000,
          FEATURE_CODE: 'FL98000100',
          FEATURE_AREA_SQM: 33855.6279054274,
          FEATURE_LENGTH_M: 740.122691165678
        },
        crs: {
          properties: {
            name: 'urn:ogc:def:crs:EPSG::4326'
          }
        }
      }
      
    ],
    areaHectares: 80000,
    centroid: [ -128.6704671493984, 58.28816863259513 ],
    TENURE_PURPOSE: 'To rule the world',
    TENURE_SUBPURPOSE: 'And all of the chocolates',
    TENURE_TYPE: 'EVIL',
    TENURE_SUBTYPE: 'LANDLORD',
    TENURE_STATUS: 'PENDING',
    TENURE_STAGE: 'LEFT',
    TENURE_LOCATION: 'Megalopolis',
    RESPONSIBLE_BUSINESS_UNIT: 'Not present',
    CROWN_LANDS_FILE: 7654321,
  };

});

describe('PUT /species/:id', () => {
  test('updates a species entry', done => {
    let existingSpecies = new Species({
      description: 'SOME_APP',
      name: 'Boring application'
    });
    let updateData = {
      name: 'Exciting application'
    };
    existingSpecies.save().then(species => {
      let uri = '/api/species/' + species._id;
      request(app).put(uri)
        .send(updateData)
        .then(response => {
          Species.findOne({name: 'Exciting application'}).exec(function(error, species) {
            expect(species).toBeDefined();
            expect(species).not.toBeNull();
            done();
          });
        });
    });
  });

  test('404s if the species object does not exist', done => {
    let uri = '/api/species/' + 'NON_EXISTENT_ID';
    request(app).put(uri)
      .send({name: 'hacker_man'})
      .expect(404)
      .then(response => {
        done();
      });
  });

  test('does not allow updating tags', done => {
    let existingSpecies = new Species({
      description: 'EXISTING',
      tags: [['public']]
    });
    let updateData = {
      tags: [['public'], ['sysadmin']]
    };
    existingSpecies.save().then(species => {
      let uri = '/api/application/' + species._id;
      request(app).put(uri)
        .send(updateData)
        .then(response => {
          Species.findById(existingSpecies._id).exec(function(error, updatedSpecies) {
            expect(updatedSpecies.tags.length).toEqual(1);
            done();
          });
        });
    });
  });
});

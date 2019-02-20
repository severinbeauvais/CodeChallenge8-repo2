import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { SpeciesService } from './species.service';
import { ApiService } from 'app/services/api';
import { Species } from 'app/models/species';

describe('SpeciesService', () => {
  let service: any;

  const apiServiceStub = {

    // TODO: change status test to category test

    getSpeciesEntry(id: string) {
      const species = new Species({ _id: id, category: 'Land Animal' });
      return of([species]);
    },

    getSpeciesEntries() {
      const firstSpecies = new Species({ _id: 'BBBB', category: 'Marine Animal' });
      const secondSpecies = new Species({ _id: 'CCCC', category: 'Fungus' });
      return of([firstSpecies, secondSpecies]);
    },

    handleError(error: any) {
      fail(error);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpeciesService,
        { provide: ApiService, useValue: apiServiceStub }
      ]
    });

    service = TestBed.get(SpeciesService);
  });

  it('should be created', inject([SpeciesService], (appService: SpeciesService) => {
    expect(appService).toBeTruthy();
  }));

  describe('getAll()', () => {
    it('retrieves the species from the api service', () => {
      service.getAll().subscribe(species => {
        expect(species[0]._id).toBe('BBBB');
        expect(species[1]._id).toBe('CCCC');
      });
    });

    describe('species properties', () => {
      let existingSpecies = new Species({
        _id: 'AAAA'
      });

      let apiService;
      beforeEach(() => {
        apiService = TestBed.get(ApiService);

        spyOn(apiService, 'getSpeciesEntries').and.returnValue(of([existingSpecies]));
      });
    });
  });

  describe('getById()', () => {
    it('retrieves the species from the api service', () => {
      service.getById('AAAA').subscribe(species => {
        expect(species._id).toBe('AAAA');
      });
    });

    describe('species properties', () => {
      let existingSpecies = new Species({
        _id: 'AAAA'
      });

      let apiService;
      beforeEach(() => {
        apiService = TestBed.get(ApiService);

        spyOn(apiService, 'getSpecies').and.returnValue(of([existingSpecies]));
      });
    });
  });
});

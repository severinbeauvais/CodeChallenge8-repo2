import { TestBed, inject } from '@angular/core/testing';
import { of } from 'rxjs';

import { SpeciesService } from './species.service';
import { ApiService } from 'app/services/api';

import { Species } from 'app/models/species';

describe('SpeciesService', () => {
  let service: any;

  const apiServiceStub = {

    // TODO: change status test to category test

    getApplication(id: string) {
      const application = new Species({ _id: id, status: 'ACCEPTED' });
      return of([application]);
    },

    getApplications() {
      const firstApplication = new Species({ _id: 'BBBB', status: 'ACCEPTED' });
      const secondApplication = new Species({ _id: 'CCCC', status: 'ABANDONED' });
      return of([firstApplication, secondApplication]);
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
    it('retrieves the applications from the api service', () => {
      service.getAll().subscribe(applications => {
        expect(applications[0]._id).toBe('BBBB');
        expect(applications[1]._id).toBe('CCCC');
      });
    });

    describe('application properties', () => {
      let existingApplication = new Species({
        _id: 'AAAA'
      });

      let apiService;
      beforeEach(() => {
        apiService = TestBed.get(ApiService);

        spyOn(apiService, 'getApplications').and.returnValue(of([existingApplication]));
      });
    });
  });

  describe('getById()', () => {
    it('retrieves the application from the api service', () => {
      service.getById('AAAA').subscribe(application => {
        expect(application._id).toBe('AAAA');
      });
    });

    describe('application properties', () => {
      let existingApplication = new Species({
        _id: 'AAAA'
      });

      let apiService;
      beforeEach(() => {
        apiService = TestBed.get(ApiService);

        spyOn(apiService, 'getApplication').and.returnValue(of([existingApplication]));
      });
    });
  });
});

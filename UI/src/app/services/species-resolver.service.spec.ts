import { TestBed, inject } from '@angular/core/testing';
import { SpeciesResolver } from './species-resolver.service';
import { SpeciesService } from './species.service';

describe('SpeciesResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpeciesResolver,
        { provide: SpeciesService }
      ]
    });
  });

  it('should be created', inject([SpeciesResolver], (service: SpeciesResolver) => {
    expect(service).toBeTruthy();
  }));
});

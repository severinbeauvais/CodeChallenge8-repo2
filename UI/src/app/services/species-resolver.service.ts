import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { SpeciesService } from './species.service';
import { Species } from 'app/models/species';

import { of } from 'rxjs';

@Injectable()
export class SpeciesResolver implements Resolve<Species> {
  constructor(
    private speciesService: SpeciesService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Species> {
    const id = route.paramMap.get('id');

    if (id === '0') {
      // create new species
      return of(new Species());
    }

    // view/edit existing application
    console.log('species =', this.speciesService.getById(id));
    return this.speciesService.getById(id);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as _ from 'lodash';

import { ApiService } from './api';

import { Species } from 'app/models/species';

@Injectable()
export class SpeciesService {

  constructor(
    private api: ApiService
  ) { }

  // get count of species entries
  // FUTURE: use this for paging
  getCount(): Observable<number> {
    return this.api.getCountSpeciesEntries()
      .catch(error => this.api.handleError(error));
  }

  // get all species entries
  getAll(): Observable<Species[]> {
    // FUTURE: implement paging; for now, max 1000 records
    return this.api.getSpeciesEntries(0, 1000)
      .map(res => {
        if (res && res.length > 0) {
          const species: Array<Species> = [];
          res.forEach(s => {
            species.push(new Species(s));
          });
          return species;
        }
        return [];
      })
      .catch(error => this.api.handleError(error));
  }

  // get a specific species entry by its object id
  getById(id: string): Observable<Species> {
    return this.api.getSpecies(id)
      .map(res => {
        if (res && res.length > 0) {
          // return the first (only) species entry
          return new Species(res[0]);
        }
        return null;
      })
      .catch(error => this.api.handleError(error));
  }

  // create new species
  add(item: any): Observable<Species> {
    const app = new Species(item);

    // id must not exist on POST
    delete app._id;

    // replace newlines with \\n (JSON format)
    if (app.description) {
      app.description = app.description.replace(/\n/g, '\\n');
    }

    return this.api.addSpecies(app)
      .catch(error => this.api.handleError(error));
  }

  // update existing species
  save(orig: Species): Observable<Species> {
    // make a (deep) copy of the passed-in species object so we don't change it
    const app = _.cloneDeep(orig);

    // replace newlines with \\n (JSON format)
    if (app.description) {
      app.description = app.description.replace(/\n/g, '\\n');
    }

    return this.api.saveSpecies(app)
      .catch(error => this.api.handleError(error));
  }

  delete(app: Species): Observable<Species> {
    return this.api.deleteSpecies(app)
      .catch(error => this.api.handleError(error));
  }
}

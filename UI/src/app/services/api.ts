import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Params } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { environment } from '../../environments/environment';

import { Species } from 'app/models/species';
import { User } from 'app/models/user';

@Injectable()
export class ApiService {

  public token: string;
  public isMS: boolean; // IE, Edge, etc
  public isAdmin: boolean;
  public pathAPI: string;
  public params: Params;
  public env: 'local' | 'dev' | 'test' | 'demo' | 'scale' | 'beta' | 'master' | 'prod';

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService,
  ) {
    const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.isMS = window.navigator.msSaveOrOpenBlob ? true : false;
    this.isAdmin = this.keycloakService.getUserRoles().includes('seism_admin') || !environment.KeycloakEnabled;
    this.pathAPI = 'http://localhost:3000/api';
    this.env = 'local';
  }

  handleError(error: any): Observable<never> {
    const reason = error.message ? error.message : (error.status ? `${error.status} - ${error.statusText}` : 'Server error');
    console.log('API error =', reason);
    if (error && error.status === 403) {
      window.location.href = '/not-authorized';
    }
    return throwError(error);
  }

  logout() {
    // clear token + remove user from local storage to log user out
    this.token = null;
    window.localStorage.removeItem('currentUser');
  }

  //
  // Species
  //
  getCountSpeciesEntries(): Observable<number> {
    const queryString = `species`;
    return this.http.head<HttpResponse<Object>>(`${this.pathAPI}/${queryString}`, { observe: 'response' })
      .pipe(
        map(res => {
          // retrieve the count from the response headers
          return parseInt(res.headers.get('x-total-count'), 10);
        })
      );
  }

  getSpeciesEntries(pageNum: number, pageSize: number): Observable<Species[]> {
    const fields = [
      'commonName',
      'latinName',
      'category',
      'dateIntroBC',
      'description',
      'image'
    ];
    let queryString = 'species?';
    if (pageNum !== null) { queryString += `pageNum=${pageNum}&`; }
    if (pageSize !== null) { queryString += `pageSize=${pageSize}&`; }
    queryString += `fields=${this.buildValues(fields)}`;
    return this.http.get<Species[]>(`${this.pathAPI}/${queryString}`, {});
  }

  // NB: returns array with 1 element
  getSpeciesEntry(id: string): Observable<Species[]> {
    const fields = [
      'commonName',
      'latinName',
      'category',
      'dateIntroBC',
      'description',
      'image'
    ];
    const queryString = `species/${id}?fields=${this.buildValues(fields)}`;
    return this.http.get<Species[]>(`${this.pathAPI}/${queryString}`, {});
  }

  addSpecies(app: Species): Observable<Species> {
    const queryString = `species/`;
    return this.http.post<Species>(`${this.pathAPI}/${queryString}`, app, {});
  }

  deleteSpecies(app: Species): Observable<Species> {
    const queryString = `species/${app._id}`;
    return this.http.delete<Species>(`${this.pathAPI}/${queryString}`, {});
  }

  saveSpecies(app: Species): Observable<Species> {
    const queryString = `species/${app._id}`;
    return this.http.put<Species>(`${this.pathAPI}/${queryString}`, app, {});
  }

  //
  // Users
  //
  putUser(app: User): Observable<User> {
    const queryString = `user/`;
    return this.http.put<User>(`${this.pathAPI}/${queryString}`, app, {});
  }

  //
  // Local helpers
  //
  private buildValues(collection: any[]): string {
    let values = '';
    _.each(collection, function (a) {
      values += a + '|';
    });
    // trim the last |
    return values.replace(/\|$/, '');
  }

}

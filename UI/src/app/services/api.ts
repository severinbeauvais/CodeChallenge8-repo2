import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { Species } from 'app/models/species';
import { Document } from 'app/models/document';

@Injectable()
export class ApiService {

  public token: string;
  public isMS: boolean; // IE, Edge, etc
  public pathAPI: string;
  public params: Params;
  public env: 'local' | 'dev' | 'test' | 'demo' | 'scale' | 'beta' | 'master' | 'prod';

  constructor(
    private http: HttpClient
  ) {
    const currentUser = JSON.parse(window.localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    this.isMS = window.navigator.msSaveOrOpenBlob ? true : false;
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

  // NB: returns array
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
  // Documents
  //
  uploadDocument(formData: FormData): Observable<Document> {
    const fields = [
      'documentFileName',
      'displayName',
      'internalURL',
      'internalMime'
    ];
    const queryString = `document/?fields=${this.buildValues(fields)}`;
    return this.http.post<Document>(`${this.pathAPI}/${queryString}`, formData, {});
  }

  private downloadResource(id: string): Promise<Blob> {
    const queryString = `document/${id}/download`;
    return this.http.get<Blob>(this.pathAPI + '/' + queryString, { responseType: 'blob' as 'json' }).toPromise();
  }

  public async downloadDocument(document: Document): Promise<void> {
    const blob = await this.downloadResource(document._id);
    const filename = document.documentFileName;

    if (this.isMS) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      window.document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }

  public async openDocument(document: Document): Promise<void> {
    const blob = await this.downloadResource(document._id);
    const filename = document.documentFileName;

    if (this.isMS) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      const tab = window.open();
      const fileURL = URL.createObjectURL(blob);
      tab.location.href = fileURL;
    }
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

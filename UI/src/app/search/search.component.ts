import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';

import { Application } from 'app/models/application';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit, OnDestroy {
  public searching = false;
  public ranSearch = false;
  public keywords: Array<string> = [];
  public applications: Array<Application> = [];
  public count = 0; // for template
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe = new Subject<boolean>();

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // get search terms from route
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
      });
  }

  ngOnDestroy() {
    // dismiss any open snackbar
    if (this.snackBarRef) { this.snackBarRef.dismiss(); }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private doSearch() {
    this.searching = true;
    this.count = 0;
    this.applications.length = 0; // empty the list
  }

  // reload page with current search terms
  public onSubmit() {
    // dismiss any open snackbar
    if (this.snackBarRef) { this.snackBarRef.dismiss(); }

    // NOTE: Angular Router doesn't reload page on same URL
    // REF: https://stackoverflow.com/questions/40983055/how-to-reload-the-current-route-with-the-angular-2-router
    // WORKAROUND: add timestamp to force URL to be different than last time
    // console.log('params =', params);
    this.router.navigate(['search']);
  }

  public onImport(application: Application) {
    if (application) {
      // save application data from search results
      const params = {
        // initial data
        purpose: application.purpose,
        subpurpose: application.subpurpose,
        type: application.type,
        subtype: application.subtype,
        status: application.status,
        tenureStage: application.tenureStage,
        location: application.location,
        businessUnit: application.businessUnit,
        cl_file: application.cl_file,
        tantalisID: application.tantalisID,
        legalDescription: application.legalDescription,
        client: application.client,
        statusHistoryEffectiveDate: application.statusHistoryEffectiveDate
      };
      // go to add-edit page
      this.router.navigate(['/a', 0, 'edit'], { queryParams: params });
    } else {
      console.log('error, invalid application =', application);
      this.snackBarRef = this.snackBar.open('Error creating application ...', null, { duration: 3000 });
    }
  }

}

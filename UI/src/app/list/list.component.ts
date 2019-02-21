import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import * as _ from 'lodash';

import { Constants } from 'app/utils/constants'; // TODO: use Constants.categories to populate drop-down list
import { Species } from 'app/models/species';
import { SpeciesService } from 'app/services/species.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit, OnDestroy {
  public loading = true;
  private paramMap: ParamMap = null;
  public species: Array<Species> = [];
  public column: string = null;
  public direction = 0;
  public filterKeys: Array<string> = [];
  public filterBy: string = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private speciesService: SpeciesService
  ) { }

  ngOnInit() {
    // dynamically load filters -- including a 'None' option
    this.filterKeys.push('None');
    Constants.categories.forEach(key => this.filterKeys.push(key));
    this.filterBy = this.filterKeys[0]; // initial filter is 'none'

    // get optional query parameters
    this.route.queryParamMap
      .takeUntil(this.ngUnsubscribe)
      .subscribe(paramMap => {
        this.paramMap = paramMap;

        // set initial filters
        this.resetFilters();
      });

    // get all species entries
    this.speciesService.getAll()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        species => {
          this.loading = false;
          this.species = species;
        },
        error => {
          this.loading = false;
          console.log(error);
          alert('Error loading species list');
          this.router.navigate(['/']); // navigate back to home
        }
      );
  }

  public filterChange(event: Event) {
    console.log('event: ', event);
    // this.showOnlyOpenApps = checked;
    this.saveFilters();
  }

  private saveFilters() {
    const params: Params = {};

    // if (this.showOnlyOpenApps) {
    //   params['showOnlyOpenApps'] = true;
    // }

    if (this.column && this.direction) {
      params['col'] = this.column;
      params['dir'] = this.direction;
    }

    // change browser URL without reloading page (so any query params are saved in history)
    this.location.go(this.router.createUrlTree([], { relativeTo: this.route, queryParams: params }).toString());
  }

  private resetFilters() {
    // this.showOnlyOpenApps = (this.paramMap.get('showOnlyOpenApps') === 'true');
    this.column = this.paramMap.get('col'); // == null if col isn't present
    this.direction = +this.paramMap.get('dir'); // == 0 if dir isn't present
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public sort(property: string) {
    this.column = property;
    this.direction = this.direction > 0 ? -1 : 1;
    this.saveFilters();
  }

  public showThisApp(item: Species) {
    // return !this.showOnlyOpenApps;
  }
}

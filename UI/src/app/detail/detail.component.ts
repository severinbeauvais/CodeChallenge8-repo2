import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/concat';

import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';
import { Species } from 'app/models/species';
import { ApiService } from 'app/services/api';
import { SpeciesService } from 'app/services/species.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit, OnDestroy {
  public isDeleting = false;
  public species: Species = null;
  public speciesImagePath: SafeResourceUrl = null; // for display image
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer, // to tell Angular src is safe
    public api: ApiService, // used in template
    private dialogService: DialogService,
    public speciesService: SpeciesService
  ) { }

  ngOnInit() {
    // get data from route resolver
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (data: { species: Species }) => {
          if (data.species) {
            this.species = data.species;
            this.speciesImagePath = this.domSanitizer.bypassSecurityTrustResourceUrl(this.species.image.data);
          } else {
            alert('Error loading species');
            this.router.navigate(['/']); // navigate back to home
          }
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public deleteSpecies() {
    this.dialogService.addDialog(ConfirmDialogComponent,
      {
        title: 'Confirm Deletion',
        message: 'Do you really want to delete this species entry?'
      }, {
        backdropColor: 'rgba(0, 0, 0, 0.5)'
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        isConfirmed => {
          if (isConfirmed) {
            this.internalDeleteSpecies();
          }
        }
      );
  }

  private internalDeleteSpecies() {
    this.isDeleting = true;

    this.speciesService.delete(this.species)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isDeleting = false;
          console.log('error =', error);
          alert('Error deleting species');
        },
        () => { // onCompleted
          this.isDeleting = false;
          this.router.navigate(['/']); // navigate back to home
        }
      );
  }
}

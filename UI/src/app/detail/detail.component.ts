import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/concat';
import { of } from 'rxjs';

import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';
import { Species } from 'app/models/species';
import { ApiService } from 'app/services/api';
import { SpeciesService } from 'app/services/application.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})

export class DetailComponent implements OnInit, OnDestroy {

  public isPublishing = false;
  public isUnpublishing = false;
  public isDeleting = false;
  public application: Species = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    public api: ApiService, // also used in template
    private dialogService: DialogService,
    public applicationService: SpeciesService // also used in template
  ) { }

  ngOnInit() {
    // get data from route resolver
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (data: { species: Species }) => {
          if (data.species) {
            this.application = data.species;
          } else {
            alert('Uh-oh, couldn\'t load species');
            // application not found --> navigate back to search
            this.router.navigate(['/search']);
          }
        }
      );
  }

  ngOnDestroy() {
    // dismiss any open snackbar
    if (this.snackBarRef) { this.snackBarRef.dismiss(); }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public deleteApplication() {
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
            this.internalDeleteApplication();
          }
        }
      );
  }

  private internalDeleteApplication() {
    this.isDeleting = true;

    this.applicationService.delete(this.application)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isDeleting = false;
          console.log('error =', error);
          alert('Uh-oh, couldn\'t delete species');
        },
        () => { // onCompleted
          this.isDeleting = false;
          // delete succeeded --> navigate back to search
          this.router.navigate(['/search']);
        }
      );
  }

}

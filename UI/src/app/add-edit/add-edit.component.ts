import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/concat';
import * as _ from 'lodash';

import { Constants } from 'app/utils/constants'; // TODO: use Constants.categories to populate drop-down list
import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';
import { Species } from 'app/models/species';
import { Document } from 'app/models/document';
import { ApiService } from 'app/services/api';
import { SpeciesService } from 'app/services/species.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class AddEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('speciesForm') speciesForm: NgForm;

  private scrollToFragment: string = null;
  public isSubmitSaveClicked = false;
  public isSubmitting = false;
  public isSaving = false;
  public species: Species = null;
  public dateIntroBC: NgbDateStruct = null;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  public speciesFiles: Array<File> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    public api: ApiService, // also also used in template
    private speciesService: SpeciesService,
    private dialogService: DialogService
  ) {
    // if we have an URL fragment, save it for future scrolling
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = router.parseUrl(router.url);
        this.scrollToFragment = (url && url.fragment) || null;
      }
    });
  }

  // check for unsaved changes before closing (or reloading) current tab/window
  @HostListener('window:beforeunload', ['$event'])
  public handleBeforeUnload(event) {
    if (!this.speciesForm) {
      event.returnValue = true; // no form means page error -- allow unload
    }

    // display browser alert if needed
    if (this.speciesForm.dirty || this.anyUnsavedItems()) {
      event.returnValue = true;
    }
  }

  // check for unsaved changes before navigating away from current route (ie, this page)
  public canDeactivate(): Observable<boolean> | boolean {
    if (!this.speciesForm) {
      return true; // no form means page error -- allow deactivate
    }

    // allow synchronous navigation if everything is OK
    if (!this.speciesForm.dirty && !this.anyUnsavedItems()) {
      return true;
    }

    // otherwise prompt the user with observable (asynchronous) dialog
    return this.dialogService.addDialog(ConfirmDialogComponent,
      {
        title: 'Unsaved Changes',
        message: 'Click OK to discard your changes or Cancel to return to the page.'
      }, {
        backdropColor: 'rgba(0, 0, 0, 0.5)'
      })
      .takeUntil(this.ngUnsubscribe);
  }

  // this is needed because we don't have a form control that is marked as dirty
  private anyUnsavedItems(): boolean {
    // look for species documents not yet uploaded to db
    if (this.species.documents) {
      for (const doc of this.species.documents) {
        if (!doc._id) {
          return true;
        }
      }
    }

    return false; // no unsaved items
  }

  public cancelChanges() {
    // NB: don't use 'this.location.back()' as it fails when cancel is cancelled multiple times

    if (this.species._id) {
      // go to details page
      this.router.navigate(['/species', this.species._id]);
    } else {
      this.router.navigate(['/']); // navigate back to home
    }
  }

  ngOnInit() {
    // get data from route resolver
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (data: { species: Species }) => {
          if (data.species) {
            this.species = data.species;
            this.dateIntroBC = this.dateToNgbDate(this.species.dateIntroBC);
          } else {
            alert('Error loading species');
            this.router.navigate(['/']); // navigate back to home
          }
        }
      );
  }

  ngAfterViewInit() {
    // if requested, scroll to specified section
    if (this.scrollToFragment) {
      // ensure element exists
      const element = document.getElementById(this.scrollToFragment);
      if (element) {
        element.scrollIntoView();
      }
    }
  }

  ngOnDestroy() {
    // dismiss any open snackbar
    if (this.snackBarRef) { this.snackBarRef.dismiss(); }

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // converts Date to NgbDateStruct
  private dateToNgbDate(date: Date): NgbDateStruct {
    return date ? { 'year': date.getFullYear(), 'month': date.getMonth() + 1, 'day': date.getDate() } : null;
  }

  // converts NgbDateStruct to Date
  private ngbDateToDate(date: NgbDateStruct): Date {
    return new Date(date.year, (date.month - 1), date.day);
  }

  // used in template
  public isValidDate(date: NgbDateStruct): boolean {
    return (date && !isNaN(date.year) && !isNaN(date.month) && !isNaN(date.day));
  }

  public onDateChg(dateIntroBC: NgbDateStruct) {
    if (dateIntroBC !== null) {
      this.species.dateIntroBC = this.ngbDateToDate(dateIntroBC);
    }
  }

  // add species or decision documents
  public addDocuments(files: FileList, documents: Document[]) {
    if (files && documents) { // safety check
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          // ensure file is not already in the list
          if (_.find(documents, doc => (doc.documentFileName === files[i].name))) {
            this.snackBarRef = this.snackBar.open('Can\'t add duplicate file', null, { duration: 2000 });
            continue;
          }

          const formData = new FormData();
          formData.append('displayName', files[i].name);
          formData.append('upfile', files[i]);

          const document = new Document();
          document['formData'] = formData; // temporary
          document.documentFileName = files[i].name;

          // save document for upload to db when species is added or saved
          documents.push(document);
        }
      }
    }
  }

  // delete species or decision document
  public deleteDocument(doc: Document, documents: Document[]) {
    if (doc && documents) { // safety check
      // remove doc from current list
      _.remove(documents, item => (item.documentFileName === doc.documentFileName));
    }
  }

  // this is part 1 of adding a species and all its objects
  // (multi-part due to dependencies)
  public addSpecies() {
    this.isSubmitSaveClicked = true;

    if (this.speciesForm.invalid) {
      this.dialogService.addDialog(ConfirmDialogComponent,
        {
          title: 'Cannot Create Species',
          message: 'Please check for required fields or errors.',
          okOnly: true
        }, {
          backdropColor: 'rgba(0, 0, 0, 0.5)'
        })
        .takeUntil(this.ngUnsubscribe);
      return;
    }

    this.isSubmitting = true;

    // add species
    this.speciesService.add(this.species)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        species2 => { // onNext
          this.addSpecies2(species2);
        },
        error => {
          this.isSubmitting = false;
          console.log('error =', error);
          alert('Error creating species');
        }
      );
  }

  // this is part 2 of adding a species and all its objects
  // (multi-part due to dependencies)
  private addSpecies2(species2: Species) {
    let observables = of(null);

    // add all species documents
    // if (this.species.documents) {
    //   for (const doc of this.species.documents) {
    //     doc['formData'].append('_species', species2._id); // set back-reference
    //     observables = observables.concat(this.documentService.add(doc['formData']));
    //   }
    // }

    observables
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isSubmitting = false;
          console.log('error =', error);
          alert('Error adding species, part 2');
        },
        () => { // onCompleted
          // we don't need to reload data since we're navigating away below
          // this.isSubmitting = false; // LOOKS BETTER WITHOUT THIS
          // this.snackBarRef = this.snackBar.open('Species created...', null, { duration: 2000 }); // not displayed due to navigate below

          this.speciesForm.form.markAsPristine();
          if (this.species.documents) {
            this.species.documents = []; // negate unsaved document check
          }

          // add succeeded --> navigate to details page
          this.router.navigate(['/species', species2._id]);
        }
      );
  }

  // this is part 1 of saving a species and all its objects
  // (multi-part due to dependencies)
  public saveSpecies() {
    this.isSubmitSaveClicked = true;

    if (this.speciesForm.invalid) {
      this.dialogService.addDialog(ConfirmDialogComponent,
        {
          title: 'Cannot Save Species',
          message: 'Please check for required fields or errors.',
          okOnly: true
        }, {
          backdropColor: 'rgba(0, 0, 0, 0.5)'
        })
        .takeUntil(this.ngUnsubscribe);
      return;
    }

    if (!this.species.description) {
      this.dialogService.addDialog(ConfirmDialogComponent,
        {
          title: 'Cannot Save Changes',
          message: 'A description for this species is required to save.',
          okOnly: true
        }, {
          backdropColor: 'rgba(0, 0, 0, 0.5)'
        })
        .takeUntil(this.ngUnsubscribe);
      return;
    }

    this.isSaving = true;

    let observables = of(null);

    // add any new species documents
    // if (this.species.documents) {
    //   for (const doc of this.species.documents) {
    //     if (!doc._id) {
    //       doc['formData'].append('_species', this.species._id); // set back-reference
    //       observables = observables.concat(this.documentService.add(doc['formData']));
    //     }
    //   }
    // }

    observables
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isSaving = false;
          console.log('error =', error);
          alert('Error saving species, part 1');
        },
        () => { // onCompleted
          // reload app with documents, current period and decision for next step
          this.speciesService.getById(this.species._id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
              species2 => {
                this.saveSpecies2(species2);
              },
              error => {
                this.isSaving = false;
                console.log('error =', error);
                alert('Error reloading species, part 1');
              }
            );
        }
      );
  }

  // this is part 2 of saving a species and all its objects
  // (multi-part due to dependencies)
  private saveSpecies2(species2: Species) {
    // save species
    this.speciesService.save(this.species)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isSaving = false;
          console.log('error =', error);
          alert('Error saving species, part 3');
        },
        () => { // onCompleted
          // we don't need to reload data since we're navigating away below
          // this.isSaving = false; // LOOKS BETTER WITHOUT THIS
          // this.snackBarRef = this.snackBar.open('Species saved...', null, { duration: 2000 }); // not displayed due to navigate below

          this.speciesForm.form.markAsPristine();

          if (this.species.documents) {
            for (const doc of this.species.documents) {
              // assign 'arbitrary' id to docs so that:
              // 1) unsaved document check passes
              // 2) page doesn't jump around
              doc._id = '0';
            }
          }

          // save succeeded --> navigate to details page
          this.router.navigate(['/species', species2._id]);
        }
      );
  }
}

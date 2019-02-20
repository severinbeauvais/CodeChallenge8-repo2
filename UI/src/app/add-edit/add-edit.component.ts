import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { Location } from '@angular/common';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/concat';
import * as moment from 'moment';
import * as _ from 'lodash';

import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';
import { Application } from 'app/models/application';
import { Document } from 'app/models/document';
import { ApiService } from 'app/services/api';
import { ApplicationService } from 'app/services/application.service';
import { DocumentService } from 'app/services/document.service';

const DEFAULT_DAYS = 30;

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class AddEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('applicationForm') applicationForm: NgForm;

  private scrollToFragment: string = null;
  public isSubmitSaveClicked = false;
  public isSubmitting = false;
  public isSaving = false;
  public application: Application = null;
  public startDate: NgbDateStruct = null;
  public endDate: NgbDateStruct = null;
  public delta: number; // # days (including today)
  private snackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();
  private docsToDelete: Document[] = [];
  public applicationFiles: Array<File> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private location: Location,
    public snackBar: MatSnackBar,
    public api: ApiService, // also also used in template
    private applicationService: ApplicationService,
    private dialogService: DialogService,
    private documentService: DocumentService
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
    if (!this.applicationForm) {
      event.returnValue = true; // no form means page error -- allow unload
    }

    // display browser alert if needed
    if (this.applicationForm.dirty || this.anyUnsavedItems()) {
      event.returnValue = true;
    }
  }

  // check for unsaved changes before navigating away from current route (ie, this page)
  public canDeactivate(): Observable<boolean> | boolean {
    if (!this.applicationForm) {
      return true; // no form means page error -- allow deactivate
    }

    // allow synchronous navigation if everything is OK
    if (!this.applicationForm.dirty && !this.anyUnsavedItems()) {
      return true;
    }

    // otherwise prompt the user with observable (asynchronous) dialog
    return this.dialogService.addDialog(ConfirmDialogComponent,
      {
        title: 'Unsaved Changes',
        message: 'Click OK to discard your changes or Cancel to return to the application.'
      }, {
        backdropColor: 'rgba(0, 0, 0, 0.5)'
      })
      .takeUntil(this.ngUnsubscribe);
  }

  // this is needed because we don't have a form control that is marked as dirty
  private anyUnsavedItems(): boolean {
    // look for application documents not yet uploaded to db
    if (this.application.documents) {
      for (const doc of this.application.documents) {
        if (!doc._id) {
          return true;
        }
      }
    }

    // look for application or decision documents not yet removed from db
    if (this.docsToDelete && this.docsToDelete.length > 0) {
      return true;
    }

    return false; // no unsaved items
  }

  public cancelChanges() {
    // this.location.back(); // FAILS WHEN CANCEL IS CANCELLED (DUE TO DIRTY FORM OR UNSAVED DOCUMENTS) MULTIPLE TIMES

    if (this.application._id) {
      // go to details page
      this.router.navigate(['/a', this.application._id]);
    } else {
      // go to search page
      this.router.navigate(['/search']);
    }
  }

  ngOnInit() {
    // get data from route resolver
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (data: { application: Application }) => {
          if (data.application) {
            this.application = data.application;

            // add comment period if there isn't one already (not just on create but also on edit --
            // this will fix the situation where existing applications don't have a comment period)
            // set startDate
            this.startDate = this.dateToNgbDate(new Date());
            // set endDate and delta
            this.endDate = this.dateToNgbDate(new Date());
            this.onEndDateChg(this.endDate);
          } else {
            alert('Uh-oh, couldn\'t load application');
            // application not found --> navigate back to search
            this.router.navigate(['/search']);
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

  private dateToNgbDate(date: Date): NgbDateStruct {
    return date ? { 'year': date.getFullYear(), 'month': date.getMonth() + 1, 'day': date.getDate() } : null;
  }

  private ngbDateToDate(date: NgbDateStruct): Date {
    return new Date(date.year, (date.month - 1), date.day);
  }

  // used in template
  public isValidDate(date: NgbDateStruct): boolean {
    return (date && !isNaN(date.year) && !isNaN(date.month) && !isNaN(date.day));
  }

  public onStartDateChg(startDate: NgbDateStruct) {
    if (startDate !== null) {
    }
  }

  public onDeltaChg(delta: number) {
    if (delta !== null) {
      this.delta = delta;
    }
  }

  public onEndDateChg(endDate: NgbDateStruct) {
    if (endDate !== null) {
    }
  }

  // add application or decision documents
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

          // save document for upload to db when application is added or saved
          documents.push(document);
        }
      }
    }
  }

  // delete application or decision document
  public deleteDocument(doc: Document, documents: Document[]) {
    if (doc && documents) { // safety check
      // remove doc from current list
      _.remove(documents, item => (item.documentFileName === doc.documentFileName));

      if (doc._id) {
        // save document for removal from db when application is saved
        this.docsToDelete.push(doc);
      }
    }
  }

  // this is part 1 of adding an application and all its objects
  // (multi-part due to dependencies)
  public addApplication() {
    this.isSubmitSaveClicked = true;

    if (this.applicationForm.invalid) {
      this.dialogService.addDialog(ConfirmDialogComponent,
        {
          title: 'Cannot Create Application',
          message: 'Please check for required fields or errors.',
          okOnly: true
        }, {
          backdropColor: 'rgba(0, 0, 0, 0.5)'
        })
        .takeUntil(this.ngUnsubscribe);
      return;
    }

    this.isSubmitting = true;

    // add application
    this.applicationService.add(this.application)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        application2 => { // onNext
          this.addApplication2(application2);
        },
        error => {
          this.isSubmitting = false;
          console.log('error =', error);
          alert('Uh-oh, couldn\'t create application');
        }
      );
  }

  // this is part 2 of adding an application and all its objects
  // (multi-part due to dependencies)
  private addApplication2(application2: Application) {
    let observables = of(null);

    // add all application documents
    if (this.application.documents) {
      for (const doc of this.application.documents) {
        doc['formData'].append('_application', application2._id); // set back-reference
        observables = observables.concat(this.documentService.add(doc['formData']));
      }
    }

    observables
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isSubmitting = false;
          console.log('error =', error);
          alert('Uh-oh, couldn\'t add application, part 2');
        },
        () => { // onCompleted
          // reload app with decision for next step
          this.applicationService.getById(application2._id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
              application3 => {
                this.addApplication3(application3);
              },
              error => {
                this.isSubmitting = false;
                console.log('error =', error);
                alert('Uh-oh, couldn\'t reload application, part 2');
              }
            );
        }
      );
  }

  // this is part 3 of adding an application and all its objects
  // (multi-part due to dependencies)
  private addApplication3(application3: Application) {
    let observables = of(null);

    observables
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isSubmitting = false;
          console.log('error =', error);
          alert('Uh-oh, couldn\'t save application, part 3');
        },
        () => { // onCompleted
          // we don't need to reload data since we're navigating away below
          // this.isSubmitting = false; // LOOKS BETTER WITHOUT THIS
          // this.snackBarRef = this.snackBar.open('Application created...', null, { duration: 2000 }); // not displayed due to navigate below

          this.applicationForm.form.markAsPristine();
          if (this.application.documents) {
            this.application.documents = []; // negate unsaved document check
          }

          // add succeeded --> navigate to details page
          this.router.navigate(['/a', application3._id]);
        }
      );
  }

  // this is part 1 of saving an application and all its objects
  // (multi-part due to dependencies)
  public saveApplication() {
    this.isSubmitSaveClicked = true;

    if (this.applicationForm.invalid) {
      this.dialogService.addDialog(ConfirmDialogComponent,
        {
          title: 'Cannot Save Application',
          message: 'Please check for required fields or errors.',
          okOnly: true
        }, {
          backdropColor: 'rgba(0, 0, 0, 0.5)'
        })
        .takeUntil(this.ngUnsubscribe);
      return;
    }

    if (!this.application.description) {
      this.dialogService.addDialog(ConfirmDialogComponent,
        {
          title: 'Cannot Save Changes',
          message: 'A description for this application is required to save.',
          okOnly: true
        }, {
          backdropColor: 'rgba(0, 0, 0, 0.5)'
        })
        .takeUntil(this.ngUnsubscribe);
      return;
    }

    this.isSaving = true;

    let observables = of(null);

    // delete staged application and decision documents
    // NB: delete first and add below -- in case the user wants to simultaneously
    //     delete an old doc and add a new doc with the same name
    for (const doc of this.docsToDelete) {
      observables = observables.concat(this.documentService.delete(doc));
    }
    this.docsToDelete = []; // assume delete succeeds

    // add any new application documents
    if (this.application.documents) {
      for (const doc of this.application.documents) {
        if (!doc._id) {
          doc['formData'].append('_application', this.application._id); // set back-reference
          observables = observables.concat(this.documentService.add(doc['formData']));
        }
      }
    }

    observables
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isSaving = false;
          console.log('error =', error);
          alert('Uh-oh, couldn\'t save application, part 1');
        },
        () => { // onCompleted
          // reload app with documents, current period and decision for next step
          this.applicationService.getById(this.application._id, { getDocuments: true })
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
              application2 => {
                this.saveApplication2(application2);
              },
              error => {
                this.isSaving = false;
                console.log('error =', error);
                alert('Uh-oh, couldn\'t reload application, part 1');
              }
            );
        }
      );
  }

  // this is part 2 of saving an application and all its objects
  // (multi-part due to dependencies)
  private saveApplication2(application2: Application) {
    let observables = of(null);

    observables
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isSaving = false;
          console.log('error =', error);
          alert('Uh-oh, couldn\'t save application, part 2');
        },
        () => { // onCompleted
          // reload app with decision for next step
          this.applicationService.getById(application2._id)
            .takeUntil(this.ngUnsubscribe)
            .subscribe(
              application3 => {
                this.saveApplication3(application3);
              },
              error => {
                this.isSaving = false;
                console.log('error =', error);
                alert('Uh-oh, couldn\'t reload application, part 2');
              }
            );
        }
      );
  }

  // this is part 3 of saving an application and all its objects
  // (multi-part due to dependencies)
  private saveApplication3(application3: Application) {
    let observables = of(null);

    // save application
    observables = observables.concat(this.applicationService.save(this.application));

    observables
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        () => { // onNext
          // do nothing here - see onCompleted() function below
        },
        error => {
          this.isSaving = false;
          console.log('error =', error);
          alert('Uh-oh, couldn\'t save application, part 3');
        },
        () => { // onCompleted
          // we don't need to reload data since we're navigating away below
          // this.isSaving = false; // LOOKS BETTER WITHOUT THIS
          // this.snackBarRef = this.snackBar.open('Application saved...', null, { duration: 2000 }); // not displayed due to navigate below

          this.applicationForm.form.markAsPristine();

          if (this.application.documents) {
            for (const doc of this.application.documents) {
              // assign 'arbitrary' id to docs so that:
              // 1) unsaved document check passes
              // 2) page doesn't jump around
              doc._id = '0';
            }
          }

          // save succeeded --> navigate to details page
          this.router.navigate(['/a', application3._id]);
        }
      );
  }

}

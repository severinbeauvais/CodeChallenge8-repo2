import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/concat';
import * as _ from 'lodash';
import { Md5 } from 'ts-md5/dist/md5';

import { Constants } from 'app/utils/constants';
import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';
import { Species, Image } from 'app/models/species';
import { ApiService } from 'app/services/api';
import { SpeciesService } from 'app/services/species.service';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})

export class AddEditComponent implements OnInit, OnDestroy {
  @ViewChild('speciesForm') speciesForm: NgForm;

  public isSubmitSaveClicked = false;
  public isSubmitting = false;
  public isSaving = false;
  public species: Species = null;
  public dateIntroBC: NgbDateStruct = null; // for date picker
  public tempFiles: Array<File> = []; // for file upload
  public imagePath: SafeResourceUrl = null; // for display image
  public filterKeys: Array<string> = [];
  private anyUnsavedItems = false; // for form controls that don't have 'dirty' flag
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer, // to tell Angular src is safe
    public api: ApiService,
    private speciesService: SpeciesService,
    private dialogService: DialogService
  ) { }

  // check for unsaved changes before closing (or reloading) current tab/window
  @HostListener('window:beforeunload', ['$event'])
  public handleBeforeUnload(event) {
    if (!this.speciesForm) {
      event.returnValue = true; // no form means page error -- allow unload
    }

    // display browser alert if needed
    if (this.speciesForm.dirty || this.anyUnsavedItems) {
      event.returnValue = true;
    }
  }

  // check for unsaved changes before navigating away from current route (ie, this page)
  public canDeactivate(): Observable<boolean> | boolean {
    if (!this.speciesForm) {
      return true; // no form means page error -- allow deactivate
    }

    // allow synchronous navigation if everything is OK
    if (!this.speciesForm.dirty && !this.anyUnsavedItems) {
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
    // load filter keys
    // NB: no initial filter
    Constants.categories.forEach(key => this.filterKeys.push(key));

    // get data from route resolver
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (data: { species: Species }) => {
          if (data.species) {
            this.species = data.species;
            this.imagePath = this.domSanitizer.bypassSecurityTrustResourceUrl(this.species.image.data);
            this.dateIntroBC = this.dateToNgbDate(this.species.dateIntroBC);
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

  // add/update species image
  public addImage(files: FileList) {
    if (files && files.length >= 1) { // safety check (NB: we only load first one)
      // convert Blob to base-64 encoded string
      const reader = new FileReader();
      reader.readAsDataURL(files[0].slice());
      reader.onloadend = () => {
        const base64data = reader.result;

        // create new image
        this.species.image = new Image({
          name: files[0].name,
          type: files[0].type,
          data: base64data,
          size: files[0].size,
          md5: Md5.hashStr(base64data.toString())
        });
        this.imagePath = this.domSanitizer.bypassSecurityTrustResourceUrl(this.species.image.data);
        this.anyUnsavedItems = true;
      };
    }
  }

  public deleteImage() {
    this.species.image = new Image(); // empty image
    this.imagePath = this.domSanitizer.bypassSecurityTrustResourceUrl(this.species.image.data);
    this.anyUnsavedItems = true;
  }

  // add a new species to the library
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

    this.speciesService.add(this.species)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        species => { // onNext
          // we don't need to reload data since we're navigating away below
          // this.isSubmitting = false; // LOOKS BETTER WITHOUT THIS

          this.speciesForm.form.markAsPristine();
          this.anyUnsavedItems = false;

          // add succeeded --> navigate to details page
          this.router.navigate(['/species', species._id]);
        },
        error => {
          this.isSubmitting = false;
          console.log('error =', error);
          alert('Error creating species');
        }
      );
  }

  // save an existing species to the library
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

    // if (!this.species.description) {
    //   this.dialogService.addDialog(ConfirmDialogComponent,
    //     {
    //       title: 'Cannot Save Changes',
    //       message: 'A description for this species is required to save.',
    //       okOnly: true
    //     }, {
    //       backdropColor: 'rgba(0, 0, 0, 0.5)'
    //     })
    //     .takeUntil(this.ngUnsubscribe);
    //   return;
    // }

    this.isSaving = true;

    this.speciesService.save(this.species)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        species => { // onNext
          // we don't need to reload data since we're navigating away below
          // this.isSaving = false; // LOOKS BETTER WITHOUT THIS

          this.speciesForm.form.markAsPristine();
          this.anyUnsavedItems = false;

          // save succeeded --> navigate to details page
          this.router.navigate(['/species', species._id]);
        },
        error => {
          this.isSaving = false;
          console.log('error =', error);
          alert('Error saving species, part 3');
        }
      );
  }
}

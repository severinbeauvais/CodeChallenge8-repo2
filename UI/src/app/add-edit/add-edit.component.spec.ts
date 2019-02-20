import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'ng2-bootstrap-modal';

import { AddEditComponent } from './add-edit.component';
import { FileUploadComponent } from 'app/file-upload/file-upload.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar } from '@angular/material';
import { ApiService } from 'app/services/api';
import { ApplicationService } from 'app/services/application.service';
import { DocumentService } from 'app/services/document.service';

xdescribe('AddEditComponent', () => {
  let component: AddEditComponent;
  let fixture: ComponentFixture<AddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, NgbModule, RouterTestingModule ],
      declarations: [AddEditComponent, FileUploadComponent],
      providers: [
        { provide: DialogService },
        { provide: MatSnackBar },
        { provide: ApiService },
        { provide: ApplicationService },
        { provide: DocumentService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

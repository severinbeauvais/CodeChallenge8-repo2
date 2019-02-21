import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DialogService } from 'ng2-bootstrap-modal';
import { AddEditComponent } from './add-edit.component';
import { FileUploadComponent } from 'app/file-upload/file-upload.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from 'app/services/api';
import { SpeciesService } from 'app/services/species.service';

describe('AddEditComponent', () => {
  let component: AddEditComponent;
  let fixture: ComponentFixture<AddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, NgbModule, RouterTestingModule ],
      declarations: [AddEditComponent, FileUploadComponent],
      providers: [
        { provide: DialogService },
        { provide: ApiService },
        { provide: SpeciesService }
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

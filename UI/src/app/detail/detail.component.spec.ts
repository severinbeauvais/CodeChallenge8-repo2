import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NewlinesPipe } from 'app/pipes/newlines.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material';
import { DialogService } from 'ng2-bootstrap-modal';
import { ApiService } from 'app/services/api';
import { SpeciesService } from 'app/services/species.service';
import { Species } from 'app/models/species';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from 'app/utils/helpers';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  const existingApplication = new Species();
  const validRouteData = {application: existingApplication};

  const activatedRouteStub = new ActivatedRouteStub(validRouteData);
  const routerSpy = {
    navigate: jasmine.createSpy('navigate')
  };

  const speciesServiceStub = {
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DetailComponent, NewlinesPipe],
      imports: [RouterTestingModule, NgbModule],
      providers: [
        { provide: MatSnackBar },
        { provide: ApiService },
        { provide: DialogService },
        { provide: SpeciesService, useValue: speciesServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerSpy },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  describe('when the application is retrievable from the route', () => {
    beforeEach(() => {
      activatedRouteStub.setData(validRouteData);
    });

    it('sets the component application to the one from the route', () => {
      expect(component.species).toEqual(existingApplication);
    });
  });

  describe('when the application is not available from the route', () => {
    beforeEach(() => {
      activatedRouteStub.setData({something: 'went wrong'});
    });

    it('redirects to /', () => {
      component.ngOnInit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});

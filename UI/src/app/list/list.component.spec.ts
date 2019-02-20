import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSlideToggleModule } from '@angular/material';
import { OrderByPipe } from 'app/pipes/order-by.pipe';
import { NewlinesPipe } from 'app/pipes/newlines.pipe';
import { SpeciesService } from 'app/services/application.service';
import { Species } from 'app/models/species';
import { of } from 'rxjs';
import { throwError } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const applicationServiceStub = {
    getAll() {
      return of([]);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent, OrderByPipe, NewlinesPipe],
      imports: [RouterTestingModule, MatSlideToggleModule],
      providers: [
        { provide: SpeciesService, useValue: applicationServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('when applications are returned from the service', () => {
    const existingApplications = [
      new Species(),
      new Species()
    ];

    beforeEach(() => {
      let applicationService = TestBed.get(SpeciesService);
      spyOn(applicationService, 'getAll').and.returnValue(of(existingApplications));
    });

    it('sets the component application to the one from the route', () => {
      component.ngOnInit();
      expect(component.species).toEqual(existingApplications);
    });
  });

  describe('when the application service throws an error', () => {
    beforeEach(() => {
      let applicationService = TestBed.get(SpeciesService);
      spyOn(applicationService, 'getAll').and.returnValue(throwError('Beep boop server error'));
    });

    it('redirects to root', () => {
      let navigateSpy = spyOn((<any>component).router, 'navigate');

      component.ngOnInit();

      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });
  });
});

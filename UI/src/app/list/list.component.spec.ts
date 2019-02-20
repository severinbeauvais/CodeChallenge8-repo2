import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComponent } from './list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSlideToggleModule } from '@angular/material';
import { OrderByPipe } from 'app/pipes/order-by.pipe';
import { NewlinesPipe } from 'app/pipes/newlines.pipe';
import { SpeciesService } from 'app/services/species.service';
import { Species } from 'app/models/species';
import { of } from 'rxjs';
import { throwError } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  const speciesServiceStub = {
    getAll() {
      return of([]);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListComponent, OrderByPipe, NewlinesPipe],
      imports: [RouterTestingModule, MatSlideToggleModule],
      providers: [
        { provide: SpeciesService, useValue: speciesServiceStub }
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

  describe('when species are returned from the service', () => {
    const existingSpeciesArray = [
      new Species(),
      new Species()
    ];

    beforeEach(() => {
      let speciesService = TestBed.get(SpeciesService);
      spyOn(speciesService, 'getAll').and.returnValue(of(existingSpeciesArray));
    });

    it('sets the component species to the one from the route', () => {
      component.ngOnInit();
      expect(component.species).toEqual(existingSpeciesArray);
    });
  });

  describe('when the species service throws an error', () => {
    beforeEach(() => {
      let speciesService = TestBed.get(SpeciesService);
      spyOn(speciesService, 'getAll').and.returnValue(throwError('Beep boop server error'));
    });

    it('redirects to root', () => {
      let navigateSpy = spyOn((<any>component).router, 'navigate');

      component.ngOnInit();

      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });
  });
});

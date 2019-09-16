import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelSearchFormComponentComponent } from './personnel-search-form-component.component';

describe('PersonnelSearchFormComponentComponent', () => {
  let component: PersonnelSearchFormComponentComponent;
  let fixture: ComponentFixture<PersonnelSearchFormComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelSearchFormComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelSearchFormComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

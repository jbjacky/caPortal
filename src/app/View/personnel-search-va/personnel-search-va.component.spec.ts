import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelSearchVaComponent } from './personnel-search-va.component';

describe('PersonnelSearchVaComponent', () => {
  let component: PersonnelSearchVaComponent;
  let fixture: ComponentFixture<PersonnelSearchVaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelSearchVaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelSearchVaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

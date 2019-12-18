import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelSearchCardTimeComponent } from './personnel-search-card-time.component';

describe('PersonnelSearchCardTimeComponent', () => {
  let component: PersonnelSearchCardTimeComponent;
  let fixture: ComponentFixture<PersonnelSearchCardTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelSearchCardTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelSearchCardTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

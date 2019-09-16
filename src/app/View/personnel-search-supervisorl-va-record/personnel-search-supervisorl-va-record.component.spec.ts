import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelSearchSupervisorlVaRecordComponent } from './personnel-search-supervisorl-va-record.component';

describe('PersonnelSearchSupervisorlVaRecordComponent', () => {
  let component: PersonnelSearchSupervisorlVaRecordComponent;
  let fixture: ComponentFixture<PersonnelSearchSupervisorlVaRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelSearchSupervisorlVaRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelSearchSupervisorlVaRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

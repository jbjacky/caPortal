import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnelSearchSurplusLeaveComponent } from './personnel-search-surplus-leave.component';

describe('PersonnelSearchSurplusLeaveComponent', () => {
  let component: PersonnelSearchSurplusLeaveComponent;
  let fixture: ComponentFixture<PersonnelSearchSurplusLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnelSearchSurplusLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnelSearchSurplusLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

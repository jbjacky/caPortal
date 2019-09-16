import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptCalendarSearchComponent } from './dept-calendar-search.component';

describe('DeptCalendarSearchComponent', () => {
  let component: DeptCalendarSearchComponent;
  let fixture: ComponentFixture<DeptCalendarSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeptCalendarSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptCalendarSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

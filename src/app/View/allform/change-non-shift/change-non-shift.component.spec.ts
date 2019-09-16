import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeNonShiftComponent } from './change-non-shift.component';

describe('ChangeNonShiftComponent', () => {
  let component: ChangeNonShiftComponent;
  let fixture: ComponentFixture<ChangeNonShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeNonShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeNonShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

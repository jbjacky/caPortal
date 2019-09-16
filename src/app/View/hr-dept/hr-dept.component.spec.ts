import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HrDeptComponent } from './hr-dept.component';

describe('HrDeptComponent', () => {
  let component: HrDeptComponent;
  let fixture: ComponentFixture<HrDeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HrDeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HrDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

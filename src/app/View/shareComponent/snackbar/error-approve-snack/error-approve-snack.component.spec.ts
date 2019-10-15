import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorApproveSnackComponent } from './error-approve-snack.component';

describe('ErrorApproveSnackComponent', () => {
  let component: ErrorApproveSnackComponent;
  let fixture: ComponentFixture<ErrorApproveSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorApproveSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorApproveSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSendbackSnackComponent } from './error-sendback-snack.component';

describe('ErrorSendbackSnackComponent', () => {
  let component: ErrorSendbackSnackComponent;
  let fixture: ComponentFixture<ErrorSendbackSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorSendbackSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorSendbackSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

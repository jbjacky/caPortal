import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPutForwardSnackComponent } from './error-put-forward-snack.component';

describe('ErrorPutForwardSnackComponent', () => {
  let component: ErrorPutForwardSnackComponent;
  let fixture: ComponentFixture<ErrorPutForwardSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorPutForwardSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPutForwardSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

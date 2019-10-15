import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SussesSendbackSnackComponent } from './susses-sendback-snack.component';

describe('SussesSendbackSnackComponent', () => {
  let component: SussesSendbackSnackComponent;
  let fixture: ComponentFixture<SussesSendbackSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SussesSendbackSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SussesSendbackSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

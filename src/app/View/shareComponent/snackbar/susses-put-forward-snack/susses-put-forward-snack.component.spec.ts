import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SussesPutForwardSnackComponent } from './susses-put-forward-snack.component';

describe('SussesPutForwardSnackComponent', () => {
  let component: SussesPutForwardSnackComponent;
  let fixture: ComponentFixture<SussesPutForwardSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SussesPutForwardSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SussesPutForwardSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

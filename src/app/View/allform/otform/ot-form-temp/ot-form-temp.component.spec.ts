import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtFormTempComponent } from './ot-form-temp.component';

describe('OtFormTempComponent', () => {
  let component: OtFormTempComponent;
  let fixture: ComponentFixture<OtFormTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtFormTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtFormTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

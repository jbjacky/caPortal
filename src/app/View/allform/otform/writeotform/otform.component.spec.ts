import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtFormComponent } from './otform.component';

describe('OtFormComponent', () => {
  let component: OtFormComponent;
  let fixture: ComponentFixture<OtFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

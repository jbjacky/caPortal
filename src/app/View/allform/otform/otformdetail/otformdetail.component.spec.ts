import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtFormDetailComponent } from './otformdetail.component';

describe('OtFormDetailComponent', () => {
  let component: OtFormDetailComponent;
  let fixture: ComponentFixture<OtFormDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtFormDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtFormDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

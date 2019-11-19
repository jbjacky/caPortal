import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtformdetailComponent } from './otformdetail.component';

describe('OtformdetailComponent', () => {
  let component: OtformdetailComponent;
  let fixture: ComponentFixture<OtformdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtformdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtformdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

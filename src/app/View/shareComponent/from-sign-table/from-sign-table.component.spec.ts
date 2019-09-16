import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromSignTableComponent } from './from-sign-table.component';

describe('FromSignTableComponent', () => {
  let component: FromSignTableComponent;
  let fixture: ComponentFixture<FromSignTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromSignTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromSignTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

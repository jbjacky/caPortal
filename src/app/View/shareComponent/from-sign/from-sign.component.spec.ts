import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FromSignComponent } from './from-sign.component';

describe('FromSignComponent', () => {
  let component: FromSignComponent;
  let fixture: ComponentFixture<FromSignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FromSignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FromSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

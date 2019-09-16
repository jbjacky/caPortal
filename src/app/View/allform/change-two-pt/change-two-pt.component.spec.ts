import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTwoPTComponent } from './change-two-pt.component';

describe('ChangeTwoPTComponent', () => {
  let component: ChangeTwoPTComponent;
  let fixture: ComponentFixture<ChangeTwoPTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTwoPTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTwoPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

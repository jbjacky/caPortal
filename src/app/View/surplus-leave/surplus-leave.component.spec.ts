import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurplusLeaveComponent } from './surplus-leave.component';

describe('SurplusLeaveComponent', () => {
  let component: SurplusLeaveComponent;
  let fixture: ComponentFixture<SurplusLeaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurplusLeaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurplusLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

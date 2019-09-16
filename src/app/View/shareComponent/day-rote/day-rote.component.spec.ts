import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayRoteComponent } from './day-rote.component';

describe('DayRoteComponent', () => {
  let component: DayRoteComponent;
  let fixture: ComponentFixture<DayRoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayRoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayRoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

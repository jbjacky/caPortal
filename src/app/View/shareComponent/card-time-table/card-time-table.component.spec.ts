import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTimeTableComponent } from './card-time-table.component';

describe('CardTimeTableComponent', () => {
  let component: CardTimeTableComponent;
  let fixture: ComponentFixture<CardTimeTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTimeTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTimeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

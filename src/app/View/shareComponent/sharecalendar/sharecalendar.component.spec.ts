import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharecalendarComponent } from './sharecalendar.component';

describe('SharecalendarComponent', () => {
  let component: SharecalendarComponent;
  let fixture: ComponentFixture<SharecalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharecalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharecalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

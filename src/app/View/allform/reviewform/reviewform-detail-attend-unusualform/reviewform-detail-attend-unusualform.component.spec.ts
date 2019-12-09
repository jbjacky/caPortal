import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewformDetailAttendUnusualformComponent } from './reviewform-detail-attend-unusualform.component';

describe('ReviewformDetailAttendUnusualformComponent', () => {
  let component: ReviewformDetailAttendUnusualformComponent;
  let fixture: ComponentFixture<ReviewformDetailAttendUnusualformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewformDetailAttendUnusualformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewformDetailAttendUnusualformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

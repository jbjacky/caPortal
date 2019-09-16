import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewformDetailForgetformComponent } from './reviewform-detail-forgetform.component';

describe('ReviewformDetailForgetformComponent', () => {
  let component: ReviewformDetailForgetformComponent;
  let fixture: ComponentFixture<ReviewformDetailForgetformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewformDetailForgetformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewformDetailForgetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

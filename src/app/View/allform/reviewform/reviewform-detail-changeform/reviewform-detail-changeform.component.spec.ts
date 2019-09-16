import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewformDetailChangeformComponent } from './reviewform-detail-changeform.component';

describe('ReviewformDetailChangeformComponent', () => {
  let component: ReviewformDetailChangeformComponent;
  let fixture: ComponentFixture<ReviewformDetailChangeformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewformDetailChangeformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewformDetailChangeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

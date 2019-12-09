import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewformDetailCardPatchformComponent } from './reviewform-detail-card-patchform.component';

describe('ReviewformDetailCardPatchformComponent', () => {
  let component: ReviewformDetailCardPatchformComponent;
  let fixture: ComponentFixture<ReviewformDetailCardPatchformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewformDetailCardPatchformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewformDetailCardPatchformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

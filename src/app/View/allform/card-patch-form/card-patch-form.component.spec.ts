import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPatchFormComponent } from './card-patch-form.component';

describe('CardPatchFormComponent', () => {
  let component: CardPatchFormComponent;
  let fixture: ComponentFixture<CardPatchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPatchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

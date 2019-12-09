import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPatchFormWriteComponent } from './card-patch-form-write.component';

describe('CardPatchFormWriteComponent', () => {
  let component: CardPatchFormWriteComponent;
  let fixture: ComponentFixture<CardPatchFormWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPatchFormWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPatchFormWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

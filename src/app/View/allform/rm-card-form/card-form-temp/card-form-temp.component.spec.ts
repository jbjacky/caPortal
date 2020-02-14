import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFormTempComponent } from './card-form-temp.component';

describe('CardFormTempComponent', () => {
  let component: CardFormTempComponent;
  let fixture: ComponentFixture<CardFormTempComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardFormTempComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFormTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

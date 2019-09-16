import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosedeptMAComponent } from './choosedept-ma.component';

describe('ChoosedeptMAComponent', () => {
  let component: ChoosedeptMAComponent;
  let fixture: ComponentFixture<ChoosedeptMAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosedeptMAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosedeptMAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

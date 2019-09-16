import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosebaseMAComponent } from './choosebase-ma.component';

describe('ChoosebaseMAComponent', () => {
  let component: ChoosebaseMAComponent;
  let fixture: ComponentFixture<ChoosebaseMAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosebaseMAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosebaseMAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

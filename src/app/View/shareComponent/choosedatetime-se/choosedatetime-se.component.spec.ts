import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosedatetimeSeComponent } from './choosedatetime-se.component';

describe('ChoosedatetimeSeComponent', () => {
  let component: ChoosedatetimeSeComponent;
  let fixture: ComponentFixture<ChoosedatetimeSeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosedatetimeSeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosedatetimeSeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

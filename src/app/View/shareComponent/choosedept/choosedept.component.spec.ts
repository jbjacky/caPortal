import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoosedeptComponent } from './choosedept.component';

describe('ChoosedeptComponent', () => {
  let component: ChoosedeptComponent;
  let fixture: ComponentFixture<ChoosedeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosedeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosedeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

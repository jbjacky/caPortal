import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRzNRComponent } from './change-rz-nr.component';

describe('ChangeRzNRComponent', () => {
  let component: ChangeRzNRComponent;
  let fixture: ComponentFixture<ChangeRzNRComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRzNRComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRzNRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRzComponent } from './change-rz.component';

describe('ChangeRzComponent', () => {
  let component: ChangeRzComponent;
  let fixture: ComponentFixture<ChangeRzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckdialogComponent } from './checkdialog.component';

describe('CheckdialogComponent', () => {
  let component: CheckdialogComponent;
  let fixture: ComponentFixture<CheckdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

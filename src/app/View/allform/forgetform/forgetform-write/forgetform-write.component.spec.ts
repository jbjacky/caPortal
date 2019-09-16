import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetformWriteComponent } from './forgetform-write.component';

describe('ForgetformWriteComponent', () => {
  let component: ForgetformWriteComponent;
  let fixture: ComponentFixture<ForgetformWriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetformWriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetformWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

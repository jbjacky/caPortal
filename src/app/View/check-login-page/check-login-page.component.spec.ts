import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckLoginPageComponent } from './check-login-page.component';

describe('CheckLoginPageComponent', () => {
  let component: CheckLoginPageComponent;
  let fixture: ComponentFixture<CheckLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckLoginPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

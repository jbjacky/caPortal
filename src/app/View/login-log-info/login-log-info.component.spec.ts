import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLogInfoComponent } from './login-log-info.component';

describe('LoginLogInfoComponent', () => {
  let component: LoginLogInfoComponent;
  let fixture: ComponentFixture<LoginLogInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginLogInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

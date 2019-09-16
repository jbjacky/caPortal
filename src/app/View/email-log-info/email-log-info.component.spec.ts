import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLogInfoComponent } from './email-log-info.component';

describe('EmailLogInfoComponent', () => {
  let component: EmailLogInfoComponent;
  let fixture: ComponentFixture<EmailLogInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailLogInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLogInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailContentEditComponent } from './email-content-edit.component';

describe('EmailContentEditComponent', () => {
  let component: EmailContentEditComponent;
  let fixture: ComponentFixture<EmailContentEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailContentEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailContentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

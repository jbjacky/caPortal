import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSalaryTemplateComponent } from './set-salary-template.component';

describe('SetSalaryTemplateComponent', () => {
  let component: SetSalaryTemplateComponent;
  let fixture: ComponentFixture<SetSalaryTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetSalaryTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetSalaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

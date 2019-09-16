import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonRoleSettingComponent } from './person-role-setting.component';

describe('PersonRoleSettingComponent', () => {
  let component: PersonRoleSettingComponent;
  let fixture: ComponentFixture<PersonRoleSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonRoleSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonRoleSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

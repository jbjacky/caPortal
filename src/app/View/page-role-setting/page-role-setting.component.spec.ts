import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRoleSettingComponent } from './page-role-setting.component';

describe('PageRoleSettingComponent', () => {
  let component: PageRoleSettingComponent;
  let fixture: ComponentFixture<PageRoleSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRoleSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRoleSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

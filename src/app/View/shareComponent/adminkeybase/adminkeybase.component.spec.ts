import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminkeybaseComponent } from './adminkeybase.component';

describe('AdminkeybaseComponent', () => {
  let component: AdminkeybaseComponent;
  let fixture: ComponentFixture<AdminkeybaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminkeybaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminkeybaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

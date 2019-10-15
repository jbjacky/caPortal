import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SussesApproveSnackComponent } from './susses-approve-snack.component';

describe('SussesApproveSnackComponent', () => {
  let component: SussesApproveSnackComponent;
  let fixture: ComponentFixture<SussesApproveSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SussesApproveSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SussesApproveSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

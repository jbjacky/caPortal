import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SussesSnackComponent } from './susses-snack.component';

describe('SussesSnackComponent', () => {
  let component: SussesSnackComponent;
  let fixture: ComponentFixture<SussesSnackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SussesSnackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SussesSnackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
